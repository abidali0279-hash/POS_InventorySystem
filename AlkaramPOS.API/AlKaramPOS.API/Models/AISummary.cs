namespace POS.API.Models;

public class AISummary
{
    public int Id { get; set; }

    public string Summary { get; set; } = string.Empty;

    public decimal Revenue { get; set; }

    public int CompletedSales { get; set; }

    public int ReversedSales { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}