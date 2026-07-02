using POS.API.Models;
using POS.DTOs.User;
using POS.Interfaces.Repositories;
using POS.Interfaces.Services;

namespace POS.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllAsync()
    {
        var users =
            await _userRepository.GetAllAsync();

        return users.Select(x =>
            new UserResponseDto
            {
                Id = x.Id,
                BranchId = x.BranchId,
                FullName = x.FullName,
                Email = x.Email,
                Role = x.Role,
                IsActive = x.IsActive
            });
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _userRepository.GetByIdAsync(id);
    }

    public async Task<User> CreateAsync(CreateUserDto dto)
    {
        var existingUser =
            await _userRepository.GetByEmailAsync(dto.Email);

        if (existingUser != null)
        {
            throw new Exception("Email already exists.");
        }

        var user = new User
        {
            BranchId = dto.BranchId,
            FullName = dto.FullName,
            Email = dto.Email,
            Role = dto.Role,
            PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.Password),
            IsActive = true,
            CreatedAt = DateTime.Now
        };

        await _userRepository.AddAsync(user);

        await _userRepository.SaveChangesAsync();

        return user;
    }

    public async Task<User?> UpdateAsync(
        int id,
        UpdateUserDto dto)
    {
        var user =
            await _userRepository.GetByIdAsync(id);

        if (user == null)
            return null;

        user.FullName = dto.FullName;
        user.Role = dto.Role;
        user.IsActive = dto.IsActive;

        await _userRepository.UpdateAsync(user);

        await _userRepository.SaveChangesAsync();

        return user;
    }

    public async Task<bool> ToggleStatusAsync(int id)
    {
        var user =
            await _userRepository.GetByIdAsync(id);

        if (user == null)
            return false;

        user.IsActive = !user.IsActive;

        await _userRepository.UpdateAsync(user);

        await _userRepository.SaveChangesAsync();

        return true;
    }
}