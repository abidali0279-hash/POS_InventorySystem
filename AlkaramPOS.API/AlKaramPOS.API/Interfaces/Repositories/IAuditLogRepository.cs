using POS.API.Models;

namespace POS.Interfaces.Repositories;

public interface IAuditLogRepository
{
    Task<IEnumerable<AuditLog>> GetAllAsync();

    Task<AuditLog?> GetByIdAsync(int id);

    Task AddAsync(AuditLog log);

    Task SaveChangesAsync();
}