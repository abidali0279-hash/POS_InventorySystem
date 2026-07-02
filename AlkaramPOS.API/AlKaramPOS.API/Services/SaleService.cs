using POS.API.Data;
using POS.API.Models;
using POS.DTOs.Sales;
using POS.Helpers;
using POS.Interfaces.Repositories;
using POS.Interfaces.Services;

namespace POS.Services;

public class SaleService : ISaleService
{
    private readonly ISaleRepository _saleRepository;
    private readonly AppDbContext _context;

    public SaleService(
        ISaleRepository saleRepository,AppDbContext context)
    {
        _saleRepository = saleRepository;
        _context = context;
    }

    public async Task<SaleResponseDto> CreateSaleAsync(CreateSaleDto dto)
    {
        using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            decimal totalAmount = 0;

            string invoiceNumber = InvoiceHelper.GenerateInvoice();

            var sale = new Sale
            {
                BranchId = dto.BranchId,
                CashierId = dto.CashierId,
                InvoiceNumber = invoiceNumber,
                Status = "Completed",
                TotalAmount = 0
            };

            await _saleRepository.AddSaleAsync(sale);

            await _saleRepository.SaveChangesAsync();

            foreach (var item in dto.Items)
            {
                var product =
                    await _saleRepository.GetProductAsync(item.ProductId);

                if (product == null)
                {
                    throw new Exception($"Product {item.ProductId} not found.");
                }

                if (product.CurrentStock < item.Quantity)
                {
                    throw new Exception($"Insufficient stock for {product.Name}.");
                }

                decimal lineTotal = product.PriceInPKR * item.Quantity;

                totalAmount += lineTotal;

                var saleItem = new SaleItem
                {
                    SaleId = sale.Id,
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    UnitPrice = product.PriceInPKR,
                    LineTotal = lineTotal
                };

                await _saleRepository.AddSaleItemAsync(saleItem);

                decimal beforeStock = product.CurrentStock;
                product.CurrentStock -= item.Quantity;
                decimal afterStock = product.CurrentStock;

                await _saleRepository.UpdateProductAsync(product);

                var stockMovement = new StockMovement
                    {
                        ProductId = product.Id,
                        MovementType = "Sale",
                        ReferenceId = sale.Id,
                        QuantityBefore = beforeStock,
                        QuantityChanged = item.Quantity,
                        QuantityAfter = afterStock,
                        PerformedBy = dto.CashierId
                    };

                await _saleRepository.AddStockMovementAsync(stockMovement);
            }

            sale.TotalAmount = totalAmount;

            var payment = new Payment
            {
                SaleId = sale.Id,
                PaymentMethod = dto.PaymentMethod,
                PaidAmount = totalAmount,
                ReferenceNumber = null
            };

            await _saleRepository.AddPaymentAsync(payment);

            await _saleRepository.SaveChangesAsync();
            await transaction.CommitAsync();
            return new SaleResponseDto
            {
                SaleId = sale.Id,
                InvoiceNumber = sale.InvoiceNumber,
                TotalAmount = totalAmount
            };
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<bool> ReverseSaleAsync(int saleId, ReverseSaleDto dto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var sale =
                await _saleRepository.GetSaleAsync(saleId);

            if (sale == null)
                return false;

            if (sale.Status == "Reversed")
                return false;

            var saleItems =
                await _saleRepository.GetSaleItemsAsync(saleId);

            foreach (var item in saleItems)
            {
                var product = await _saleRepository.GetProductAsync(item.ProductId);

                if (product == null)
                    continue;

                decimal beforeStock = product.CurrentStock;
                product.CurrentStock += item.Quantity;
                decimal afterStock = product.CurrentStock;
                await _saleRepository.UpdateProductAsync(product);

                var stockMovement =
                    new StockMovement
                    {
                        ProductId = product.Id,
                        MovementType = "Sale Reversal",
                        ReferenceId = sale.Id,
                        QuantityBefore = beforeStock,
                        QuantityChanged = item.Quantity,
                        QuantityAfter = afterStock,
                        PerformedBy = dto.ApprovedBy
                    };
                await _saleRepository.AddStockMovementAsync(stockMovement);
            }
            sale.Status = "Reversed";

            var reversal = new SaleReversal
            {
                OriginalSaleId = sale.Id,
                ReversalSaleId = sale.Id,
                RequestedBy = sale.CashierId,
                ApprovedBy = dto.ApprovedBy,
                Reason = dto.Reason,
                ApprovedAt = DateTime.Now
            };

            await _saleRepository.AddSaleReversalAsync(reversal);

            await _saleRepository.SaveChangesAsync();

            await transaction.CommitAsync();

            return true;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<IEnumerable<SaleHistoryDto>>
    GetSalesAsync()
    {
        var sales =
            await _saleRepository.GetSalesAsync();

        return sales.Select(x =>
            new SaleHistoryDto
            {
                Id = x.Id,
                InvoiceNumber = x.InvoiceNumber,
                CashierName = x.Cashier?.FullName ?? "",
                TotalAmount = x.TotalAmount,
                Status = x.Status,
                CreatedAt = x.CreatedAt
            });
    }
}
