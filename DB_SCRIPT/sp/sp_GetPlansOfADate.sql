DROP PROCEDURE IF EXISTS sp_GetPlansOfADate;
DELIMITER &&  
CREATE PROCEDURE sp_GetPlansOfADate(specificDate DATE, userId VARCHAR(40))
BEGIN
    
	SELECT 
        *
    FROM 
        tbl_Plan
    WHERE 
        DATE(Start_Time) = specificDate
        AND User_Id = userId;
    
    SELECT
        PlanReference.*
    FROM
		tbl_Plan Plan
        INNER JOIN tbl_Plan_Reference PlanReference ON Plan.Plan_Id = PlanReference.Plan_Id
    WHERE
        DATE(Plan.Start_Time) = specificDate
        AND User_Id = userId;

    
    SELECT
        PlanBreak.*
    FROM
		tbl_Plan Plan
        INNER JOIN tbl_Plan_Break PlanBreak ON Plan.Plan_Id = PlanBreak.Plan_Id
    WHERE
        DATE(Plan.Start_Time) = specificDate
        AND User_Id = userId;
    

    SELECT 
        Note.*
    FROM
		tbl_Plan Plan
        INNER JOIN tbl_Note Note ON Plan.Plan_Id = Note.Plan_Id
    WHERE
        DATE(Plan.Start_Time) = specificDate
        AND User_Id = userId;
END &&
DELIMITER ;