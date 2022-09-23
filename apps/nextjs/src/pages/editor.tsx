import React, { createContext, useContext, useEffect, useState } from "react";
import { Editor } from "../components/Editor";
import { Navigation } from "../components/Navigation";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { GetServerSideProps } from "next";
import { clientEnv } from "../env/schema.mjs";

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;

  const cookies = req.headers.cookie;

  if (
    !cookies?.includes(`sb-${clientEnv.NEXT_PUBLIC_SUPABASE_REF}-access-token`)
  ) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
