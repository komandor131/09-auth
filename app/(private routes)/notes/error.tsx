"use client";

import css from "@/app/status.module.css";

interface NotesErrorProps {
  error: Error;
}

const NotesError = ({ error }: NotesErrorProps) => {
  return (
    <p className={css.message}>
      Could not fetch the list of notes. {error.message}
    </p>
  );
};

export default NotesError;
