namespace POS.API.Models;

public class Branch
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public ICollection<User>? Users { get; set; }

    public ICollection<Product>? Products { get; set; }
}