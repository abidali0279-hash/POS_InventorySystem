using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using POS.API.Interfaces;

namespace POS.API.Controllers;

[ApiController]
[Route("api/ai")]
[Authorize]
public class AIController : ControllerBase
{
    private readonly IAIService _aiService;

    public AIController(IAIService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost("sales-summary")]
    public async Task<IActionResult> GenerateSummary()
    {
        var result =
            await _aiService.GenerateSummaryAsync();

        return Ok(result);
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory()
    {
        var result =
            await _aiService.GetHistoryAsync();

        return Ok(result);
    }
}