CREATE TABLE SaleReversals (
    Id INT PRIMARY KEY IDENTITY,
    OriginalSaleId INT,
    ReversalSaleId INT,
    RequestedBy INT,
    ApprovedBy INT,
    Reason NVARCHAR(500),
    ApprovedAt DATETIME,

    FOREIGN KEY (OriginalSaleId) REFERENCES Sales(Id),
    FOREIGN KEY (ReversalSaleId) REFERENCES Sales(Id),
    FOREIGN KEY (RequestedBy) REFERENCES Users(Id),
    FOREIGN KEY (ApprovedBy) REFERENCES Users(Id)
)