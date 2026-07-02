CREATE TABLE AuditLogs (
    Id INT PRIMARY KEY IDENTITY,
    UserId INT,
    ActionType NVARCHAR(100),
    TargetEntity NVARCHAR(100),
    TargetId INT,
    OldValue NVARCHAR(MAX),
    NewValue NVARCHAR(MAX),
    IPAddress NVARCHAR(100),
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id)
)