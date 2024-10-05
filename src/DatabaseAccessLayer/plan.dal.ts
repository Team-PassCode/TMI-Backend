import { Service } from "typedi";
import { DBqueries, DBsp } from "../Shared/dBQueries";
import DbConnection from "./dbConnection";
import { PlanReference } from "../Model/CreatePlanRequestModel";
import { RowDataPacket } from "mysql2";

interface PlanD extends RowDataPacket {
  Plan_Id: string;
  User_Id: string;
  Title: string;
  Description: string;
  Start_Time: Date;
  End_Time: Date;
  Created_On: Date;
  Updated_On: Date;
  Created_By: string;
  Updated_By: string;
}

interface PlanReferenceD extends RowDataPacket {
  Plan_Reference_Id: string;
  Plan_Id: string;
  HyperLink: string;
  Description: string;
  Created_On: Date;
  Updated_On: Date;
  Created_By: string;
  Updated_By: string;
}

@Service()
export default class PlanDatabaseAccessLayer extends DbConnection {
  constructor() {
    super();
  }

  async GetPlanDetails(planId: string) {
    try {
      return this.ReadDB<Array<PlanD>>(DBsp.GetPlanDetails, [planId]);
    } catch (error) {
      throw error;
    }
  }

  async GetPlanList(userId: string) {
    try {
      return this.ReadDB<any[]>(DBsp.GetPlanList, [userId]);
    } catch (error) {
      throw error;
    }
  }

  async CreatePlan(
    planId: string,
    userId: string,
    title: string,
    description: string,
    startTime: Date,
    endTime: Date,
    planReference: PlanReference[],
    createdBy: string,
    breaks?: number[],
    breakDuration?: number
  ) {
    try {
      let queryList = [];
      let paramsList = [];
      queryList.push(DBqueries.CreatePlan);
      paramsList.push([
        planId,
        userId,
        title,
        description,
        startTime,
        endTime,
        createdBy,
      ]);
      if (planReference.length > 0) {
        planReference.forEach(({ planReferenceId, hyperLink, description }) => {
          queryList.push(DBqueries.CreatePlanReference);
          paramsList.push([
            planReferenceId,
            planId,
            hyperLink,
            description,
            createdBy,
          ]);
        });
      }

      await this.InsertOrUpdateDB(queryList, paramsList);
    } catch (error) {
      throw error;
    }
  }

  async UpdatePlan(
    planId: string,
    title: string,
    description: string,
    startTime: Date,
    endTime: Date,
    planReference: PlanReference[],
    updatedBy: string,
    breaks?: number[],
    breakDuration?: number
  ) {
    try {
      let queryList = [];
      let paramsList = [];

      queryList.push(DBqueries.UpdatePlan);
      paramsList.push([
        title,
        description,
        startTime,
        endTime,
        updatedBy,
        planId,
      ]);

      queryList.push(DBqueries.DeleteAllTableReferences);
      paramsList.push([planId]);

      if (planReference.length > 0) {
        planReference.forEach(({ planReferenceId, hyperLink, description }) => {
          queryList.push(DBqueries.CreatePlanReference);
          paramsList.push([
            planReferenceId,
            planId,
            hyperLink,
            description,
            updatedBy,
          ]);
        });
      }

      await this.InsertOrUpdateDB(queryList, paramsList);
    } catch (error) {
      throw error;
    }
  }
}
