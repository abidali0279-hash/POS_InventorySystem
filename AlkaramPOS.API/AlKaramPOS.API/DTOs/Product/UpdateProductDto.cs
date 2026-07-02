namespace POS.API.DTOs.Product;

public class UpdateProductDto
{
    public int CategoryId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Barcode { get; set; }

    public string Unit { get; set; } = string.Empty;

    public decimal PriceInPKR { get; set; }

    public decimal ReorderLevel { get; set; }

    public bool IsActive { get; set; }
}