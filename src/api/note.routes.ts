import { Router } from "express";
import { Service } from "typedi";
// import { VerifyUser } from "../middleware/verifyUser";
import NoteService from "../service/note.service";

@Service()
export default class NoteRouter {
  constructor(private readonly noteService: NoteService) {}

  SetRouter(router: Router) {
    router.post("/note", this.noteService.CreateNote);
    router.delete("/note/:noteId", this.noteService.DeleteNote);
  }
}
