using System.Net.ServerSentEvents;

namespace POS.API.Models;

public class Sale
{
    public int Id { get; set; }

    public int BranchId { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;

    public int CashierId { get; set; }

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public Branch? Branch { get; set; }

    public User? Cashier { get; set; }

    public ICollection<SaleItem>? SaleItems { get; set; }

    public ICollection<Payment>? Payments { get; set; }
}