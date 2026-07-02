using POS.DTOs.Inventory;

namespace POS.Interfaces.Services;

public interface IInventoryService
{
    Task<bool> AdjustStockAsync(
        StockAdjustmentDto dto);

    Task<IEnumerable<InventoryHistoryDto>>
        GetHistoryAsync();
}