"use client";
import Link from "next/link";
export default function InventoryPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Inventory</h1>
      <p>Here you can track and manage your products.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Inventory Card */}
            <Link href="/warehouses">
                <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">📦 Inventory</h3>
                <p className="text-gray-600">Track and manage your products</p>
                </div>
            </Link>

            <Link href="/items">
                <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">📦 Inventory</h3>
                <p className="text-gray-600">Track and manage your products</p>
                </div>
            </Link>

      </div>

    </div>
  );
}
