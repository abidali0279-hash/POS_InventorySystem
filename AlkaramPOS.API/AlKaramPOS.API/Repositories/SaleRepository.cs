using Microsoft.EntityFrameworkCore;
using POS.API.Data;
using POS.API.Models;
using POS.Interfaces.Repositories;

namespace POS.Repositories;

public class SaleRepository : ISaleRepository
{
    private readonly AppDbContext _context;

    public SaleRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Product?> GetProductAsync(int productId)
    {
        return await _context.Products.FirstOrDefaultAsync(x => x.Id == productId);
    }

    public async Task AddSaleAsync(Sale sale)
    {
        await _context.Sales.AddAsync(sale);
    }

    public async Task AddSaleItemAsync(SaleItem saleItem)
    {
        await _context.SaleItems.AddAsync(saleItem);
    }

    public async Task AddPaymentAsync(Payment payment)
    {
        await _context.Payments.AddAsync(payment);
    }

    public async Task AddStockMovementAsync(StockMovement movement)
    {
        await _context.StockMovements.AddAsync(movement);
    }

    public async Task UpdateProductAsync(Product product)
    {
        _context.Products.Update(product);
        await Task.CompletedTask;
    }

    public async Task<Sale?> GetSaleAsync(
    int saleId)
    {
        return await _context.Sales.FirstOrDefaultAsync(x => x.Id == saleId);
    }

    public async Task<List<SaleItem>> GetSaleItemsAsync(int saleId)
    {
        return await _context.SaleItems.Where(x => x.SaleId == saleId).ToListAsync();
    }

    public async Task AddSaleReversalAsync(SaleReversal reversal)
    {
        await _context.SaleReversals.AddAsync(reversal);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<List<Sale>> GetSalesAsync()
    {
        return await _context.Sales.Include(x => x.Cashier).OrderByDescending(x => x.CreatedAt).ToListAsync();
    }

    public async Task<decimal> GetTotalRevenueAsync()
    {
        return await _context.Sales.Where(x => x.Status == "Completed").SumAsync(x => x.TotalAmount);
    }

    public async Task<int> GetCompletedSalesCountAsync()
    {
        return await _context.Sales.CountAsync(x => x.Status == "Completed");
    }

    public async Task<int> GetReversedSalesCountAsync()
    {
        return await _context.Sales.CountAsync(x => x.Status == "Reversed");
    }

    public async Task<List<(string ProductName, int Quantity)>> GetTopSellingProductsAsync(int count = 5)
    {
        var data = await _context.SaleItems.Include(x => x.Product).GroupBy(x => x.Product!.Name).Select(g => new
            {
                ProductName = g.Key,
                Quantity = g.Sum(x => x.Quantity)
            })
            .OrderByDescending(x => x.Quantity).Take(count).ToListAsync();

        return data
            .Select(x => (x.ProductName, (int)x.Quantity)).ToList();
    }

    public async Task<List<string>> GetLowStockProductsAsync()
    {
        return await _context.Products.Where(x => x.CurrentStock <= x.ReorderLevel).Select(x => x.Name).ToListAsync();
    }
}