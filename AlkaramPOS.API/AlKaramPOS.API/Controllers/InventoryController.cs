using Microsoft.AspNetCore.Mvc;
using POS.DTOs.Inventory;
using POS.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;

namespace POS.Controllers;

[Authorize(Roles = "Admin,InventoryManager")]
[ApiController]
[Route("api/inventory")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public InventoryController(
        IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    [HttpPost("adjust-stock")]
    public async Task<IActionResult> AdjustStock(
        StockAdjustmentDto dto)
    {
        var result =
            await _inventoryService
                .AdjustStockAsync(dto);

        if (!result)
        {
            return BadRequest(new
            {
                Message =
                    "Stock adjustment failed"
            });
        }

        return Ok(new
        {
            Message =
                "Stock adjusted successfully"
        });
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory()
    {
        var history =
            await _inventoryService
                .GetHistoryAsync();

        return Ok(history);
    }
}