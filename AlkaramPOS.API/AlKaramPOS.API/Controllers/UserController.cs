using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using POS.DTOs.User;
using POS.Interfaces.Services;

namespace POS.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(
        IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        return Ok(
            await _userService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(
        int id)
    {
        var user =
            await _userService.GetByIdAsync(id);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser(
        CreateUserDto dto)
    {
        var user =
            await _userService.CreateAsync(dto);

        return Ok(user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(
        int id,
        UpdateUserDto dto)
    {
        var user =
            await _userService.UpdateAsync(id, dto);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> ToggleStatus(
    int id)
    {
        var success =
            await _userService.ToggleStatusAsync(id);

        if (!success)
            return NotFound();

        return Ok(new
        {
            message = "User status updated successfully"
        });
    }
}