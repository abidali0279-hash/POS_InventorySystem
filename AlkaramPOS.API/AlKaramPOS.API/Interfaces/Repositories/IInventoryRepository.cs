using POS.API.Models;

public interface IInventoryRepository
{
    Task<Product?> GetProductAsync(int productId);

    Task AddStockAdjustmentAsync(
        StockAdjustment adjustment);

    Task AddStockMovementAsync(
        StockMovement movement);

    Task<IEnumerable<StockMovement>>
        GetHistoryAsync();

    Task SaveChangesAsync();
}