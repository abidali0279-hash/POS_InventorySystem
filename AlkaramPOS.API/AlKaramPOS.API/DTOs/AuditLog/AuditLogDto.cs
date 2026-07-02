namespace POS.DTOs.AuditLog;

public class AuditLogDto
{
    public int UserId { get; set; }

    public string ActionType { get; set; } = string.Empty;

    public string TargetEntity { get; set; } = string.Empty;

    public int TargetId { get; set; }

    public string? OldValue { get; set; }

    public string? NewValue { get; set; }
}