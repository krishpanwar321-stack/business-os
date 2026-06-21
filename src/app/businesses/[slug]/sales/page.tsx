"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import BusinessNav from "@/components/business/business-nav";
type Product = {
  id: string;
  name: string;
  cp: number;
  sp: number;
};

type Sale = {
  id: string;
  unitsSold: number;
  date: string;
  product: Product;
};

export default function SalesPage() {
  const params = useParams();

  const [products, setProducts] =
    useState<Product[]>([]);

  const [sales, setSales] =
    useState<Sale[]>([]);

  const [selectedProduct, setSelectedProduct] =
    useState("");

  const [unitsSold, setUnitsSold] =
    useState("");

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  async function loadProducts() {
    const response = await fetch(
      `/api/products?businessId=${params.slug}`
    );

    const data = await response.json();

    setProducts(data);
  }

  async function loadSales() {
    const response = await fetch(
      `/api/sales?businessId=${params.slug}`
    );

    const data = await response.json();

    setSales(data);
  }

  useEffect(() => {
    loadProducts();
    loadSales();
  }, [params.slug]);

  async function saveSale() {
    if (!selectedProduct) {
      toast.error("Select product");
      return;
    }

    if (!unitsSold) {
      toast.error("Enter units sold");
      return;
    }

    const response = await fetch(
      "/api/sales",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          productId:
            selectedProduct,
          unitsSold,
          date,
          businessId:
            params.slug,
        }),
      }
    );

    if (!response.ok) {
      toast.error(
        "Failed to save sale"
      );
      return;
    }

    toast.success(
      "Sale saved"
    );

    setUnitsSold("");

    loadSales();
  }

  async function deleteSale(
    id: string
  ) {
    const response =
      await fetch(
        `/api/sales?id=${id}`,
        {
          method: "DELETE",
        }
      );

    if (!response.ok) {
      toast.error(
        "Failed to delete sale"
      );
      return;
    }

    setSales((prev) =>
      prev.filter(
        (sale) =>
          sale.id !== id
      )
    );

    toast.success(
      "Sale deleted"
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold">
          Daily Sales
        </h1>

        <p className="text-zinc-400 mt-2">
          Record daily sales
        </p>
        <BusinessNav
  businessId={params.slug as string}
  current="sales"
/>
        <div className="mt-8">

          <label className="block mb-2 text-zinc-400">
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(
                e.target.value
              )
            }
            className="bg-zinc-800 px-4 py-3 rounded-xl"
          />

        </div>

        <div className="mt-8 border border-zinc-800 rounded-xl p-6">

          <div className="space-y-4">

            <select
              value={selectedProduct}
              onChange={(e) =>
                setSelectedProduct(
                  e.target.value
                )
              }
              className="w-full bg-zinc-800 p-3 rounded-xl"
            >
              <option value="">
                Select Product
              </option>

              {products.map(
                (product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                  </option>
                )
              )}
            </select>

            <input
              type="number"
              value={unitsSold}
              onChange={(e) =>
                setUnitsSold(
                  e.target.value
                )
              }
              placeholder="Units Sold"
              className="w-full bg-zinc-800 p-3 rounded-xl"
            />

            <button
              onClick={saveSale}
              className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
            >
              Save Sale
            </button>

          </div>

        </div>

        <div className="mt-10 border border-zinc-800 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-zinc-900">
              <tr>
                <th className="text-left p-4">
                  Date
                </th>

                <th className="text-left p-4">
                  Product
                </th>

                <th className="text-left p-4">
                  Units
                </th>

                <th className="text-left p-4">
                  Revenue
                </th>

                <th className="text-left p-4">
                  Profit
                </th>

                <th className="text-left p-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {sales.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-16 text-zinc-500"
                  >
                    No sales yet
                  </td>
                </tr>
              ) : (
                sales.map(
                  (sale) => {
                    const revenue =
                      sale.unitsSold *
                      sale.product.sp;

                    const profit =
                      sale.unitsSold *
                      (
                        sale.product.sp -
                        sale.product.cp
                      );

                    return (
                      <tr
                        key={
                          sale.id
                        }
                        className="border-t border-zinc-800"
                      >
                        <td className="p-4">
                          {new Date(
                            sale.date
                          ).toLocaleDateString()}
                        </td>

                        <td className="p-4">
                          {
                            sale.product
                              .name
                          }
                        </td>

                        <td className="p-4">
                          {
                            sale.unitsSold
                          }
                        </td>

                        <td className="p-4">
                          ₹{revenue}
                        </td>

                        <td className="p-4 text-green-500">
                          ₹{profit}
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() =>
                              deleteSale(
                                sale.id
                              )
                            }
                            className="
                            bg-red-600
                            hover:bg-red-700
                            px-3
                            py-1
                            rounded-lg
                            text-sm
                            "
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}