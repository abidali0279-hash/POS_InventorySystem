namespace POS.DTOs.Reports;

public class DashboardDto
{
    public decimal TodaySales { get; set; }

    public int TotalProducts { get; set; }

    public int TotalUsers { get; set; }

    public int LowStockProducts { get; set; }
}