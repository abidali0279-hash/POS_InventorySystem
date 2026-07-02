CREATE TABLE Payments (
    Id INT PRIMARY KEY IDENTITY,
    SaleId INT,
    PaymentMethod NVARCHAR(50),
    PaidAmount DECIMAL(18,2),
    ReferenceNumber NVARCHAR(100),
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (SaleId) REFERENCES Sales(Id)
)