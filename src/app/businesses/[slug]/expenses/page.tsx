"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import BusinessNav from "@/components/business/business-nav";
type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
};

export default function ExpensesPage() {
  const params = useParams();

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("Marketing");

  const [date, setDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  async function loadExpenses() {
    const response = await fetch(
      `/api/expenses?businessId=${params.slug}`
    );

    const data =
      await response.json();

    setExpenses(data);
  }

  useEffect(() => {
    loadExpenses();
  }, [params.slug]);

  async function addExpense() {
    if (!title) {
      toast.error(
        "Enter expense name"
      );
      return;
    }

    if (!amount) {
      toast.error(
        "Enter amount"
      );
      return;
    }

    const response = await fetch(
      "/api/expenses",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          title,
          amount,
          category,
          date,
          businessId:
            params.slug,
        }),
      }
    );

    if (!response.ok) {
      toast.error(
        "Failed to add expense"
      );
      return;
    }

    toast.success(
      "Expense added"
    );

    setTitle("");
    setAmount("");

    loadExpenses();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold">
          Expenses
        </h1>

        <p className="text-zinc-400 mt-2">
          Track business expenses
        </p>
        <BusinessNav
  businessId={params.slug as string}
  current="expenses"
/>
        <div className="grid md:grid-cols-4 gap-4 mt-8">

          <input
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            placeholder="Expense Name"
            className="bg-zinc-800 p-3 rounded-lg"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            className="bg-zinc-800 p-3 rounded-lg"
          >
            <option>
              Marketing
            </option>

            <option>
              Packaging
            </option>

            <option>
              Operations
            </option>

            <option>
              Software
            </option>

            <option>
              Salary
            </option>

            <option>
              Miscellaneous
            </option>
          </select>

          <input
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
            placeholder="Amount"
            className="bg-zinc-800 p-3 rounded-lg"
          />

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(
                e.target.value
              )
            }
            className="bg-zinc-800 p-3 rounded-lg"
          />

        </div>

        <button
          onClick={addExpense}
          className="mt-4 bg-white text-black px-6 py-3 rounded-xl font-semibold"
        >
          Add Expense
        </button>

        <div className="mt-10 border border-zinc-800 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-zinc-900">

              <tr>
                <th className="text-left p-4">
                  Date
                </th>

                <th className="text-left p-4">
                  Expense
                </th>

                <th className="text-left p-4">
                  Category
                </th>

                <th className="text-left p-4">
                  Amount
                </th>
                <th className="text-left p-4">
  Actions
</th>
              </tr>

            </thead>

            <tbody>

              {expenses.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-16 text-zinc-500"
                  >
                    No expenses added yet
                  </td>
                </tr>
              ) : (
                expenses.map(
                  (
                    expense
                  ) => (
                    <tr
                      key={
                        expense.id
                      }
                      className="border-t border-zinc-800"
                    >
                      <td className="p-4">
                        {new Date(
                          expense.date
                        ).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        {
                          expense.title
                        }
                      </td>

                      <td className="p-4">
                        {
                          expense.category
                        }
                      </td>

                      <td className="p-4 text-red-500">
                        ₹
                        {
                          expense.amount
                        }
                      </td>
                      <td className="p-4">
  <button
    onClick={async () => {
      const response =
        await fetch(
          `/api/expenses?id=${expense.id}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {
        return;
      }

      setExpenses((prev) =>
        prev.filter(
          (e) =>
            e.id !== expense.id
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
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}