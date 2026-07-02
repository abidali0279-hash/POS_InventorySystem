using Microsoft.AspNetCore.Mvc;
using POS.DTOs.Sales;
using POS.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;

namespace POS.Controllers;

[Authorize(Roles = "Admin,Cashier")]
[ApiController]
[Route("api/sales")]
public class SalesController : ControllerBase
{
    private readonly ISaleService _saleService;

    public SalesController(
        ISaleService saleService)
    {
        _saleService = saleService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateSale(
        CreateSaleDto dto)
    {
        var result =
            await _saleService.CreateSaleAsync(dto);

        return Ok(result);
    }


    [Authorize(Roles = "Admin,Manager")]
    [HttpPost("{saleId}/reverse")]
    public async Task<IActionResult> ReverseSale(int saleId,ReverseSaleDto dto)
    {
        var result = await _saleService.ReverseSaleAsync(saleId,dto);

        if (!result)
        {
            return BadRequest("Sale cannot be reversed.");
        }

        return Ok(new
        {
            Message ="Sale reversed successfully."
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetSales()
    {
        var sales = await _saleService.GetSalesAsync();

        return Ok(sales);
    }
}