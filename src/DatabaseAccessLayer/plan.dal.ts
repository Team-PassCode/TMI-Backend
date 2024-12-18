import { Service } from 'typedi';
import { DBqueries, DBsp } from '../Shared/dBQueries';
import DbConnection from './dbConnection';
import { PlanReference } from '../Model/PlanReference';
import { RowDataPacket } from 'mysql2';
import { Break } from '../Model/Break';

export interface PlanD extends RowDataPacket {
  Plan_Id: string;
  User_Id: string;
  Title: string;
  Description: string;
  Scheduled_On: Date;
  Start_Time: Date;
  End_Time: Date;
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
  Start_Time: Date;
  End_Time: Date;
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
    return this.ReadDB<[PlanD[], PlanReferenceD[], PlanBreakD[], NoteD[]]>(
      DBsp.GetPlanDetails,
      [planId]
    );
  }

  async GetPlansOfSpecifiedDate(date: Date, userId: string) {
    return this.ReadDB<[PlanD[], PlanReferenceD[], PlanBreakD[], NoteD[]]>(
      DBsp.GetPlansOfADate,
      [date, userId]
    );
  }

  async GetPlanList(userId: string) {
    return this.ReadDB<[PlanD[], PlanReferenceD[], PlanBreakD[], NoteD[]]>(
      DBsp.GetPlanList,
      [userId]
    );
  }

  async FindMeetingOverlap(startTime: Date, endTime: Date) {
    return this.ReadDB<[PlanD[]]>(DBqueries.FindMeetingOverlap, [
      startTime,
      endTime,
      startTime,
      endTime,
      startTime,
      endTime,
    ]);
  }

  async FindMeetingOverlapForUpdate(
    planId: string,
    startTime: Date,
    endTime: Date
  ) {
    return this.ReadDB<[PlanD[]]>(DBqueries.FindMeetingOverlapForUpdate, [
      planId,
      startTime,
      endTime,
      startTime,
      endTime,
      startTime,
      endTime,
    ]);
  }

  async CreatePlan(
    planId: string,
    userId: string,
    title: string,
    description: string,
    startTime: Date,
    endTime: Date,
    createdBy: string,
    planReference: PlanReference[],
    breaks: Break[]
  ) {
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
  }

  async UpdatePlan(
    planId: string,
    title: string,
    description: string,
    startTime: Date,
    endTime: Date,
    updatedBy: string,
    planReference: PlanReference[],
    breaks: Break[]
  ) {
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
  }

  async DeletePlan(planId: string) {
    let queryList = [];
    let paramsList = [];

    queryList.push(DBsp.DeletePlan);
    paramsList.push([planId]);
    await this.InsertOrUpdateDB(queryList, paramsList);
  }
}
