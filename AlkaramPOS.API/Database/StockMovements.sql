CREATE TABLE StockMovements (
    Id INT PRIMARY KEY IDENTITY,
    ProductId INT,
    MovementType NVARCHAR(100),
    ReferenceId INT,
    QuantityBefore DECIMAL(18,2),
    QuantityChanged DECIMAL(18,2),
    QuantityAfter DECIMAL(18,2),
    PerformedBy INT,
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (ProductId) REFERENCES Products(Id),
    FOREIGN KEY (PerformedBy) REFERENCES Users(Id)
)