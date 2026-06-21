"use client";
import { toast } from "sonner";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const result = await signIn(
      "credentials",
      {
        email,
        password,
        redirect: false,
      }
    );

    if (result?.error) {
        toast.error(
            "Invalid credentials"
          );
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800">

        <h1 className="text-3xl font-bold">
          Login
        </h1>

        <p className="text-zinc-400 mt-2">
          Sign in to Business OS
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-6 space-y-4"
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full bg-zinc-800 p-3 rounded-lg outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-zinc-800 p-3 rounded-lg outline-none"
          />

          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-lg font-semibold"
          >
            Login
          </button>

        </form>
        <div className="mt-6 text-center">

  <p className="text-zinc-400">
    New user?
  </p>

  <Link
    href="/signup"
    className="
      text-white
      font-semibold
      hover:underline
    "
  >
    Create an account
  </Link>

</div>

      </div>
    </main>
  );
}