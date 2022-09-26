import { Editor } from "../components/Editor";
import { Navigation } from "../components/Navigation";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { GetServerSideProps } from "next";
import { clientEnv } from "../env/schema.mjs";
import { trpc } from "../utils/trpc";
import { Loader } from "@mantine/core";

export default function EditorPage() {
  const { isLoading } = trpc.notebook.all.useQuery(undefined, {
    staleTime: 1000 * 30,
  });
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
