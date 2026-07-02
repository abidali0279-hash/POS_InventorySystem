using System.ComponentModel.DataAnnotations.Schema;

namespace POS.API.Models;

public class StockMovement
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public string MovementType { get; set; } = string.Empty;

    public int ReferenceId { get; set; }

    public decimal QuantityBefore { get; set; }

    public decimal QuantityChanged { get; set; }

    public decimal QuantityAfter { get; set; }

    public int PerformedBy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public Product? Product { get; set; }

    [ForeignKey(nameof(PerformedBy))]
    public User? User { get; set; }
}