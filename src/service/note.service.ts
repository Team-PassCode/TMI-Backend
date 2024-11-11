import { Service } from "typedi";
import { Request, Response } from "express";
import { GenerateUUID } from "../lib/commonFunctions";
import NoteDatabaseAccessLayer from "../DatabaseAccessLayer/note.dal";
import { CreateNoteRequestModel } from "../Model/CreateNoteRequestModel";
import { UpdateNoteRequestModel } from "../Model/UpdateNoteRequestModel";
import LoggerService from "./logger.service";

@Service()
export default class NoteService {
  constructor(
    private readonly noteDA: NoteDatabaseAccessLayer,
    private readonly logger: LoggerService
  ) {}

  CreateNote = async (
    request: Request<{}, {}, CreateNoteRequestModel>,
    response: Response
  ) => {
    let { notes, planId } = request.body;
    const { userid } = request;
    try {
      const planExists = await this.noteDA.FindById(planId);
      if (!planExists || Object.keys(planExists).length === 0) {
        response.status(400).send([{ message: "PlanId does not exist." }]);
        return;
      }
      const noteId = GenerateUUID();

      await this.noteDA.SaveNotes(noteId, planId, notes, userid ?? "");

      response.status(200).send({
        noteId,
      });
    } catch (error: any) {
      this.logger.error(error, {
        ...error,
        Request_URI: request.route.path,
        Input_params: JSON.stringify(request.body),
        stack_trace: error.stack || null,
        Level: "error",
        Message: error.message || "Error",
        Metadata: JSON.stringify({ ...error }),
        Caller: userid,
      });
      response.status(500).send(error);
    }
  };

  UpdateNote = async (
    request: Request<{}, {}, UpdateNoteRequestModel>,
    response: Response
  ) => {
    const { userid } = request;
    try {
      let { noteId, notes } = request.body;

      await this.noteDA.UpdateNotes(noteId, notes, userid);
      response.status(200).send({});
    } catch (error: any) {
      this.logger.error(error, {
        ...error,
        Request_URI: request.route.path,
        Input_params: JSON.stringify(request.body),
        stack_trace: error.stack || null,
        Level: "error",
        Message: error.message || "Error",
        Metadata: JSON.stringify({ ...error }),
        Caller: userid,
      });
      response.status(500).send(error);
    }
  };

  DeleteNote = async (request: Request, response: Response) => {
    let { userid } = request.body;
    try {
      let { noteId } = request.params;

      await this.noteDA.DeleteNote(noteId);
      response.status(200).send({
        route: request.route,
        input_params: request.body,
        created_by: request.userid,
      });
    } catch (error: any) {
      this.logger.error(error, {
        ...error,
        Request_URI: request.route.path,
        Input_params: JSON.stringify(request.body),
        stack_trace: error.stack || null,
        Level: "error",
        Message: error.message || "Error",
        Metadata: JSON.stringify({ ...error }),
        Caller: userid,
      });
      response.status(500).send(error);
    }
  };
}
