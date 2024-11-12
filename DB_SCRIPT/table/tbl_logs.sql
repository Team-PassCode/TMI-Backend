CREATE TABLE tbl_Logs (
    Error_Id INT AUTO_INCREMENT PRIMARY KEY,
    Request_Uri VARCHAR(255) NULL,
    Input_Params JSON NULL,
    Stack_Trace Text NULL,
    Level VARCHAR(10) NOT NULL,
    Message TEXT,
    Metadata JSON NULL,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    Caller VARCHAR(10) NULL
);
