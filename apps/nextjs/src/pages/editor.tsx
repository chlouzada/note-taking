import React, { createContext, useContext, useEffect, useState } from "react";
import { Editor } from "../components/Editor";
import { Navigation } from "../components/Navigation";
import Footer from "../components/Footer";
import Header from "../components/Header";

const SelectionContext = createContext<{
  noteId?: string;
  setNoteId: (id?: string) => void;
  notebookId?: string;
  setNotebookId: (id?: string) => void;
}>(null!);

export const useSelection = () => {
  return useContext(SelectionContext);
};

export default function EditorPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notebookId, setNotebookId] = useState<string>();
  const [noteId, setNoteId] = useState<string>();

  const value = {
    notebookId,
    setNotebookId,
    noteId,
    setNoteId,
  };

  return (
    <SelectionContext.Provider value={value}>
      <div className="flex flex-col h-full">
        <Header />
        <div className="h-full grid grid-cols-7 overflow-auto">
          <Navigation />
          <Editor />
        </div>
        <Footer />
      </div>
    </SelectionContext.Provider>
  );
}
