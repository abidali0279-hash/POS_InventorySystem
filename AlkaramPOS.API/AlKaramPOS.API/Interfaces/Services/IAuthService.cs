using POS.DTOs.Auth;

namespace POS.Interfaces.Services;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(
        LoginDto dto);
}