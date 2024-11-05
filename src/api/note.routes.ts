import { Router } from "express";
import { Service } from "typedi";
// import { VerifyUser } from "../middleware/verifyUser";
import NoteService from "../service/note.service";
import { ValidateCreateNote } from "../schema/CreateNote";

@Service()
export default class NoteRouter {
  constructor(private readonly noteService: NoteService) {}

  SetRouter(router: Router) {
    router.post("/note", ValidateCreateNote, this.noteService.CreateNote);
    router.delete("/note/:noteId", this.noteService.DeleteNote);
  }
}
