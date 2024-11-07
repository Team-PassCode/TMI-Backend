import { Service } from "typedi";
import { Request, Response } from "express";
import { GenerateUUID } from "../lib/commonFunctions";
import NoteDatabaseAccessLayer from "../DatabaseAccessLayer/note.dal";
import { CreateNoteRequestModel } from "../Model/CreateNoteRequestModel";
import { UpdateNoteRequestModel } from "../Model/UpdateNoteRequestModel";
import LoggerService from "./logger.service";
import { error } from "winston";

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
      const noteId = GenerateUUID();

      await this.noteDA.SaveNotes(noteId, planId, notes, userid ?? "");
      this.logger.info("success", {
        error_message: "success",
        method_name: request.method,
        route: request.route.path,
        requestBody: request.body,
        userid,
      });
      response.status(200).send({
        noteId,
      });
    } catch (error: any) {
      this.logger.error(error, {
        ...error,
        methodName: request.method,
        route: request.route.path,
        input_params: request.body,
        created_by: userid,
      });
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
    } catch (error: any) {
      this.logger.error(error, {
        route: request.route,
        input_params: request.body,
        created_by: request.userid,
      });
      response.status(500).send(error);
    }
  };

  DeleteNote = async (request: Request, response: Response) => {
    try {
      let { noteId } = request.params;

      await this.noteDA.DeleteNote(noteId);
      response.status(200).send({
        route: request.route,
        input_params: request.body,
        created_by: request.userid,
      });
    } catch (error: any) {
      this.logger.error(error, {});
      response.status(500).send(error);
    }
  };
}
