import { createContext, useContext, useState } from "react";
import { TRPCProvider } from "./utils/trpc";
import { MantineProvider } from "@mantine/core";

import AppLayout from "./layouts/AppLayout";

import { Editor } from "./components/Editor";
import { Navigation } from "./components/Navigation";

function App() {
  return (
    <AppLayout>
      <div className="h-full">
        <div className="grid grid-cols-7 min-h-full overflow-auto">
          <Navigation />
          <Editor />
        </div>
      </div>
    </AppLayout>
  );
}

const SelectionContext = createContext<{
  noteId?: string;
  setNoteId: (id?: string) => void;
  notebookId?: string;
  setNotebookId: (id?: string) => void;
}>(null!);

export const useSelection = () => {
  return useContext(SelectionContext);
};

const WithProviders = () => {
  const [notebookId, setNotebookId] = useState<string>();
  const [noteId, setNoteId] = useState<string>();

  const value = {
    notebookId,
    setNotebookId,
    noteId,
    setNoteId,
  };

  return (
    <TRPCProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <SelectionContext.Provider value={value}>
          <App />
        </SelectionContext.Provider>
      </MantineProvider>
    </TRPCProvider>
  );
};

export default WithProviders;
