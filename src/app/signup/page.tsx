"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  async function handleSignup(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const response = await fetch(
      "/api/signup",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
        toast.error(
            data.error || "Signup failed"
          );
      return;
    }

    toast.success(
        "Account created successfully"
      );

    window.location.href =
      "/login";
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800">

        <h1 className="text-3xl font-bold">
          Create Account
        </h1>

        <p className="text-zinc-400 mt-2">
          Create your Business OS account
        </p>

        <form
          onSubmit={handleSignup}
          className="mt-6 space-y-4"
        >

          <input
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            placeholder="Name"
            className="w-full bg-zinc-800 p-3 rounded-lg"
          />

          <input
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            type="email"
            placeholder="Email"
            className="w-full bg-zinc-800 p-3 rounded-lg"
          />

          <input
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            type="password"
            placeholder="Password"
            className="w-full bg-zinc-800 p-3 rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-lg font-semibold"
          >
            Create Account
          </button>

        </form>
        <div className="mt-6 text-center">

<p className="text-zinc-400">
  Already have an account?
</p>

<Link
  href="/login"
  className="
    text-white
    font-semibold
    hover:underline
  "
>
  Login
</Link>

</div>
      </div>
    </main>
  );
}