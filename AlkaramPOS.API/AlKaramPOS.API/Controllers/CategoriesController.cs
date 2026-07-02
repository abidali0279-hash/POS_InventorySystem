using Microsoft.AspNetCore.Mvc;
using POS.API.DTOs.Category;
using POS.API.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;

namespace POS.API.Controllers;

[Authorize]
[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _categoryService.GetAllAsync();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategory(int id)
    {
        var category = await _categoryService.GetByIdAsync(id);

        if (category == null)
        {
            return NotFound(new
            {
                Message = "Category not found"
            });
        }

        return Ok(category);
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPost]
    public async Task<IActionResult> CreateCategory(CreateCategoryDto dto)
    {
        var category = await _categoryService.CreateAsync(dto);

        return Ok(new
        {
            Message = "Category created successfully",
            Data = category
        });
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(
        int id,
        UpdateCategoryDto dto)
    {
        var category =
            await _categoryService.UpdateAsync(id, dto);

        if (category == null)
        {
            return NotFound(new
            {
                Message = "Category not found"
            });
        }

        return Ok(new
        {
            Message = "Category updated successfully",
            Data = category
        });
    }
}