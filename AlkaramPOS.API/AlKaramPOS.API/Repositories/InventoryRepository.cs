using Microsoft.EntityFrameworkCore;
using POS.API.Data;
using POS.API.Models;
using POS.Interfaces.Repositories;

namespace POS.Repositories;

public class InventoryRepository : IInventoryRepository
{
    private readonly AppDbContext _context;

    public InventoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Product?> GetProductAsync(int productId)
    {
        return await _context.Products
            .FirstOrDefaultAsync(x => x.Id == productId);
    }

    public async Task AddStockAdjustmentAsync(
        StockAdjustment adjustment)
    {
        await _context.StockAdjustments
            .AddAsync(adjustment);
    }

    public async Task AddStockMovementAsync(
        StockMovement movement)
    {
        await _context.StockMovements
            .AddAsync(movement);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<StockMovement>>
    GetHistoryAsync()
    {
        return await _context.StockMovements

            .Include(x => x.Product)

            .Include(x => x.User)

            .OrderByDescending(x => x.CreatedAt)

            .ToListAsync();
    }
}