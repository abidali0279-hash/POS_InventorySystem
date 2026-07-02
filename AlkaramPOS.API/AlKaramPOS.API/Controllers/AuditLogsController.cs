using Microsoft.AspNetCore.Mvc;
using POS.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;

namespace POS.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/audit-logs")]
public class AuditLogsController : ControllerBase
{
    private readonly IAuditLogService _auditLogService;

    public AuditLogsController(
        IAuditLogService auditLogService)
    {
        _auditLogService = auditLogService;
    }

    [HttpGet]
    public async Task<IActionResult> GetLogs()
    {
        return Ok(
            await _auditLogService
                .GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetLog(
        int id)
    {
        var log =
            await _auditLogService
                .GetByIdAsync(id);

        if (log == null)
            return NotFound();

        return Ok(log);
    }
}