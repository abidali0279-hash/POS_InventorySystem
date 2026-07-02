using POS.API.DTOs.Product;
using POS.API.Models;

namespace POS.API.Interfaces.Services;

public interface IProductService
{
    Task<IEnumerable<ProductResponseDto>> GetAllAsync();

    Task<Product?> GetByIdAsync(int id);

    Task<Product> CreateAsync(CreateProductDto dto);

    Task<Product?> UpdateAsync(int id, UpdateProductDto dto);

    Task<bool> ToggleStatusAsync(int id);
}