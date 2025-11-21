"use client";
import React from 'react';
import Link from "next/link";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

            <main className="max-w-7xl mx-auto px-4 py-12">
                <section className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Shirt Inventory Management</h2>
                    <p className="text-2xl text-gray-600">A best way to make sure you keep track of your shirts</p>
                </section>

                

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Inventory Card */}
            <Link href="/warehouses">
                <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">📦 Inventory</h3>
                <p className="text-gray-600">Track and manage your products</p>
                </div>
            </Link>

            {/* Analytics Card */}
            <Link href="/analytics">
                <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">📊 Analytics</h3>
                <p className="text-gray-600">View detailed inventory reports</p>
                </div>
            </Link>

            {/* Settings Card */}
            <Link href="/settings">
                <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">⚙️ Settings</h3>
                <p className="text-gray-600">Configure your preferences</p>
                </div>
            </Link>
        </div>

            </main>
        </div>
    );
}