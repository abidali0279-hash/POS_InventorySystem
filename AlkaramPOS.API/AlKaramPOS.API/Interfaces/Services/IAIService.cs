using POS.API.DTOs.AI;

namespace POS.API.Interfaces;

public interface IAIService
{
    Task<AISummaryResponseDto> GenerateSummaryAsync();

    Task<List<AISummaryHistoryDto>> GetHistoryAsync();
}