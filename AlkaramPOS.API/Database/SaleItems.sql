CREATE TABLE SaleItems (
    Id INT PRIMARY KEY IDENTITY,
    SaleId INT,
    ProductId INT,
    Quantity DECIMAL(18,2),
    UnitPrice DECIMAL(18,2),
    LineTotal DECIMAL(18,2),

    FOREIGN KEY (SaleId) REFERENCES Sales(Id),
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
)