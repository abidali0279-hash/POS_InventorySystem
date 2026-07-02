namespace POS.DTOs.Inventory;

public class StockAdjustmentDto
{
    public int ProductId { get; set; }

    public decimal Quantity { get; set; }

    // Increase or Decrease
    public string AdjustmentType { get; set; } = string.Empty;

    public string Reason { get; set; } = string.Empty;

    public int UserId { get; set; }
}