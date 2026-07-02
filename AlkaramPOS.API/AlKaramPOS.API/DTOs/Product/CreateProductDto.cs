namespace POS.API.DTOs.Product;

public class CreateProductDto
{
    public int BranchId { get; set; }

    public int CategoryId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string SKU { get; set; } = string.Empty;

    public string? Barcode { get; set; }

    public string Unit { get; set; } = string.Empty;

    public decimal PriceInPKR { get; set; }

    public decimal CurrentStock { get; set; }

    public decimal ReorderLevel { get; set; }
}