namespace POS.DTOs.Sales;

public class CreateSaleDto
{
    public int BranchId { get; set; }

    public int CashierId { get; set; }

    public string PaymentMethod { get; set; } = "Cash";

    public List<SaleItemDto> Items { get; set; } = new();
}