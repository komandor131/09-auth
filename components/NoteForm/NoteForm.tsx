"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ChangeEvent } from "react";

import { createNote } from "@/lib/api/clientApi";
import type { CreateNoteData } from "@/lib/api/clientApi";
import { useNoteStore } from "@/lib/store/noteStore";
import { NOTE_TAGS } from "@/types/note";
import type { NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

interface FormErrors {
  title?: string;
  content?: string;
  tag?: string;
}

const getNoteData = (formData: FormData): CreateNoteData => ({
  title: String(formData.get("title") ?? ""),
  content: String(formData.get("content") ?? ""),
  tag: String(formData.get("tag") ?? "Todo") as NoteTag,
});

const validateNote = (note: CreateNoteData): FormErrors => {
  const errors: FormErrors = {};

  if (note.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  } else if (note.title.length > 50) {
    errors.title = "Title must be at most 50 characters";
  }

  if (note.content.length > 500) {
    errors.content = "Content must be at most 500 characters";
  }

  if (!NOTE_TAGS.includes(note.tag)) {
    errors.tag = "Choose a valid tag";
  }

  return errors;
};

const NoteForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);
  const [errors, setErrors] = useState<FormErrors>({});

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
  });

  const handleFormChange = (event: ChangeEvent<HTMLFormElement>): void => {
    setDraft(getNoteData(new FormData(event.currentTarget)));
  };

  const handleCreateNote = async (formData: FormData): Promise<void> => {
    const note = getNoteData(formData);
    const validationErrors = validateNote(note);

    setDraft(note);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await createNoteMutation.mutateAsync({
        ...note,
        title: note.title.trim(),
        content: note.content.trim(),
      });
    } catch {
      // Mutation state keeps the error message for rendering below the form.
    }
  };

  const handleCancelClick = (): void => {
    router.back();
  };

  const mutationError =
    createNoteMutation.error instanceof Error
      ? createNoteMutation.error.message
      : null;

  return (
    <form className={css.form} onChange={handleFormChange}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={draft.title}
          minLength={3}
          maxLength={50}
          required
          onChange={(event) => setDraft({ title: event.target.value })}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          maxLength={500}
          onChange={(event) => setDraft({ content: event.target.value })}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          required
          onChange={(event) => setDraft({ tag: event.target.value as NoteTag })}
        >
          {NOTE_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancelClick}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={createNoteMutation.isPending}
          formAction={handleCreateNote}
        >
          Create note
        </button>
      </div>

      {mutationError && <span className={css.error}>{mutationError}</span>}
    </form>
  );
};

export default NoteForm;
