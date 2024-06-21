"use client";

import { onSubmit } from "@/app/lib/actions/login";
import { loginFormSchema } from "@/app/lib/schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
  });

  async function handleResult(data: z.infer<typeof loginFormSchema>) {
    try {
      await onSubmit(data as z.infer<typeof loginFormSchema>);
    } catch (error: any) {
      setError("password", { message: error.message as string });
    }
  }

  return (
    <form
      className="space-y-7"
      onSubmit={handleSubmit(
        async (data) =>
          await handleResult(data as z.infer<typeof loginFormSchema>)
      )}
    >
      <div className="space-y-2">
        <div className="flex flex-col">
          <label className="py-1">Логин</label>
          <input
            {...register("login")}
            className="w-80 outline-none text-sm font-sans font-normal leading-5 px-3 py-2 rounded-lg shadow-md shadow-slate-100 dark:shadow-slate-900 focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-purple-500 dark:hover:border-purple-500 focus:border-purple-500 dark:focus:border-purple-500 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0"
          />
          <div className="text-red-500 text-wrap w-80 text-sm pt-1">
            {errors?.login?.message as string}
          </div>
        </div>
        <div className="flex flex-col">
          <label className="py-1">Пароль</label>
          <input
            {...register("password")}
            className="w-80 outline-none text-sm font-sans font-normal leading-5 px-3 py-2 rounded-lg shadow-md shadow-slate-100 dark:shadow-slate-900 focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-purple-500 dark:hover:border-purple-500 focus:border-purple-500 dark:focus:border-purple-500 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0"
          />
          <div className="text-red-500 text-wrap w-80 text-sm pt-1">
            {errors?.password?.message as string}
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-80 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:bg-purple-700"
      >
        Войти
      </button>
    </form>
  );
}
