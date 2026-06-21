"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function AddProductModal() {
  const params = useParams();

  const [open, setOpen] = useState(false);

  const [productName, setProductName] = useState("");
  const [cp, setCp] = useState("");
  const [sp, setSp] = useState("");

  async function saveProduct() {
    try {
      const response = await fetch(
        "/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: productName,
            cp,
            sp,
            businessId: params.slug,
          }),
        }
      );

      if (!response.ok) {
        toast.error(
          "Failed to create product"
        );
        return;
      }

      toast.success(
        "Product created"
      );

      setProductName("");
      setCp("");
      setSp("");

      setOpen(false);

      window.location.reload();
    } catch (error) {
      toast.error(
        "Something went wrong"
      );
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-white text-black px-5 py-3 rounded-xl font-semibold"
      >
        + Add Product
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

          <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md">

            <h2 className="text-2xl font-bold mb-4">
              Add Product
            </h2>

            <div className="space-y-4">

              <input
                value={productName}
                onChange={(e) =>
                  setProductName(
                    e.target.value
                  )
                }
                placeholder="Product Name"
                className="w-full bg-zinc-800 p-3 rounded-lg"
              />

              <input
                value={cp}
                onChange={(e) =>
                  setCp(e.target.value)
                }
                placeholder="Cost Price"
                type="number"
                className="w-full bg-zinc-800 p-3 rounded-lg"
              />

              <input
                value={sp}
                onChange={(e) =>
                  setSp(e.target.value)
                }
                placeholder="Selling Price"
                type="number"
                className="w-full bg-zinc-800 p-3 rounded-lg"
              />

              <button
                onClick={saveProduct}
                className="w-full bg-white text-black py-3 rounded-lg"
              >
                Save Product
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