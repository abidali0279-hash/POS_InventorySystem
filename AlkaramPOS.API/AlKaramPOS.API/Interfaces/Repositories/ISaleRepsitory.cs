using POS.API.Models;

namespace POS.Interfaces.Repositories;

public interface ISaleRepository
{
    Task<Product?> GetProductAsync(int productId);

    Task AddSaleAsync(Sale sale);

    Task AddSaleItemAsync(SaleItem saleItem);

    Task AddPaymentAsync(Payment payment);

    Task AddStockMovementAsync(StockMovement movement);

    Task UpdateProductAsync(Product product);

    Task SaveChangesAsync();

    Task<Sale?> GetSaleAsync(int saleId);

    Task<List<SaleItem>> GetSaleItemsAsync(int saleId);

    Task AddSaleReversalAsync(SaleReversal reversal);

    Task<List<Sale>> GetSalesAsync();
}