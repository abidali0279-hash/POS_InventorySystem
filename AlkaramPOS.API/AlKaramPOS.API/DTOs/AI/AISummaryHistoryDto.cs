namespace POS.API.DTOs.AI;

public class AISummaryHistoryDto
{
    public int Id { get; set; }

    public decimal Revenue { get; set; }

    public int CompletedSales { get; set; }

    public int ReversedSales { get; set; }

    public string Summary { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}