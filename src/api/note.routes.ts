import { Router } from "express";
import { Service } from "typedi";
// import { VerifyUser } from "../middleware/verifyUser";
import NoteService from "../service/note.service";
import { ValidateCreateNote } from "../schema/CreateNote";
import { asyncHandler } from "../util/asyncErrorHandler";

@Service()
export default class NoteRouter {
  constructor(private readonly noteService: NoteService) {}

  SetRouter(router: Router) {
    router.post(
      "/note",
      ValidateCreateNote,
      asyncHandler(this.noteService.CreateNote)
    );
    router.delete("/note/:noteId", asyncHandler(this.noteService.DeleteNote));
  }
}
