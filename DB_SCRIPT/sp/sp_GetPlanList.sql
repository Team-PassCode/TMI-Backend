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
END &&
DELIMITER ;