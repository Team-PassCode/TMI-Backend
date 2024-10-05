CREATE TABLE tbl_Plan_Break
(
	Plan_Id         VARCHAR(40)     NOT NULL PRIMARY KEY,
    Start_Time      DATETIME        NOT NULL,
    End_Time        DATETIME        NOT NULL,
    Breaks          Int             NULL,
    BreakDuration   Int             NULL,
    Created_On      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    Updated_On      DATETIME        NULL,
    Created_By      VARCHAR(40)     NOT NULL,
    Updated_By      VARCHAR(40)     NULL 
)