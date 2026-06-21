"use client";

import Link from "next/link";

export default function BusinessNav({
  businessId,
  current,
}: {
  businessId: string;
  current:
    | "dashboard"
    | "products"
    | "sales"
    | "expenses"
    | "reports";
}) {
  const active =
    "bg-white text-black";

  const inactive =
    "bg-zinc-900 border border-zinc-800";

  return (
    <div className="flex flex-wrap gap-3 mt-6">

      <Link
        href={`/businesses/${businessId}`}
        className={`px-4 py-2 rounded-xl font-medium ${
          current === "dashboard"
            ? active
            : inactive
        }`}
      >
        Dashboard
      </Link>

      <Link
        href={`/businesses/${businessId}/products`}
        className={`px-4 py-2 rounded-xl ${
          current === "products"
            ? active
            : inactive
        }`}
      >
        Products
      </Link>

      <Link
        href={`/businesses/${businessId}/sales`}
        className={`px-4 py-2 rounded-xl ${
          current === "sales"
            ? active
            : inactive
        }`}
      >
        Sales
      </Link>

      <Link
        href={`/businesses/${businessId}/expenses`}
        className={`px-4 py-2 rounded-xl ${
          current === "expenses"
            ? active
            : inactive
        }`}
      >
        Expenses
      </Link>

      <Link
        href={`/businesses/${businessId}/reports`}
        className={`px-4 py-2 rounded-xl ${
          current === "reports"
            ? active
            : inactive
        }`}
      >
        Reports
      </Link>

    </div>
  );
}