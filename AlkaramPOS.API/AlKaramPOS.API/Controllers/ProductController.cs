using POS.API.DTOs.Product;
using POS.API.Interfaces;
using POS.API.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace POS.API.Controllers;

[Authorize]
[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    // GET: api/products
    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _productService.GetAllAsync();

        return Ok(products);
    }

    // GET: api/products/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await _productService.GetByIdAsync(id);

        if (product == null)
        {
            return NotFound(new
            {
                message = "Product not found"
            });
        }

        return Ok(product);
    }

    // POST: api/products
    [Authorize(Roles = "Admin,Manager")]
    [HttpPost]
    public async Task<IActionResult> CreateProduct(CreateProductDto dto)
    {
        var product = await _productService.CreateAsync(dto);

        return Ok(new
        {
            message = "Product created successfully",
            data = product
        });
    }

    // PUT: api/products/5
    [Authorize(Roles = "Admin,Manager")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto dto)
    {
        var product = await _productService.UpdateAsync(id, dto);

        if (product == null)
        {
            return NotFound(new
            {
                message = "Product not found"
            });
        }

        return Ok(new
        {
            message = "Product updated successfully",
            data = product
        });
    }

    // PATCH: api/products/5/status
    [Authorize(Roles = "Admin,Manager")]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> ToggleStatus(int id)
    {
        var success = await _productService.ToggleStatusAsync(id);

        if (!success)
        {
            return NotFound(new
            {
                message = "Product not found"
            });
        }

        return Ok(new
        {
            message = "Product status updated successfully"
        });
    }
}