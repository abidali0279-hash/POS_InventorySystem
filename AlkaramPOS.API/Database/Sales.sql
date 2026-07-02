CREATE TABLE Sales (
    Id INT PRIMARY KEY IDENTITY,
    BranchId INT,
    InvoiceNumber NVARCHAR(100) UNIQUE,
    CashierId INT,
    TotalAmount DECIMAL(18,2),
    Status NVARCHAR(50),
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (BranchId) REFERENCES Branches(Id),
    FOREIGN KEY (CashierId) REFERENCES Users(Id)
)