using Microsoft.EntityFrameworkCore;
using POS.API.Data;
using POS.DTOs.Reports;
using POS.Interfaces.Services;

namespace POS.Services;

public class ReportService : IReportService
{
    private readonly AppDbContext _context;

    public ReportService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardDto> GetDashboardAsync()
    {
        var todaySales =
            await _context.Sales
            .Where(x =>
                x.CreatedAt.Date ==
                DateTime.Today)
            .SumAsync(x =>
                (decimal?)x.TotalAmount) ?? 0;

        var totalProducts =
            await _context.Products.CountAsync();

        var totalUsers =
            await _context.Users.CountAsync();

        var lowStock =
            await _context.Products
            .CountAsync(x =>
                x.CurrentStock <= x.ReorderLevel);

        return new DashboardDto
        {
            TodaySales = todaySales,
            TotalProducts = totalProducts,
            TotalUsers = totalUsers,
            LowStockProducts = lowStock
        };
    }

    public async Task<IEnumerable<DailySalesDto>>
        GetDailySalesAsync()
    {
        return await _context.Sales
            .GroupBy(x => x.CreatedAt.Date)
            .Select(x =>
                new DailySalesDto
                {
                    Date = x.Key,
                    TotalSales =
                        x.Sum(y =>
                            y.TotalAmount)
                })
            .OrderByDescending(x => x.Date)
            .Take(30)
            .ToListAsync();
    }

    public async Task<IEnumerable<TopProductDto>>
        GetTopProductsAsync()
    {
        return await _context.SaleItems
            .GroupBy(x => x.Product.Name)
            .Select(x =>
                new TopProductDto
                {
                    ProductName = x.Key,
                    QuantitySold =
                        x.Sum(y =>
                            y.Quantity)
                })
            .OrderByDescending(x =>
                x.QuantitySold)
            .Take(10)
            .ToListAsync();
    }

    public async Task<IEnumerable<object>>
        GetLowStockProductsAsync()
    {
        return await _context.Products
            .Where(x =>
                x.CurrentStock <=
                x.ReorderLevel)
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.CurrentStock,
                x.ReorderLevel
            })
            .ToListAsync<object>();
    }


}