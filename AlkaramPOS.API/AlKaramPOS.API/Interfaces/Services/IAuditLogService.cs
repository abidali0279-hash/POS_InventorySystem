using POS.API.Models;
using POS.DTOs.AuditLog;

namespace POS.Interfaces.Services;

public interface IAuditLogService
{
    Task<IEnumerable<AuditLog>> GetAllAsync();

    Task<AuditLog?> GetByIdAsync(int id);

    Task CreateAsync(AuditLogDto dto);
}