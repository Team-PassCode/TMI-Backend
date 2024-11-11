CREATE TABLE tbl_Logs (
    Error_Id INT AUTO_INCREMENT PRIMARY KEY,
    Request_URI VARCHAR(255),
    Input_Params JSON NULL,
    stack_trace TEXT,
    Level VARCHAR(255),
    Message TEXT,
    Metadata JSON,
    -- outgoing BOOLEAN NOT NULL,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    Caller VARCHAR(255) NULL
);
