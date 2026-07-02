CREATE TABLE StockAdjustments (
    Id INT PRIMARY KEY IDENTITY,
    ProductId INT,
    UserId INT,
    AdjustmentType NVARCHAR(50),
    Quantity DECIMAL(18,2),
    StockBefore DECIMAL(18,2),
    StockAfter DECIMAL(18,2),
    Reason NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (ProductId) REFERENCES Products(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
)