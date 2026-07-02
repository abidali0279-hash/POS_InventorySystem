namespace POS.DTOs.Inventory;

public class InventoryHistoryDto
{
    public int Id { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public string MovementType { get; set; } = string.Empty;

    public decimal QuantityBefore { get; set; }

    public decimal QuantityChanged { get; set; }

    public decimal QuantityAfter { get; set; }

    public string PerformedBy { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}