import mongoose from 'mongoose';
import { PROJECTNOTE } from '../models/note.models.js';
import { PROJECT } from '../models/project.models.js';
import { ApiError } from '../utils/api-errors.js';
import { ApiResponse } from '../utils/api-response.js';

const getNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await PROJECT.findById(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const notes = await PROJECTNOTE.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate('createdBy', 'username fullname avatar');

  return res
    .status(200)
    .json(new ApiResponse(200, notes, 'Notes fetched successfully'));
});

const getNotesById = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const notesById = await PROJECTNOTE.findById(noteId).populate(
    'createdBy',
    'username fullname',
  );

  if (!notesById) {
    throw new ApiError(404, 'Note not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, notesById, 'Notes fetched successfully'));
});

const createNote = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { content } = req.body;

  const project = await PROJECT.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const note = await PROJECTNOTE.create({
    project: new mongoose.Types.ObjectId(projectId),
    content,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  const populatedNotes = await PROJECTNOTE.findById(note._id).populate(
    'createdBy',
    'username fullname',
  );

  return res
    .status(200)
    .json(new ApiResponse(201, populatedNotes, 'Notes created successfully'));
});

const updateNote = asyncHandler(async (req, res) => {});

const deleteNote = asyncHandler(async (req, res) => {});

export { getNotes, getNotesById, createNote, updateNote, deleteNote };
