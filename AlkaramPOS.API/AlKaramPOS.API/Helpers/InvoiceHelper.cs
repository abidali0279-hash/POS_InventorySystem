namespace POS.Helpers;

public static class InvoiceHelper
{
    public static string GenerateInvoice()
    {
        return $"INV-{DateTime.Now:yyyyMMddHHmmss}";
    }
}