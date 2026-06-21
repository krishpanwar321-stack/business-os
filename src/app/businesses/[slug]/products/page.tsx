"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BusinessNav from "@/components/business/business-nav";
import AddProductModal from "@/components/products/add-product-modal";

type Product = {
  id: string;
  name: string;
  cp: number;
  sp: number;
};

export default function ProductsPage() {
  const params = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(
          `/api/products?businessId=${params.slug}`
        );

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [params.slug]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">
              Products
            </h1>
            <BusinessNav
  businessId={params.slug as string}
  current="products"
/>
            <p className="text-zinc-400 mt-2">
              Manage products
            </p>
          </div>

          <AddProductModal />
        </div>

        <div className="mt-10 border border-zinc-800 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-zinc-900">
              <tr>
                <th className="text-left p-4">
                  Product
                </th>

                <th className="text-left p-4">
                  CP
                </th>

                <th className="text-left p-4">
                  SP
                </th>

                <th className="text-left p-4">
                  Profit
                </th>

                <th className="text-left p-4">
                  Profit %
                </th>
                <th className="text-left p-4">
  Actions
</th>
              </tr>

            </thead>
            

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-16 text-zinc-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                   colSpan={6}
                    className="text-center py-16 text-zinc-500"
                  >
                    No products added yet
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const profit =
                    product.sp - product.cp;

                  const profitPercent =
                    (
                      (profit /
                        product.cp) *
                      100
                    ).toFixed(0);

                  return (
                    <tr
                      key={product.id}
                      className="border-t border-zinc-800"
                    >
                      <td className="p-4">
                        {product.name}
                      </td>

                      <td className="p-4">
                        ₹{product.cp}
                      </td>

                      <td className="p-4">
                        ₹{product.sp}
                      </td>

                      <td className="p-4 text-green-500">
                        ₹{profit}
                      </td>

                      <td className="p-4 text-green-500">
                        {profitPercent}%
                      </td>
                      <td className="p-4">
  <button
    onClick={async () => {
      const response =
        await fetch(
          `/api/products?id=${product.id}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {
        return;
      }

      setProducts((prev) =>
        prev.filter(
          (p) =>
            p.id !== product.id
        )
      );
    }}
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
                })
              )}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}