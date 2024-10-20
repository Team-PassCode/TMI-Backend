import { Service } from "typedi";
import DbConnection from "./dbConnection";
import { DBqueries } from "../Shared/dBQueries";

@Service()
export default class NoteDatabaseAccessLayer extends DbConnection {
  constructor() {
    super();
  }

  async SaveNotes(
    notesId: string,
    planId: string,
    notes: string,
    userId: string
  ) {
    try {
      await this.InsertOrUpdateDB(
        [DBqueries.SaveNotes],
        [[notesId, planId, notes, userId]]
      );
    } catch (error) {
      throw error;
    }
  }

  async UpdateNotes(notesId: string, notes: string, userId: string) {
    try {
      await this.InsertOrUpdateDB(
        [DBqueries.UpdateNotes],
        [[notesId, notes, userId]]
      );
    } catch (error) {
      throw error;
    }
  }

  async DeleteNote(noteId: string) {
    try {
      await this.InsertOrUpdateDB([DBqueries.DeleteNote], [[noteId]]);
    } catch (error) {
      throw error;
    }
  }
}
