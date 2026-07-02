using POS.API.DTOs.Product;
using POS.API.Interfaces.Repositories;
using POS.API.Interfaces.Services;
using POS.API.Models;

namespace POS.API.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<IEnumerable<ProductResponseDto>> GetAllAsync()
    {
        var products = await _productRepository.GetAllAsync();

        return products.Select(x =>
    new ProductResponseDto
    {
        Id = x.Id,
        Name = x.Name,
        SKU = x.SKU,
        PriceInPKR = x.PriceInPKR,
        CurrentStock = x.CurrentStock,
        ReorderLevel = x.ReorderLevel,
        IsActive = x.IsActive,
        CategoryId = x.CategoryId,
        CategoryName = x.Category?.Name ?? ""
    });
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _productRepository.GetByIdAsync(id);
    }

    public async Task<Product> CreateAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            BranchId = dto.BranchId,
            CategoryId = dto.CategoryId,
            Name = dto.Name,
            SKU = dto.SKU,
            Barcode = dto.Barcode,
            Unit = dto.Unit,
            PriceInPKR = dto.PriceInPKR,
            CurrentStock = dto.CurrentStock,
            ReorderLevel = dto.ReorderLevel
        };

        await _productRepository.AddAsync(product);

        await _productRepository.SaveChangesAsync();

        return product;
    }

    public async Task<Product?> UpdateAsync(int id, UpdateProductDto dto)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product == null)
            return null;

        product.Name = dto.Name;
        product.CategoryId = dto.CategoryId;
        product.Barcode = dto.Barcode;
        product.Unit = dto.Unit;
        product.PriceInPKR = dto.PriceInPKR;
        product.ReorderLevel = dto.ReorderLevel;
        product.IsActive = dto.IsActive;
        product.UpdatedAt = DateTime.Now;

        await _productRepository.UpdateAsync(product);

        await _productRepository.SaveChangesAsync();

        return product;
    }

    public async Task<bool> ToggleStatusAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product == null)
            return false;

        product.IsActive = !product.IsActive;

        await _productRepository.UpdateAsync(product);

        await _productRepository.SaveChangesAsync();

        return true;
    }
}