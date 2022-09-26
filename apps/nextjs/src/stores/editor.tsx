import create from "zustand";

type EditorStore = {
  selectedNoteId: string | null;
  selectedNotebookId: string | null;
  setSelectedNoteId: (id: string) => void;
  setSelectedNotebookId: (id: string) => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  selectedNoteId: null,
  selectedNotebookId: null,
  setSelectedNoteId: (id: string) => set({ selectedNoteId: id }),
  setSelectedNotebookId: (id: string) => set({ selectedNotebookId: id }),
}));
