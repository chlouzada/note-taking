import { AppRouter } from "@note-taking/trpc";
import { inferProcedureOutput } from "@trpc/server";
import { useEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";
import { ActionIcon } from "@mantine/core";
import { Filter, Note, X } from "tabler-icons-react";
import { ArrowsSort } from "tabler-icons-react";
import autoAnimate from "@formkit/auto-animate";
import { useElementSize } from "@mantine/hooks";
import moment from "moment";
import classNames from "classnames";
import { useEditorStore } from "../../stores/editor";

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

export const NotesView = () => {
  const { selectedNoteId, selectedNotebookId, setSelectedNoteId } =
    useEditorStore();
  const all = trpc.editor.useQuery(undefined, {
    staleTime: 1000 * 30,
  });

  const [data, setData] = useState<any[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState<string>("");
  const listAnimatedRef = useListAnimation();
  const container = useElementSize();
  const toolbar = useElementSize();

  const createMutation = trpc.note.create.useMutation({
    onSuccess: (data) => {
      all.refetch();
    },
  });

  const deleteMutation = trpc.note.delete.useMutation({
    onMutate: (id) => {
      setData((prev) => prev.filter((note) => note.id !== id));
      return { prev: data };
    },
    onError: (_err, _input, ctx) => {
      setData(ctx?.prev ?? []);
    },
    onSuccess: () => {
      all.refetch();
    },
  });

  const handleCreateNote = async () => {
    if (!selectedNotebookId) throw new Error("No notebook selected");
    const data = await createMutation.mutateAsync({
      notebookId: selectedNotebookId,
    });
    setSelectedNoteId(data.id);
  };

  useEffect(() => {
    const notes = all.data?.flatMap((notebook) => notebook.notes) ?? [];
    const filtered = notes
      ?.filter((note) =>
        selectedNotebookId ? note.notebookId === selectedNotebookId : true
      )
      .filter((note) =>
        (note.title?.toLowerCase() ?? "untitled").includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        if (order == "asc") return a.updatedAt > b.updatedAt ? 1 : -1;
        else return a.updatedAt < b.updatedAt ? 1 : -1;
      });
    setData(filtered ?? []);
  }, [selectedNotebookId, order]);

  return (
    <div className="w-3/5 h-full" ref={container.ref}>
      <div className="flex flex-col gap-2 p-1" ref={toolbar.ref}>
        <div className="flex justify-between">
          <ActionIcon
            variant="transparent"
            onClick={() => setOrder((prev) => (prev == "asc" ? "desc" : "asc"))}
          >
            <ArrowsSort size={20} strokeWidth="1.5" color="black" />
          </ActionIcon>

          <ActionIcon variant="transparent" onClick={handleCreateNote}>
            <Note size={20} strokeWidth="1.5" color="black" />
          </ActionIcon>
        </div>
        <input
          aria-label="Filter"
          placeholder="Filter"
          className="input input-sm input-secondary"
          // icon={<Filter  size={20}/>} // TODO: add icon to input
          value={filter}
          onChange={(e) => setFilter(e.currentTarget.value)}
        />
      </div>
      <ul
        className="list-none overflow-auto-y"
        ref={listAnimatedRef}
        style={{ height: container.height - toolbar.height }}
      >
        {data?.map((n) => {
          const isFocused = n.id === selectedNoteId;
          return (
            <li
              key={n.id}
              className={classNames(
                "list-none flex justify-between items-center p-2 border-b-[1px] border-gray-400",
                { "bg-neutral-focus shadow-inner ": isFocused }
              )}
              onClick={(e) => {
                if (e.target instanceof SVGElement) return;
                setSelectedNoteId(n.id);
              }}
            >
              <div className="flex flex-col w-full gap-1">
                <p
                  className={classNames("text-md", {
                    "text-secondary font-bold": isFocused,
                  })}
                >
                  {n.title ?? "Untitled"}
                </p>
                <p
                  className={classNames("truncate overflow-hidden text-xs", {
                    "text-white": isFocused,
                  })}
                >
                  {n.content.replace(/[#*`]/g, "") ?? "Untitled"}
                </p>
                <p
                  className={classNames("font-semibold text-blue-400 text-xs", {
                    "text-white": isFocused,
                  })}
                >
                  {moment(n.updatedAt).fromNow()}
                </p>
              </div>
              <ActionIcon
                size={"xs"}
                onClick={() => deleteMutation.mutate(n.id)}
              >
                <X />
              </ActionIcon>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const CategoryView = () => {
  const { selectedNotebookId, setSelectedNotebookId } = useEditorStore();
  const { data } = trpc.editor.useQuery(undefined, {
    staleTime: 1000 * 30,
  });

  return (
    <div className="w-2/5">
      <ul>
        {data?.map((notebook) => {
          const isFocused = notebook.id === selectedNotebookId;
          return (
            <li
              key={notebook.id}
              className={classNames("p-2", {
                "bg-neutral-focus shadow-inner": isFocused,
              })}
              onClick={() => setSelectedNotebookId(notebook.id)}
            >
              {notebook.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const Navigation = () => {
  const { ref, height } = useElementSize();
  return (
    <div ref={ref} className="col-start-1 col-end-3">
      <div className="flex" style={{ height }}>
        <CategoryView />
        <div className="border-l border-gray-600 shadow-2xl" />
        <NotesView />
        <div className="border-l border-gray-600 shadow-2xl" />
      </div>
    </div>
  );
};
