DROP PROCEDURE IF EXISTS sp_GetPlanList;
DELIMITER &&
CREATE PROCEDURE sp_GetPlanList(userId varchar(40))
BEGIN
	SELECT 
        *
    FROM 
        tbl_Plan
    WHERE 
        User_Id = userId;

    SELECT 
        *
    FROM 
        tbl_Plan_Reference
    WHERE
        Created_By = userId;
END &&
DELIMITER ;