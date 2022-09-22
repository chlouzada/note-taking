import { useForm } from "react-hook-form";
import { At } from "tabler-icons-react";
import { useMutation } from "@tanstack/react-query";
import { AuthError } from "@supabase/supabase-js";
import classNames from "classnames";
import { useSupabase } from "../contexts/Supabase";
import { useRouter } from "next/router";
import { Button, Divider, TextInput } from "@mantine/core";

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useSupabase();
  const { register, handleSubmit } = useForm<{ email: string }>();

  const submit = useMutation(handleSubmit(signIn));

  return (
    // <div className="grid grid-cols-8 h-full">
    //   <div className="col-start-1 col-end-9 md:col-end-6 lg:col-end-5 bg-black flex justify-center items-center">
    //   </div>
    //   <div className="hidden md:block md:col-start-6 lg:col-start-5 col-end-9 bg-gray-800 shadow-xl" />
    // </div>
    <div className="flex h-full justify-center items-center bg-slate-800">
      <div className="bg-white rounded-md p-4 w-full md:w-3/5 lg:w-2/5 xl:w-1/5 m-2 flex flex-col gap-4">
        <h2 className="text-3xl font-bold pb-4">Welcome</h2>
        <form
          onSubmit={(form) => {
            if (submit.isLoading) return;
            submit.mutate(form);
          }}
          className="flex flex-col"
        >
          <TextInput
            required
            type="email"
            placeholder="Your email"
            className="input input-bordered w-full"
            icon={<At size={16} />}
            {...register("email", { required: true })}
          />
          <Button
            type="submit"
            disabled={submit.isSuccess}
            fullWidth
            className="mt-4"
            // className={classNames(
            //   "btn btn-primary w-full transition-all duration-200 mt-4",
            //   { loading: submit.isLoading }
            // )}
          >
            {submit.isSuccess
              ? "Check Email"
              : submit.isLoading
              ? "Sending..."
              : "With Email"}
          </Button>
          {submit.isError && (
            <span className="mt-2 text-red-500">
              {(submit.error as AuthError).message}
            </span>
          )}
        </form>
        <Divider />
        <Button disabled className="btn btn-primary w-full">
          With Google
        </Button>
      </div>
    </div>
  );
}
