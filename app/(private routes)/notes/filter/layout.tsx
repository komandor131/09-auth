import type { ReactNode } from "react";

import css from "./LayoutNotes.module.css";

interface NotesFilterLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

const NotesFilterLayout = ({ children, sidebar }: NotesFilterLayoutProps) => {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <section className={css.notesWrapper}>{children}</section>
    </div>
  );
};

export default NotesFilterLayout;
