using POS.API.DTOs.Category;
using POS.API.Interfaces.Repositories;
using POS.API.Interfaces.Services;
using POS.API.Models;

namespace POS.API.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        return await _categoryRepository.GetAllAsync();
    }

    public async Task<Category?> GetByIdAsync(int id)
    {
        return await _categoryRepository.GetByIdAsync(id);
    }

    public async Task<Category> CreateAsync(CreateCategoryDto dto)
    {
        var category = new Category
        {
            Name = dto.Name,
            ParentCategoryId = dto.ParentCategoryId
        };

        await _categoryRepository.AddAsync(category);

        await _categoryRepository.SaveChangesAsync();

        return category;
    }

    public async Task<Category?> UpdateAsync(int id, UpdateCategoryDto dto)
    {
        var category = await _categoryRepository.GetByIdAsync(id);

        if (category == null)
            return null;

        category.Name = dto.Name;
        category.IsActive = dto.IsActive;

        await _categoryRepository.UpdateAsync(category);

        await _categoryRepository.SaveChangesAsync();

        return category;
    }
}