namespace POS.DTOs.Reports;

public class TopProductDto
{
    public string ProductName { get; set; } = string.Empty;

    public decimal QuantitySold { get; set; }
}