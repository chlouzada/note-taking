import type { NextPage } from "next";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Head from "next/head";
import { Button } from "@mantine/core";
import { useRouter } from "next/router";
import { useSupabase } from "../contexts/Supabase";

const Home: NextPage = () => {
  const { session, signOut } = useSupabase();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Note Taking</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <Header />
        <main className="container flex flex-col items-center justify-center h-full p-4 mx-auto">
          <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700 ">
            Note Taking
          </h1>
          <div className="w-52">
            {session ? (
              <>
                <Button fullWidth onClick={signOut}>
                  Sign Out
                </Button>
                <Button fullWidth onClick={() => router.push("/editor")}>
                  Editor
                </Button>
              </>
            ) : (
              <Button fullWidth onClick={() => router.push("/signin")}>
                Sign In
              </Button>
            )}
          </div>
        </main>
        <Footer />
      </>
    </>
  );
};

export default Home;
