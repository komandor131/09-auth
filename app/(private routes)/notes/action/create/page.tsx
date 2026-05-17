import type { Metadata } from "next";

import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

const title = "Create note | NoteHub";
const description = "Create a new note in NoteHub.";
const url = "https://notehub.goit.study/notes/action/create";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

const CreateNote = () => {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
};

export default CreateNote;
