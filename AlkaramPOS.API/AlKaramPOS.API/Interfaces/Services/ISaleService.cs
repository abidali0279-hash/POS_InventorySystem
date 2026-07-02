using POS.DTOs.Sales;

namespace POS.Interfaces.Services;

public interface ISaleService
{
    Task<SaleResponseDto> CreateSaleAsync(CreateSaleDto dto);

    Task<bool> ReverseSaleAsync(
        int saleId,
        ReverseSaleDto dto);

    Task<IEnumerable<SaleHistoryDto>> GetSalesAsync();
}