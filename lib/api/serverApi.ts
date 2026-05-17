import type { AxiosResponse } from "axios";
import { cookies } from "next/headers";

import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";
import { api } from "./api";
import type { CheckSessionResponse, FetchNotesResponse } from "./clientApi";

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

const getCookieHeader = async (): Promise<string> => {
  const cookieStore = await cookies();

  return cookieStore.toString();
};

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    headers: {
      Cookie: await getCookieHeader(),
    },
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
  const response: AxiosResponse<Note> = await api.get(`/notes/${noteId}`, {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response: AxiosResponse<User> = await api.get("/users/me", {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
};

export const checkSession = async (): Promise<
  AxiosResponse<CheckSessionResponse>
> => {
  const response: AxiosResponse<CheckSessionResponse> = await api.get(
    "/auth/session",
    {
      headers: {
        Cookie: await getCookieHeader(),
      },
    },
  );

  return response;
};
