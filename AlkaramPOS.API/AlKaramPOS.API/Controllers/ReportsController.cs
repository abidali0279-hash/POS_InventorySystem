using Microsoft.AspNetCore.Mvc;
using POS.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;

namespace POS.Controllers;

[Authorize(Roles = "Admin,Manager")]
[ApiController]
[Route("api/reports")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(
        IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        return Ok(
            await _reportService
                .GetDashboardAsync());
    }

    [HttpGet("daily-sales")]
    public async Task<IActionResult> DailySales()
    {
        return Ok(
            await _reportService
                .GetDailySalesAsync());
    }

    [HttpGet("top-products")]
    public async Task<IActionResult> TopProducts()
    {
        return Ok(
            await _reportService
                .GetTopProductsAsync());
    }

    [HttpGet("low-stock")]
    public async Task<IActionResult> LowStock()
    {
        return Ok(
            await _reportService
                .GetLowStockProductsAsync());
    }
}