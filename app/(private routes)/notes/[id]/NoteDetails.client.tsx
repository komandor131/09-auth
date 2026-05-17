"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { fetchNoteById } from "@/lib/api/clientApi";
import css from "./NoteDetails.module.css";

const NoteDetailsClient = () => {
  const params = useParams<{ id: string }>();
  const noteId = params.id;

  const noteQuery = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  if (noteQuery.isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (noteQuery.isError || !noteQuery.data) {
    return <p>Something went wrong.</p>;
  }

  const note = noteQuery.data;

  return (
    <main className={css.main}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{note.createdAt}</p>
        </div>
      </div>
    </main>
  );
};

export default NoteDetailsClient;
