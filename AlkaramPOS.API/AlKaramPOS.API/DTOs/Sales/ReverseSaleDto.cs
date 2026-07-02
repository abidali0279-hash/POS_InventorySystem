namespace POS.DTOs.Sales;

public class ReverseSaleDto
{
    public int ApprovedBy { get; set; }

    public string Reason { get; set; } = string.Empty;
}