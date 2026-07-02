namespace POS.API.Models;

public class AuditLog
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string ActionType { get; set; } = string.Empty;

    public string TargetEntity { get; set; } = string.Empty;

    public int TargetId { get; set; }

    public string? OldValue { get; set; }

    public string? NewValue { get; set; }

    public string? IPAddress { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public User? User { get; set; }
}