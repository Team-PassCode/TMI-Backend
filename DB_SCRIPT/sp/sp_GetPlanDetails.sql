DROP PROCEDURE IF EXISTS sp_GetPlanDetails;
DELIMITER &&  
CREATE PROCEDURE sp_GetPlanDetails(planId varchar(40))
BEGIN
    
    SELECT 
        *
    FROM 
        tbl_Plan
    WHERE
        Plan_Id = planId;

    
    SELECT 
        *
    FROM 
        tbl_Plan_Reference
    WHERE
        Plan_Id = planId;
END &&
DELIMITER ;