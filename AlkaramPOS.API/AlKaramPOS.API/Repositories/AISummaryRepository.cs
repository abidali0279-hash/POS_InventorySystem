using Microsoft.EntityFrameworkCore;
using POS.API.Data;
using POS.API.Interfaces.Repositories;
using POS.API.Models;

namespace POS.API.Repositories;

public class AISummaryRepository : IAISummaryRepository
{
    private readonly AppDbContext _context;

    public AISummaryRepository(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(
        AISummary summary)
    {
        await _context.AISummaries
            .AddAsync(summary);
    }

    public async Task<List<AISummary>> GetAllAsync()
    {
        return await _context.AISummaries
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}