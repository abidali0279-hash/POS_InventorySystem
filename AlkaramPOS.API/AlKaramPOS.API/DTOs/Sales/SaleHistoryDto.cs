namespace POS.DTOs.Sales;

public class SaleHistoryDto
{
    public int Id { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;

    public string CashierName { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}