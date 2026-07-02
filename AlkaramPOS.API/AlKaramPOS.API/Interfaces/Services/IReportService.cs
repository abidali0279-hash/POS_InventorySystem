using POS.DTOs.Reports;

namespace POS.Interfaces.Services;

public interface IReportService
{
    Task<DashboardDto> GetDashboardAsync();

    Task<IEnumerable<DailySalesDto>> GetDailySalesAsync();

    Task<IEnumerable<TopProductDto>> GetTopProductsAsync();

    Task<IEnumerable<object>> GetLowStockProductsAsync();
}