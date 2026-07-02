using Microsoft.AspNetCore.Mvc;
using POS.DTOs.Auth;
using POS.Interfaces.Services;

namespace POS.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(
        IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginDto dto)
    {
        var result =
            await _authService
                .LoginAsync(dto);

        if (result == null)
        {
            return Unauthorized(new
            {
                Message =
                    "Invalid email or password"
            });
        }

        return Ok(result);
    }
}