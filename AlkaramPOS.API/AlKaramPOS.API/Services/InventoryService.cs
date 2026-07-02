using POS.API.Models;
using POS.DTOs.Inventory;
using POS.Interfaces.Repositories;
using POS.Interfaces.Services;

namespace POS.Services;

public class InventoryService : IInventoryService
{
    private readonly IInventoryRepository _inventoryRepository;

    public InventoryService(
        IInventoryRepository inventoryRepository)
    {
        _inventoryRepository = inventoryRepository;
    }

    public async Task<bool> AdjustStockAsync(
        StockAdjustmentDto dto)
    {
        var product =
            await _inventoryRepository
                .GetProductAsync(dto.ProductId);

        if (product == null)
            return false;

        decimal beforeStock = product.CurrentStock;

        if (dto.AdjustmentType == "Increase")
        {
            product.CurrentStock += dto.Quantity;
        }
        else
        {
            if (product.CurrentStock < dto.Quantity)
                return false;

            product.CurrentStock -= dto.Quantity;
        }

        decimal afterStock = product.CurrentStock;

        var adjustment = new StockAdjustment
        {
            ProductId = dto.ProductId,
            UserId = dto.UserId,
            AdjustmentType = dto.AdjustmentType,
            Quantity = dto.Quantity,
            StockBefore = beforeStock,
            StockAfter = afterStock,
            Reason = dto.Reason
        };

        var movement = new StockMovement
        {
            ProductId = dto.ProductId,
            MovementType = dto.AdjustmentType,
            ReferenceId = 0,
            QuantityBefore = beforeStock,
            QuantityChanged = dto.Quantity,
            QuantityAfter = afterStock,
            PerformedBy = dto.UserId
        };

        await _inventoryRepository
            .AddStockAdjustmentAsync(adjustment);

        await _inventoryRepository
            .AddStockMovementAsync(movement);

        await _inventoryRepository
            .SaveChangesAsync();

        return true;
    }

    public async Task<IEnumerable<InventoryHistoryDto>>
    GetHistoryAsync()
    {
        var history =
            await _inventoryRepository
                .GetHistoryAsync();

        return history.Select(x =>
            new InventoryHistoryDto
            {
                Id = x.Id,
                ProductName =
                    x.Product?.Name ?? "",
                MovementType =
                    x.MovementType,
                QuantityBefore =
                    x.QuantityBefore,
                QuantityChanged =
                    x.QuantityChanged,
                QuantityAfter =
                    x.QuantityAfter,
                PerformedBy =
                    x.User?.FullName ?? "",
                CreatedAt =
                    x.CreatedAt
            });
    }
}