using POS.API.Models;
using POS.DTOs.AuditLog;
using POS.Interfaces.Repositories;
using POS.Interfaces.Services;

namespace POS.Services;

public class AuditLogService : IAuditLogService
{
    private readonly IAuditLogRepository _repository;

    public AuditLogService(
        IAuditLogRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<AuditLog>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<AuditLog?> GetByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task CreateAsync(AuditLogDto dto)
    {
        var log = new AuditLog
        {
            UserId = dto.UserId,
            ActionType = dto.ActionType,
            TargetEntity = dto.TargetEntity,
            TargetId = dto.TargetId,
            OldValue = dto.OldValue,
            NewValue = dto.NewValue,
            CreatedAt = DateTime.Now
        };

        await _repository.AddAsync(log);

        await _repository.SaveChangesAsync();
    }
}