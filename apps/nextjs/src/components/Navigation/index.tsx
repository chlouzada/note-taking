import { AppRouter } from "@note-taking/trpc";
import { inferProcedureOutput } from "@trpc/server";
import { useEffect, useState } from "react";
import { useSelection } from "../../pages/editor";

export type NavigationProps = {
  data: inferProcedureOutput<AppRouter["notebook"]["all"]>;
};

export type Notebook = inferProcedureOutput<
  AppRouter["notebook"]["all"]
>[number];
export type Note = inferProcedureOutput<
  AppRouter["notebook"]["all"]
>[number]["notes"][number];

export const NotesView = ({ notes }: { notes?: Note[] }) => {
  const { noteId, setNoteId, notebookId } = useSelection();
  const [data, setData] = useState<Note[]>([]);

  useEffect(() => {
    const filtered = notes?.filter((note) => note.notebookId === notebookId);
    setData(filtered ?? []);
    setNoteId(filtered?.[0]?.id);
  }, [notebookId]);

  return (
    <div className="w-1/2 bg-gray-200">
      <ul className="list-none">
        {data?.map((n) => (
          <li
            key={n.id}
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
