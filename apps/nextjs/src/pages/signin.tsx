import { useState } from "react";
import { supabase } from "../utils/supabase-client";
import { useForm } from "react-hook-form";
import { At } from "tabler-icons-react";
import { useMutation } from "@tanstack/react-query";
import { AuthError } from "@supabase/supabase-js";
import classNames from "classnames";
import { useSupabase } from "../contexts/Supabase";

export default function SignInPage() {
  const { signIn } = useSupabase();
  const { register, handleSubmit } = useForm<{ email: string }>();

  const submit = useMutation(handleSubmit(signIn));

  // const handleLogin = async (email: string) => {
  //   try {
  //     setLoading(true);
  //     const { error } = await supabase.auth.signInWithOtp({ email });
  //     if (error) throw error;
  //     alert("Check your email for the login link!");
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="grid grid-cols-8 h-full">
      <div className="col-start-1 col-end-9 md:col-end-6 lg:col-end-5 my-auto px-3 md:mx-auto md:max-w-xl md:w-5/6 xl:w-1/2">
        <div className="card shadow-xl">
          <div className="card-body p-4 md:p-8 flex flex-col gap-4">
            <h2 className="card-title text-3xl pb-4 ">Welcome</h2>
            <form
              onSubmit={(form) => {
                if (submit.isLoading) return;
                submit.mutate(form);
              }}
              className="flex flex-col"
            >
              <input
                required
                type="email"
                placeholder="Your email"
                className="input input-bordered w-full"
                {...register("email", { required: true })}
              />
              <button
                disabled={submit.isSuccess}
                className={classNames(
                  "btn btn-primary w-full transition-all duration-200 mt-4",
                  { loading: submit.isLoading }
                )}
              >
                {submit.isSuccess ? "Check Email" : "With Email"}
              </button>
              {submit.isError && (
                <span className="mt-2 text-red-500">
                  {(submit.error as AuthError).message}
                </span>
              )}
            </form>
            <div className="divider m-0"></div>
            <button disabled className="btn btn-primary w-full">
              With Google
            </button>
          </div>
        </div>
      </div>
      <div className="hidden md:block md:col-start-6 lg:col-start-5 col-end-9 bg-neutral shadow-xl" />
    </div>
  );
}
