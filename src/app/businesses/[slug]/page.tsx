"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BusinessNav from "@/components/business/business-nav";
type Business = {
  id: string;
  name: string;
  description: string | null;
};

type DashboardData = {
    revenue: number;
    cogs: number;
    expenses: number;
    ebitda: number;
    ebitdaPercent: number;
    pbt: number;
    pbtPercent: number;
    netProfit: number;
    netProfitPercent: number;
  };

export default function BusinessDashboard() {
  const params = useParams();

  const [business, setBusiness] =
    useState<Business | null>(null);

    const [dashboard, setDashboard] =
    useState<DashboardData>({
      revenue: 0,
      cogs: 0,
      expenses: 0,
      ebitda: 0,
      ebitdaPercent: 0,
      pbt: 0,
      pbtPercent: 0,
      netProfit: 0,
      netProfitPercent: 0,
    });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const businessesResponse =
          await fetch("/api/businesses");

        const businesses =
          await businessesResponse.json();

        const currentBusiness =
          businesses.find(
            (b: Business) =>
              b.id === params.slug
          );

        setBusiness(
          currentBusiness || null
        );

        const dashboardResponse =
          await fetch(
            `/api/dashboard?businessId=${params.slug}`
          );

        const dashboardData =
          await dashboardResponse.json();

        setDashboard(
          dashboardData
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white p-8">
        Loading...
      </main>
    );
  }

  if (!business) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white p-8">
        Business not found
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">

      <div>

<h1 className="text-4xl font-bold">
  {business.name}
</h1>

<p className="text-zinc-400 mt-2">
  {business.description ||
    "No description"}
</p>
<BusinessNav
  businessId={params.slug as string}
  current="dashboard"
/>

</div>

        <div className="grid md:grid-cols-4 gap-4 mt-8">

          <div className="bg-zinc-900 rounded-xl p-5">
            <p className="text-zinc-400">
              Revenue
            </p>

            <h2 className="text-3xl font-bold mt-2">
              ₹{dashboard.revenue.toFixed(0)}
            </h2>
          </div>

          <div className="bg-zinc-900 rounded-xl p-5">
            <p className="text-zinc-400">
            Cost of Goods Sold
            </p>

            <h2 className="text-3xl font-bold mt-2">
              ₹{dashboard.cogs.toFixed(0)}
            </h2>
          </div>

          <div className="bg-zinc-900 rounded-xl p-5">
            <p className="text-zinc-400">
              Expenses
            </p>

            <h2 className="text-3xl font-bold mt-2">
              ₹{dashboard.expenses.toFixed(0)}
            </h2>
          </div>

          <div className="bg-zinc-900 rounded-xl p-5">
            <p className="text-zinc-400">
            Operating Profit (EBITDA)
            </p>

            <h2 className={`text-3xl font-bold mt-2 ${
  dashboard.ebitda >= 0
    ? "text-green-500"
    : "text-red-500"
}`}>
              ₹{dashboard.ebitda.toFixed(0)}
            </h2>
          </div>

          <div className="bg-zinc-900 rounded-xl p-5">
            <p className="text-zinc-400">
              EBITDA %
            </p>

           <h2 className={`text-3xl font-bold mt-2 ${
  dashboard.ebitdaPercent >= 0
    ? "text-green-500"
    : "text-red-500"
}`}>
              {dashboard.ebitdaPercent.toFixed(1)}%
            </h2>
          </div>

          <div className="bg-zinc-900 rounded-xl p-5">
            <p className="text-zinc-400">
            Profit Before Tax (PBT)
            </p>

            <h2 className={`text-3xl font-bold mt-2 ${
  dashboard.pbt >= 0
    ? "text-green-500"
    : "text-red-500"
}`}>
              ₹{dashboard.pbt.toFixed(0)}
            </h2>
          </div>
          <div className="bg-zinc-900 rounded-xl p-5">
  <p className="text-zinc-400">
    Net Profit / Loss
  </p>

  <h2
    className={`text-3xl font-bold mt-2 ${
      dashboard.netProfit >= 0
        ? "text-green-500"
        : "text-red-500"
    }`}
  >
    ₹{dashboard.netProfit.toFixed(0)}
  </h2>
</div>

<div className="bg-zinc-900 rounded-xl p-5">
  <p className="text-zinc-400">
    Net Profit Margin %
  </p>

  <h2
    className={`text-3xl font-bold mt-2 ${
      dashboard.netProfitPercent >= 0
        ? "text-green-500"
        : "text-red-500"
    }`}
  >
    {dashboard.netProfitPercent.toFixed(1)}%
  </h2>
</div>

        </div>

      </div>
    </main>
  );
}