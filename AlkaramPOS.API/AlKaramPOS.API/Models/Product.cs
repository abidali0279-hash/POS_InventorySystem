using System.Net.ServerSentEvents;

namespace POS.API.Models;

public class Product
{
    public int Id { get; set; }

    public int BranchId { get; set; }

    public int CategoryId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string SKU { get; set; } = string.Empty;

    public string? Barcode { get; set; }

    public string Unit { get; set; } = string.Empty;

    public decimal PriceInPKR { get; set; }

    public decimal CurrentStock { get; set; }

    public decimal ReorderLevel { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime? UpdatedAt { get; set; }

    public Branch? Branch { get; set; }

    public Category? Category { get; set; }

    public ICollection<SaleItem>? SaleItems { get; set; }

    public ICollection<StockAdjustment>? StockAdjustments { get; set; }

    public ICollection<StockMovement>? StockMovements { get; set; }
}