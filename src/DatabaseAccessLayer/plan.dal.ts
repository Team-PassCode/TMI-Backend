import { Service } from "typedi";
import { DBqueries, DBsp } from "../Shared/dBQueries";
import DbConnection from "./dbConnection";
import { PlanReference } from "../Model/PlanReference";
import { RowDataPacket } from "mysql2";
import { Break } from "../Model/Break";

export interface PlanD extends RowDataPacket {
  Plan_Id: string;
  User_Id: string;
  Title: string;
  Description: string;
  Scheduled_On: Date;
  Start_Time: number;
  End_Time: number;
  Created_On: Date;
  Updated_On: Date;
  Created_By: string;
  Updated_By: string;
}

export interface PlanReferenceD extends RowDataPacket {
  Plan_Reference_Id: string;
  Plan_Id: string;
  HyperLink: string;
  Description: string;
  Created_On: Date;
  Updated_On: Date;
  Created_By: string;
  Updated_By: string;
}

export interface PlanBreakD extends RowDataPacket {
  Plan_Id: string;
  Start_Time: number;
  End_Time: number;
  Created_On: Date;
  Updated_On: Date;
  Created_By: string;
  Updated_By: string;
}

export interface NoteD extends RowDataPacket {
  Plan_Id: string;
  Note_Id: string;
  Notes: string;
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
      return this.ReadDB<[PlanD[], PlanReferenceD[], PlanBreakD[], NoteD[]]>(
        DBsp.GetPlanDetails,
        [planId]
      );
    } catch (error) {
      throw error;
    }
  }

  async GetPlanList(userId: string) {
    try {
      return this.ReadDB<[PlanD[], PlanReferenceD[], PlanBreakD[], NoteD[]]>(
        DBsp.GetPlanList,
        [userId]
      );
    } catch (error) {
      throw error;
    }
  }

  async CreatePlan(
    planId: string,
    userId: string,
    title: string,
    description: string,
    startTime: number,
    endTime: number,
    createdBy: string,
    planReference: PlanReference[],
    breaks: Break[]
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
      breaks.forEach(({ startTime, endTime }) => {
        queryList.push(DBqueries.CreatePlanBreak);
        paramsList.push([planId, startTime, endTime, createdBy]);
      });
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

      await this.InsertOrUpdateDB(queryList, paramsList);
    } catch (error) {
      throw error;
    }
  }

  async UpdatePlan(
    planId: string,
    title: string,
    description: string,
    startTime: number,
    endTime: number,
    updatedBy: string,
    planReference: PlanReference[],
    breaks: Break[]
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

      queryList.push(DBqueries.DeleteAllPlanBreaks);
      paramsList.push([planId]);
      breaks.forEach(({ startTime, endTime }) => {
        queryList.push(DBqueries.CreatePlanBreak);
        paramsList.push([planId, startTime, endTime, updatedBy]);
      });

      queryList.push(DBqueries.DeleteAllPlanReferences);
      paramsList.push([planId]);
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

      await this.InsertOrUpdateDB(queryList, paramsList);
    } catch (error) {
      throw error;
    }
  }

  async DeletePlan(planId: string) {
    let queryList = [];
    let paramsList = [];

    queryList.push(DBsp.DeletePlan);
    paramsList.push([planId]);
    await this.InsertOrUpdateDB(queryList, paramsList);
  }
}
