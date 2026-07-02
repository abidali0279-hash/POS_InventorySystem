namespace POS.API.Models;

public class Payment
{
    public int Id { get; set; }

    public int SaleId { get; set; }

    public string PaymentMethod { get; set; } = string.Empty;

    public decimal PaidAmount { get; set; }

    public string? ReferenceNumber { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public Sale? Sale { get; set; }
}