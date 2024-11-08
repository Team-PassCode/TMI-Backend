import { Service } from "typedi";
import { Request, Response } from "express";
import { GenerateUUID } from "../lib/commonFunctions";
import NoteDatabaseAccessLayer from "../DatabaseAccessLayer/note.dal";
import { CreateNoteRequestModel } from "../Model/CreateNoteRequestModel";
import { UpdateNoteRequestModel } from "../Model/UpdateNoteRequestModel";

@Service()
export default class NoteService {
  constructor(private readonly noteDA: NoteDatabaseAccessLayer) {}

  CreateNote = async (
    request: Request<{}, {}, CreateNoteRequestModel>,
    response: Response
  ) => {
    try {
      let { notes, planId } = request.body;
      const { userid } = request;
      
      const planExists = await this.noteDA.FindById(planId);
      if (!planExists || Object.keys(planExists).length === 0) {
        return response.status(400).send([{ message: "PlanId does not exist." }]);
      }
      const noteId = GenerateUUID();

      await this.noteDA.SaveNotes(noteId, planId, notes, userid ?? "");
      response.status(200).send({
        noteId,
      });
    } catch (error) {
      console.error(error);
      response.status(500).send(error);
    }
  };

  UpdateNote = async (
    request: Request<{}, {}, UpdateNoteRequestModel>,
    response: Response
  ) => {
    try {
      let { noteId, notes } = request.body;

      const { userid } = request;

      await this.noteDA.UpdateNotes(noteId, notes, userid);
      response.status(200).send({});
    } catch (error) {
      console.log(error);
      response.status(500).send(error);
    }
  };

  DeleteNote = async (request: Request, response: Response) => {
    try {
      let { noteId } = request.params;

      await this.noteDA.DeleteNote(noteId);
      response.status(200).send({});
    } catch (error) {
      console.log(error);
      response.status(500).send(error);
    }
  };
}
