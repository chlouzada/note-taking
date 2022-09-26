import { useEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";
import { ActionIcon } from "@mantine/core";
import { Filter, Note, Notebook, Notes, Plus, Settings, X } from "tabler-icons-react";
import { ArrowsSort } from "tabler-icons-react";
import autoAnimate from "@formkit/auto-animate";
import { useElementSize } from "@mantine/hooks";
import moment from "moment";
import classNames from "classnames";
import { useEditorStore } from "../../stores/editor";
import { useQueryClient } from "@tanstack/react-query";

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
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState<string>("");
  const listAnimatedRef = useListAnimation();
  const container = useElementSize();
  const toolbar = useElementSize();
  const queryClient = useQueryClient();

  const { data, refetch } = trpc.editor.useQuery(undefined, {
    staleTime: 1000 * 30,
  });

  const createMutation = trpc.note.create.useMutation({
    onSettled: () => {
      refetch();
    },
  });

  const deleteMutation = trpc.note.delete.useMutation({
    onMutate: async (id) => {
      await queryClient.cancelQueries(["editor"]);
      const previous = queryClient.getQueryData(["editor"]);
      queryClient.setQueryData(["editor"], (old: any) => {
        return {
          ...old,
          notes: old.notes.filter((note: any) => note.id !== id),
        };
      });
      return { previous };
    },
    onError: (_err, _input, ctx) => {
      queryClient.setQueryData(["editor"], ctx?.previous);
    },
    onSettled: () => {
      refetch();
    },
  });

  const handleCreateNote = async () => {
    if (!selectedNotebookId) throw new Error("No notebook selected");
    const data = await createMutation.mutateAsync({
      notebookId: selectedNotebookId,
    });
    setSelectedNoteId(data.id);
  };

  const render = data?.notes
    ?.filter((note) =>
      selectedNotebookId !== "null"
        ? note.notebookId === selectedNotebookId
        : true
    )
    .filter((note) =>
      (note.title?.toLowerCase() ?? "untitled").includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (order == "asc") return a.updatedAt > b.updatedAt ? 1 : -1;
      else return a.updatedAt < b.updatedAt ? 1 : -1;
    });

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
        {render?.map((n) => {
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

const AllNotes = () => {
  const { selectedNotebookId, setSelectedNotebookId } = useEditorStore();

  const selected = selectedNotebookId === "null";

  return (
    <div
      className={classNames("flex justify-between items-center p-2", {
        "bg-gray-500": selected, // TODO: better colors
      })}
    >
      <div className="flex" onClick={() => setSelectedNotebookId("null")}>
        <Notes className="mr-1" />
        <p className="font-bold">All Notes</p>
      </div>
    </div>
  );
};

const Notebooks = () => {
  const { selectedNotebookId, setSelectedNotebookId } = useEditorStore();
  const { data, refetch } = trpc.editor.useQuery(undefined, {
    staleTime: 1000 * 30,
  });

  const create = trpc.notebook.create.useMutation({
    // TODO: add optimistic update
    onSettled: () => {
      refetch();
    },
  });

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center px-2">
        <div className="flex">
          <Notebook className="mr-1" />
          <p className="font-bold">Notebooks</p>
        </div>
        <ActionIcon variant="transparent" onClick={() => create.mutate()}>
          <Plus color="white" />
        </ActionIcon>
      </div>
      <ul>
        {data?.notebooks.map((notebook) => {
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
              {/* <Settings/> // TODO: add settings to update notebook info */}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const CategoryView = () => {
  return (
    <div className="w-2/5 bg-gray-900 text-white">
      <div className="flex flex-col gap-1">
        <AllNotes />
        <Notebooks />
      </div>
    </div>
  );
};

export const Navigation = () => {
  const { ref, height } = useElementSize();
  return (
    <div ref={ref} className="col-start-1 col-end-4">
      <div className="flex" style={{ height }}>
        <CategoryView />
        <div className="border-l border-gray-600 shadow-2xl" />
        <NotesView />
        <div className="border-l border-gray-600 shadow-2xl" />
      </div>
    </div>
  );
};
