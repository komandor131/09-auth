import type { Metadata } from "next";

import css from "./page.module.css";

export const metadata: Metadata = {
  title: "Page not found | NoteHub",
  description: "The requested NoteHub page does not exist.",
  openGraph: {
    title: "Page not found | NoteHub",
    description: "The requested NoteHub page does not exist.",
    url: "/404",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

const NotFound = () => {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>404 - Page not found</h1>
        <p className={css.description}>
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </main>
  );
};

export default NotFound;
