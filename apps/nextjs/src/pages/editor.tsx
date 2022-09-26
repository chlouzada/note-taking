import { Editor } from "../components/Editor";
import { Navigation } from "../components/Navigation";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { GetServerSideProps } from "next";
import { clientEnv } from "../env/schema.mjs";
import { trpc } from "../utils/trpc";
import { Loader } from "@mantine/core";
import { useEditorStore } from "../stores/editor";

export default function EditorPage() {
  const {
    setSelectedNoteId,
    setSelectedNotebookId,
    selectedNoteId,
    selectedNotebookId,
  } = useEditorStore();

  const { isLoading, data } = trpc.editor.useQuery(undefined, {
    staleTime: 1000 * 30,
  });

  if (data) {
    if (data.notebooks.length > 0 && !selectedNotebookId)
      setSelectedNotebookId(data.notebooks[0].id);
    if (data.notes.length > 0 && !selectedNoteId)
      setSelectedNoteId(data.notes[0].id);
  }

  return (
    <div className="flex flex-col h-full">
      <Header />
      {isLoading ? (
        <div className="col-start-1 col-end-9 m-auto">
          <Loader color="indigo" variant="dots" />
        </div>
      ) : (
        <>
          <div className="h-full grid grid-cols-8">
            <Navigation />
            <Editor />
          </div>
          <Footer />
        </>
      )}
    </div>
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
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
