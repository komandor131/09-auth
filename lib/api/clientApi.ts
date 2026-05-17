import type { AxiosResponse } from "axios";

import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";
import { api } from "./api";

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface CheckSessionResponse {
  success: boolean;
}

export type UpdateUserData = Partial<Pick<User, "username" | "avatar">>;

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
  });

  return response.data;
};

export const fetchNoteById = async (noteId: Note["id"]): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.get(`/notes/${noteId}`);

  return response.data;
};

export const createNote = async (note: CreateNoteData): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.post("/notes", note);

  return response.data;
};

export const deleteNote = async (noteId: Note["id"]): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.delete(`/notes/${noteId}`);

  return response.data;
};

export const register = async (credentials: AuthCredentials): Promise<User> => {
  const response: AxiosResponse<User> = await api.post(
    "/auth/register",
    credentials,
  );

  return response.data;
};

export const login = async (credentials: AuthCredentials): Promise<User> => {
  const response: AxiosResponse<User> = await api.post(
    "/auth/login",
    credentials,
  );

  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<CheckSessionResponse> => {
  const response: AxiosResponse<CheckSessionResponse> =
    await api.get("/auth/session");

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response: AxiosResponse<User> = await api.get("/users/me");

  return response.data;
};

export const updateMe = async (user: UpdateUserData): Promise<User> => {
  const response: AxiosResponse<User> = await api.patch("/users/me", user);

  return response.data;
};
