import { createContext, useContext, useState } from "react";
import {
  AppShell,
  Navbar,
  Header as MHeader,
  Footer as MFooter,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  MantineProvider,
} from "@mantine/core";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

const SelectionContext = createContext<{
  noteId?: string;
  setNoteId: (id?: string) => void;
  notebookId?: string;
  setNotebookId: (id?: string) => void;
}>(null!);

export const useSelection = () => {
  return useContext(SelectionContext);
};

function AppLayout({ children }: { children: React.ReactNode }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const headerHeight = 52;
  const footerHeight = 24;

  return (
    <AppShell
      className="px-0"
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: headerHeight,
          paddingBottom: footerHeight,
        },
      }}
      header={
        <MHeader fixed height={headerHeight} className="border-b-0">
          <Header />
        </MHeader>
      }
      footer={
        <MFooter height={footerHeight} className="bg-gray-700">
          <Footer />
        </MFooter>
      }
    >
      {children}
    </AppShell>
  );
}

export default function WithProviders({
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
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <SelectionContext.Provider value={value}>
        <AppLayout children={children} />
      </SelectionContext.Provider>
    </MantineProvider>
  );
}
