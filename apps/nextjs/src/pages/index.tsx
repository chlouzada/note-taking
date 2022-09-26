import type { NextPage } from "next";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSupabase } from "../contexts/Supabase";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { AuthError } from "@supabase/supabase-js";
import { Divider } from "@mantine/core";
import { useEffect } from "react";
import Link from "next/link";

const SignInView = () => {
  const router = useRouter();
  const { signIn, session, signInWithGoogle } = useSupabase();
  const { register, handleSubmit } = useForm<{ email: string }>();

  const submit = useMutation(handleSubmit(signIn));
  const google = useMutation(signInWithGoogle);

  useEffect(() => {
    if (session) router.push("/");
  }, [session]);

  return (
    <div className="border shadow bg-white rounded-md p-4 w-full md:w-3/5 lg:w-2/5 xl:w-1/5 flex flex-col gap-4">
      <form
        onSubmit={(form) => {
          if (submit.isLoading) return;
          submit.mutate(form);
        }}
        className="flex flex-col"
      >
        <input
          // TODO: ICON @
          required
          type="email"
          placeholder="Your email"
          className="input"
          {...register("email", { required: true })}
        />
        <button disabled={submit.isSuccess} className="btn w-full mt-4">
          {submit.isSuccess
            ? "Check Email"
            : submit.isLoading
            ? "Sending..."
            : "With Email"}
        </button>
        {submit.isError && (
          <span className="mt-2 text-red-500">
            {(submit.error as AuthError).message}
          </span>
        )}
      </form>
      <Divider />
      <button
        onClick={() => google.mutate()}
        className="btn btn-primary w-full"
      >
        With Google
      </button>
    </div>
  );
};

const Home: NextPage = () => {
  const { session, isLoading } = useSupabase();
  return (
    <>
      <Head>
        <title>Note Taking</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <main className="container flex flex-col items-center justify-center h-full p-4 mx-auto">
          <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-primary mb-16">
            Note Taking
          </h1>
          {!isLoading &&
            (session ? (
              <Link href={"/editor"}>
                <button className="btn btn-primary w-52"> Go To Editor</button>
              </Link>
            ) : (
              <SignInView />
            ))}
        </main>
      </>
    </>
  );
};

export default Home;
