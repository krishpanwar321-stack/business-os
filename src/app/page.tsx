"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import AddBusinessModal from "@/components/business/add-business-modal";

type Business = {
  id: string;
  name: string;
  description: string | null;
};

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBusinesses() {
      try {
        const response = await fetch("/api/businesses");

        const data = await response.json();

        setBusinesses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadBusinesses();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold">
              Business OS
            </h1>

            <p className="text-zinc-400 mt-2">
              Manage all your businesses from one place.
            </p>
          </div>

          <div className="flex gap-3">

  <button
    onClick={() =>
      signOut({
        callbackUrl: "/login",
      })
    }
    className="
      bg-red-600
      hover:bg-red-700
      px-5
      py-3
      rounded-xl
      font-semibold
    "
  >
    Logout
  </button>

  <AddBusinessModal />

</div>
        </div>

        {loading ? (
          <div className="mt-12 text-zinc-500">
            Loading...
          </div>
        ) : businesses.length === 0 ? (
          <div className="mt-12 border border-zinc-800 rounded-2xl p-16 text-center">

            <h2 className="text-2xl font-semibold">
              No Businesses Yet
            </h2>

            <p className="text-zinc-500 mt-3">
              Create your first business to get started.
            </p>

          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mt-12">

            {businesses.map((business) => (
              <Link
                key={business.id}
                href={`/businesses/${business.id}`}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition"
              >
                <h2 className="text-2xl font-bold">
                  {business.name}
                </h2>

                <p className="text-zinc-400 mt-3">
                  {business.description ||
                    "No description"}
                </p>

                <div className="mt-6 text-sm text-zinc-500">
                  Open Business →
                </div>
              </Link>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}