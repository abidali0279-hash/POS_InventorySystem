using Microsoft.EntityFrameworkCore;
using POS.API.Models;

namespace POS.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    public DbSet<Branch> Branches { get; set; }

    public DbSet<Category> Categories { get; set; }

    public DbSet<Product> Products { get; set; }

    public DbSet<Sale> Sales { get; set; }

    public DbSet<SaleItem> SaleItems { get; set; }

    public DbSet<Payment> Payments { get; set; }

    public DbSet<StockAdjustment> StockAdjustments { get; set; }

    public DbSet<StockMovement> StockMovements { get; set; }

    public DbSet<SaleReversal> SaleReversals { get; set; }

    public DbSet<AuditLog> AuditLogs { get; set; }

    public DbSet<RefreshToken> RefreshTokens { get; set; }

    public DbSet<SystemSetting> SystemSettings { get; set; }



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // USER EMAIL UNIQUE
        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();

        // PRODUCT SKU UNIQUE
        modelBuilder.Entity<Product>()
            .HasIndex(x => x.SKU)
            .IsUnique();

        // INVOICE NUMBER UNIQUE
        modelBuilder.Entity<Sale>()
            .HasIndex(x => x.InvoiceNumber)
            .IsUnique();



        // CATEGORY SELF RELATIONSHIP
        modelBuilder.Entity<Category>()
            .HasOne(c => c.ParentCategory)
            .WithMany(c => c.SubCategories)
            .HasForeignKey(c => c.ParentCategoryId)
            .OnDelete(DeleteBehavior.Restrict);



        // SALE → SALE ITEMS
        modelBuilder.Entity<SaleItem>()
            .HasOne(si => si.Sale)
            .WithMany(s => s.SaleItems)
            .HasForeignKey(si => si.SaleId);



        // PRODUCT → SALE ITEMS
        modelBuilder.Entity<SaleItem>()
            .HasOne(si => si.Product)
            .WithMany(p => p.SaleItems)
            .HasForeignKey(si => si.ProductId);



        // PRODUCT → STOCK ADJUSTMENTS
        modelBuilder.Entity<StockAdjustment>()
            .HasOne(sa => sa.Product)
            .WithMany(p => p.StockAdjustments)
            .HasForeignKey(sa => sa.ProductId);



        // PRODUCT → STOCK MOVEMENTS
        modelBuilder.Entity<StockMovement>()
            .HasOne(sm => sm.User)
            .WithMany()
            .HasForeignKey(sm => sm.PerformedBy);



        // SALE REVERSAL RELATIONSHIP
        modelBuilder.Entity<SaleReversal>()
            .HasOne(sr => sr.OriginalSale)
            .WithMany()
            .HasForeignKey(sr => sr.OriginalSaleId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<SaleReversal>()
            .HasOne(sr => sr.ReversalSale)
            .WithMany()
            .HasForeignKey(sr => sr.ReversalSaleId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}