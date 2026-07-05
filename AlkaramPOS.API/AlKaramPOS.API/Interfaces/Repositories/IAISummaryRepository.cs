using POS.API.Models;

namespace POS.API.Interfaces.Repositories;

public interface IAISummaryRepository
{
    Task AddAsync(AISummary summary);

    Task<List<AISummary>> GetAllAsync();

    Task SaveChangesAsync();
}