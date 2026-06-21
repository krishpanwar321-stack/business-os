"use client";

import { useState } from "react";

export default function AddBusinessModal() {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  async function createBusiness() {
    const response = await fetch(
      "/api/businesses",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      }
    );

    if (!response.ok) {
      alert("Failed");
      return;
    }

    setName("");
    setDescription("");

    setOpen(false);

    location.reload();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
      >
        + Add Business
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md">

            <h2 className="text-2xl font-bold mb-5">
              Add Business
            </h2>

            <div className="space-y-4">

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Business Name"
                className="w-full bg-zinc-800 p-3 rounded-lg"
              />

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Description"
                className="w-full bg-zinc-800 p-3 rounded-lg"
              />

              <button
                onClick={createBusiness}
                className="w-full bg-white text-black py-3 rounded-lg"
              >
                Create Business
              </button>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="w-full bg-zinc-700 py-3 rounded-lg"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}