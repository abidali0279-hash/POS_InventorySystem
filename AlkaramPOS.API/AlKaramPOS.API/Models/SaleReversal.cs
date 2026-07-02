namespace POS.API.Models;

public class SaleReversal
{
    public int Id { get; set; }

    public int OriginalSaleId { get; set; }

    public int ReversalSaleId { get; set; }

    public int RequestedBy { get; set; }

    public int ApprovedBy { get; set; }

    public string Reason { get; set; } = string.Empty;

    public DateTime ApprovedAt { get; set; }

    public Sale? OriginalSale { get; set; }

    public Sale? ReversalSale { get; set; }
}