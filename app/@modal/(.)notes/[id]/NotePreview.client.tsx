"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";
import css from "./NotePreview.module.css";

interface NotePreviewClientProps {
  noteId: Note["id"];
}

const NotePreviewClient = ({ noteId }: NotePreviewClientProps) => {
  const router = useRouter();

  const noteQuery = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  const handleClose = (): void => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      {noteQuery.isLoading && <p>Loading, please wait...</p>}
      {(noteQuery.isError || !noteQuery.data) && <p>Something went wrong.</p>}
      {noteQuery.data && (
        <div className={css.container}>
          <div className={css.item}>
            <button type="button" className={css.backBtn} onClick={handleClose}>
              Back
            </button>
            <div className={css.header}>
              <h2>{noteQuery.data.title}</h2>
            </div>
            <p className={css.tag}>{noteQuery.data.tag}</p>
            <p className={css.content}>{noteQuery.data.content}</p>
            <p className={css.date}>{noteQuery.data.createdAt}</p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default NotePreviewClient;
