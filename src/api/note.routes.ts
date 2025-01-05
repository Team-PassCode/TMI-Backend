import { Router } from 'express';
import NoteService from '../service/note.service';
import { ValidateCreateNote } from '../schema/CreateNote';
import { Controller } from '../decorator/controller';

@Controller('/note')
export default class NoteRouter {
  constructor(private readonly noteService: NoteService) {}

  SetRouter(router: Router) {
    router.post('/', ValidateCreateNote, this.noteService.CreateNote);
    router.delete('/:noteId', this.noteService.DeleteNote);
  }
}
