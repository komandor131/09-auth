import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchNotes } from "@/lib/api/serverApi";
import { NOTE_TAGS } from "@/types/note";
import type { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";

const NOTES_PER_PAGE = 12;
const NOTEHUB_OG_IMAGE =
  "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

interface FilteredNotesProps {
  params: Promise<{
    slug?: string[];
  }>;
}

const getSelectedTag = (slug: string[] = []): NoteTag | undefined => {
  if (slug.length !== 1) {
    notFound();
  }

  const [filter] = slug;

  if (filter === "all") {
    return undefined;
  }

  if (NOTE_TAGS.includes(filter as NoteTag)) {
    return filter as NoteTag;
  }

  notFound();
};

export const generateMetadata = async ({
  params,
}: FilteredNotesProps): Promise<Metadata> => {
  const { slug } = await params;
  const tag = getSelectedTag(slug);
  const filterName = tag ?? "all";
  const title = `Notes filtered by ${filterName} | NoteHub`;
  const description = `Browse NoteHub notes filtered by ${filterName}.`;
  const url = `/notes/filter/${filterName}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [NOTEHUB_OG_IMAGE],
    },
  };
};

const FilteredNotes = async ({ params }: FilteredNotesProps) => {
  const { slug } = await params;
  const tag = getSelectedTag(slug);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag ?? "all"],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: NOTES_PER_PAGE,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};

export default FilteredNotes;
