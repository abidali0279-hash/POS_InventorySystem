using POS.API.Models;
using POS.DTOs.User;

namespace POS.Interfaces.Services;

public interface IUserService
{
    Task<IEnumerable<UserResponseDto>> GetAllAsync();

    Task<User?> GetByIdAsync(int id);

    Task<User> CreateAsync(CreateUserDto dto);

    Task<User?> UpdateAsync(
        int id,
        UpdateUserDto dto);

    Task<bool> ToggleStatusAsync(int id);
}