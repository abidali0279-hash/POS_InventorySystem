namespace POS.DTOs.Sales;

public class SaleResponseDto
{
    public int SaleId { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }
}