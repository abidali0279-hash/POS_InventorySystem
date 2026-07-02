using POS.API.DTOs.Category;
using POS.API.Models;

namespace POS.API.Interfaces.Services;

public interface ICategoryService
{
    Task<IEnumerable<Category>> GetAllAsync();

    Task<Category?> GetByIdAsync(int id);

    Task<Category> CreateAsync(CreateCategoryDto dto);

    Task<Category?> UpdateAsync(int id, UpdateCategoryDto dto);
}