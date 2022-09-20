import { AppRouter } from "@note-taking/trpc";
import { inferProcedureOutput } from "@trpc/server";
import { useEffect } from "react";
import { useSelection } from "../../App";
import { trpc } from "../../utils/trpc";

export type Notebook = inferProcedureOutput<
  AppRouter["notebook"]["all"]
>[number];
export type Note = inferProcedureOutput<
  AppRouter["notebook"]["all"]
>[number]["notes"][number];

export const NotesView = ({ notes }: { notes?: Note[] }) => {
  const { notebookId, noteId, setNoteId } = useSelection();

  let data: Note[] = [];

  useEffect(() => {
    const filtered = notes?.filter((note) => note.notebookId === notebookId);
    setNoteId(filtered?.[0]?.id);
    data = filtered || [];
  }, [notebookId]);

  return (
    <div className="w-1/2 bg-gray-200">
      <ul className="list-none">
        {data.map((n) => (
          <li
            className={`list-none ${
              noteId === n.id ? "bg-blue-400" : "bg-blue-200"
            } p-2`}
            onClick={() => setNoteId(n.id)}
          >
            {n.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const CategoryView = ({ notebooks }: { notebooks?: Notebook[] }) => {
  const { setNotebookId, notebookId, setNoteId } = useSelection();

  const first = notebooks?.[0];

  if (!notebooks) setNotebookId(first?.id);

  return (
    <div className="w-1/2 bg-blue-200">
      <p>Categories</p>
      <div>
        <p>Notebooks</p>
        <ul>
          {notebooks?.map((nb) => (
            <li
              className={`list-none ${
                nb.id === notebookId ? "bg-blue-400" : "bg-blue-200"
              } p-2`}
              onClick={() => {
                setNotebookId(nb.id);
                setNoteId(undefined);
              }}
            >
              {nb.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const Navigation = () => {
  const { data } = trpc.notebook.all.useQuery();

  return (
    <div className="col-start-1 col-end-3">
      <div className="flex h-full">
        <CategoryView notebooks={data} />
        <NotesView notes={data?.flatMap((n) => n.notes)} />
      </div>
    </div>
  );
};
