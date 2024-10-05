export const DBqueries = {
  GetPatientInfo:
    "SELECT DISTINCT tbl_Client.Name, tbl_Client.Client_Iden, tbl_Client.Client_Id FROM tbl_Client INNER JOIN tbl_User ON tbl_Client.Is_Active = 'Y' AND tbl_User.Is_Active = 'Y' AND tbl_Client.Member_Id = tbl_User.User_Id AND tbl_User.User_Id = ?",
  CreatePlan:
    "Insert Into tbl_Plan(Plan_Id, User_Id, Title, Description, Start_Time, End_Time, Created_By) Values(?,?,?,?,?,?,?)",
  CreatePlanReference:
    "Insert Into tbl_Plan_Reference(Plan_Reference_Id, Plan_Id, HyperLink, Description, Created_By) Values(?,?,?,?,?)",
  DeleteAllTableReferences: "Delete From tbl_Plan_Reference Where Plan_Id = ?",
  UpdatePlan:
    "Update tbl_Plan SET Title = ?, Description = ?, Start_Time = ?, End_Time = ?, Updated_By = ? WHERE Plan_Id = ?",
};

export const DBsp = {
  GetPlanDetails: "call sp_GetPlanDetails(?)",
  GetPlanList: "call sp_GetPlanList(?)",
};
