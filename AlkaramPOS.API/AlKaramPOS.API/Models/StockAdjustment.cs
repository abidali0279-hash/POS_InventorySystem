namespace POS.API.Models;

public class StockAdjustment
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int UserId { get; set; }

    public string AdjustmentType { get; set; } = string.Empty;

    public decimal Quantity { get; set; }

    public decimal StockBefore { get; set; }

    public decimal StockAfter { get; set; }

    public string Reason { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public Product? Product { get; set; }

    public User? User { get; set; }
}