CREATE TABLE tbl_Plan
(
	Plan_Id         VARCHAR(40)     NOT NULL UNIQUE,
    Title           ,
    Description     ,
    Start_Time      ,
    End_Time        ,
    Break           ,
    BreakDuration   ,
    Created_On      ,
    Updated_On      ,
    Created_By      ,
    Updated_By      
)