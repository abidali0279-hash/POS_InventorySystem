using Microsoft.EntityFrameworkCore;
using POS.API.Data;
using POS.DTOs.Auth;
using POS.Helpers;
using POS.Interfaces.Services;

namespace POS.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly JwtHelper _jwtHelper;

    public AuthService(
        AppDbContext context,
        JwtHelper jwtHelper)
    {
        _context = context;
        _jwtHelper = jwtHelper;
    }

    public async Task<LoginResponseDto?> LoginAsync(
        LoginDto dto)
    {
        var user =
            await _context.Users
            .FirstOrDefaultAsync(
                x => x.Email == dto.Email);

        if (user == null)
            return null;

        bool validPassword =
            BCrypt.Net.BCrypt.Verify(
                dto.Password,
                user.PasswordHash);

        if (!validPassword)
            return null;

        string token =
            _jwtHelper.GenerateToken(user);

        return new LoginResponseDto
        {
            Id = user.Id,
            Token = token,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role
        };
    }
}