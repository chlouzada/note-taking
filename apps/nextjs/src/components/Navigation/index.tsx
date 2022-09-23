import { AppRouter } from "@note-taking/trpc";
import { inferProcedureOutput } from "@trpc/server";
import { useEffect, useRef, useState } from "react";
import { useSelection } from "../../pages/editor";
import { trpc } from "../../utils/trpc";
import { ActionIcon, TextInput } from "@mantine/core";
import { Filter, Note } from "tabler-icons-react";
import { ArrowsSort } from "tabler-icons-react";
import autoAnimate from "@formkit/auto-animate";

export type NavigationProps = {
  data: inferProcedureOutput<AppRouter["notebook"]["all"]>;
};
export type Notebook = inferProcedureOutput<
  AppRouter["notebook"]["all"]
>[number];
export type Note = inferProcedureOutput<
  AppRouter["notebook"]["all"]
>[number]["notes"][number];

const useListAnimation = () => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current &&
      autoAnimate(ref.current, {
        duration: 125,
      });
  }, [ref]);
  return ref;
};

export const NotesView = ({ notes }: { notes?: Note[] }) => {
  const { noteId, setNoteId, notebookId } = useSelection();
  const [data, setData] = useState<Note[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const listAnimatedRef = useListAnimation();
  const [filter, setFilter] = useState<string>("");

  const create = trpc.note.create.useMutation({
    onSuccess: (data) => {
      setData((prev) => [...prev, data]);
    },
  });

  const handleCreateNote = async () => {
    if (!notebookId) throw new Error("No notebook selected");
    const data = await create.mutateAsync({
      notebookId,
    });
    setNoteId(data.id);
  };

  useEffect(() => {
    const filtered = notes?.filter((note) => note.notebookId === notebookId);
    setData(filtered ?? []);
    setNoteId(filtered?.[0]?.id);
  }, [notebookId]);

  const renderData = data?.filter((note) =>
    (note.title?.toLowerCase() ?? "untitled").includes(filter.toLowerCase())
  ).sort((a, b) => {
    if (order == "asc") return a.updatedAt > b.updatedAt ? 1 : -1;
    else return a.updatedAt < b.updatedAt ? 1 : -1;
  });


  return (
    <div className="w-1/2 bg-gray-200">
      <div className="flex flex-col gap-2 p-1">
        <div className="flex justify-between">
          <ActionIcon
            variant="transparent"
            onClick={() => setOrder((prev) => (prev == "asc" ? "desc" : "asc"))}
          >
            <ArrowsSort size={24} strokeWidth="1.5" color="black" />
          </ActionIcon>

          <ActionIcon variant="transparent" onClick={handleCreateNote}>
            <Note size={24} strokeWidth="1.5" color="black" />
          </ActionIcon>
        </div>
        <TextInput
          aria-label="Filter"
          placeholder="Filter"
          icon={<Filter />}
          variant="unstyled"
          size="sm"
          className="rounded bg-white"
          value={filter}
          onChange={(e) => setFilter(e.currentTarget.value)}
        />
      </div>
      <ul className="list-none" ref={listAnimatedRef}>
        {renderData?.map((n) => (
          <li
            key={n.id}
            className={`list-none ${
              noteId === n.id ? "bg-blue-400" : "bg-blue-200"
            } p-2`}
            onClick={() => setNoteId(n.id)}
          >
            {n.title ?? "Untitled"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const CategoryView = ({ notebooks }: { notebooks?: Notebook[] }) => {
  const { setNotebookId, notebookId, setNoteId } = useSelection();

  return (
    <div className="w-1/2 bg-blue-200">
      <p>Categories</p>
      <div>
        <p>Notebooks</p>
        <ul>
          {notebooks?.map((notebook) => (
            <li
              key={notebook.id}
              className={`list-none ${
                notebook.id === notebookId ? "bg-blue-400" : "bg-blue-200"
              } p-2`}
              onClick={() => setNotebookId(notebook.id)}
            >
              {notebook.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const Navigation = (props: NavigationProps) => {
  const { setNotebookId, notebookId, noteId, setNoteId } = useSelection();

  useEffect(() => {
    if (!notebookId) setNotebookId(props.data?.[0].id);
    if (!noteId) setNoteId(props.data?.[0].notes[0]?.id);
  }, [props.data]);

  return (
    <div className="col-start-1 col-end-3">
      <div className="flex h-full">
        <CategoryView notebooks={props.data} />
        <NotesView notes={props.data?.flatMap((n) => n.notes)} />
      </div>
    </div>
  );
};
