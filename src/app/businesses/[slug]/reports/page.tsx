"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BusinessNav from "@/components/business/business-nav";
import RevenueChart from "@/components/reports/revenue-chart";
import ProfitChart from "@/components/reports/profit-chart";

type ProductAnalytics = {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
  profit: number;
};

type MonthlyReport = {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
};

export default function ReportsPage() {
  const params = useParams();

  const [products, setProducts] =
    useState<ProductAnalytics[]>([]);

  const [monthlyReports, setMonthlyReports] =
    useState<MonthlyReport[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const productResponse =
          await fetch(
            `/api/reports/product-analytics?businessId=${params.slug}`
          );

        const monthlyResponse =
          await fetch(
            `/api/reports/monthly?businessId=${params.slug}`
          );

        const productData =
          await productResponse.json();

        const monthlyData =
          await monthlyResponse.json();

        setProducts(productData);
        setMonthlyReports(monthlyData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [params.slug]);

  const totalRevenue =
    products.reduce(
      (sum, product) =>
        sum + product.revenue,
      0
    );

  const totalProfit =
    products.reduce(
      (sum, product) =>
        sum + product.profit,
      0
    );

  const totalUnits =
    products.reduce(
      (sum, product) =>
        sum + product.unitsSold,
      0
    );

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex justify-between items-start">

          <div>
            <h1 className="text-4xl font-bold">
              Reports
            </h1>

            <p className="text-zinc-400 mt-2">
              Business analytics & performance
            </p>
            <BusinessNav
  businessId={params.slug as string}
  current="reports"
/>
          </div>

          <div className="flex gap-3">

            <button
              onClick={() => {
                window.open(
                  `/api/reports/export-csv?businessId=${params.slug}`
                );
              }}
              className="
                bg-white
                text-black
                px-5
                py-3
                rounded-xl
                font-semibold
              "
            >
              Export CSV
            </button>

            <button
              onClick={async () => {
                const { jsPDF } =
                  await import("jspdf");

                const response =
                  await fetch(
                    `/api/reports/export-pdf?businessId=${params.slug}`
                  );

                const data =
                  await response.json();

                const pdf =
                  new jsPDF();

                pdf.setFontSize(18);

                pdf.text(
                  "Business Report",
                  20,
                  20
                );

                pdf.setFontSize(12);

                pdf.text(
                  `Revenue: ₹${data.revenue}`,
                  20,
                  40
                );

                pdf.text(
                  `Expenses: ₹${data.expenses}`,
                  20,
                  50
                );

                pdf.text(
                  `Profit: ₹${data.profit}`,
                  20,
                  60
                );

                pdf.save(
                  "business-report.pdf"
                );
              }}
              className="
                bg-zinc-800
                px-5
                py-3
                rounded-xl
                font-semibold
              "
            >
              Export PDF
            </button>

          </div>

        </div>

        {/* SUMMARY */}

        <div className="grid md:grid-cols-3 gap-4 mt-8">

          <div className="bg-zinc-900 rounded-xl p-5">
            <p className="text-zinc-400">
              Total Revenue
            </p>

            <h2 className="text-3xl font-bold mt-2">
              ₹{totalRevenue}
            </h2>
          </div>

          <div className="bg-zinc-900 rounded-xl p-5">
            <p className="text-zinc-400">
              Total Profit
            </p>

            <h2
              className={`text-3xl font-bold mt-2 ${
                totalProfit >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              ₹{totalProfit}
            </h2>
          </div>

          <div className="bg-zinc-900 rounded-xl p-5">
            <p className="text-zinc-400">
              Units Sold
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {totalUnits}
            </h2>
          </div>

        </div>

        {/* TOP PRODUCTS */}

        <div className="mt-10 border border-zinc-800 rounded-xl overflow-hidden">

          <div className="bg-zinc-900 p-4 border-b border-zinc-800">

            <h2 className="text-xl font-semibold">
              Top Selling Products
            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-zinc-900">

              <tr>
                <th className="text-left p-4">
                  Product
                </th>

                <th className="text-left p-4">
                  Units Sold
                </th>

                <th className="text-left p-4">
                  Revenue
                </th>

                <th className="text-left p-4">
                  Profit
                </th>
              </tr>

            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-16 text-zinc-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-16 text-zinc-500"
                  >
                    No sales data available
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-zinc-800"
                  >
                    <td className="p-4">
                      {product.name}
                    </td>

                    <td className="p-4">
                      {product.unitsSold}
                    </td>

                    <td className="p-4">
                      ₹{product.revenue}
                    </td>

                    <td
                      className={`p-4 ${
                        product.profit >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      ₹{product.profit}
                    </td>
                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

        {/* MONTHLY PERFORMANCE */}

        <div className="mt-10 border border-zinc-800 rounded-xl overflow-hidden">

          <div className="bg-zinc-900 p-4 border-b border-zinc-800">

            <h2 className="text-xl font-semibold">
              Monthly Performance
            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-zinc-900">

              <tr>
                <th className="text-left p-4">
                  Month
                </th>

                <th className="text-left p-4">
                  Revenue
                </th>

                <th className="text-left p-4">
                  Expenses
                </th>

                <th className="text-left p-4">
                  Profit
                </th>
              </tr>

            </thead>

            <tbody>

              {monthlyReports.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-16 text-zinc-500"
                  >
                    No monthly data available
                  </td>
                </tr>
              ) : (
                monthlyReports.map((month) => (
                  <tr
                    key={month.month}
                    className="border-t border-zinc-800"
                  >
                    <td className="p-4">
                      {month.month}
                    </td>

                    <td className="p-4">
                      ₹{month.revenue}
                    </td>

                    <td className="p-4">
                      ₹{month.expenses}
                    </td>

                    <td
                      className={`p-4 ${
                        month.profit >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      ₹{month.profit}
                    </td>
                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

        {/* CHARTS */}

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <RevenueChart
            data={monthlyReports}
          />

          <ProfitChart
            data={monthlyReports}
          />

        </div>

      </div>
    </main>
  );
}