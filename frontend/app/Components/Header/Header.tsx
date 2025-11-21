// components/Header.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    // Map routes to titles
    const pageTitles: Record<string, string> = {
        "/": "Home",
        "/warehouses": "Warehouses",
        "/analytics": "Analytics",
        "/settings": "Settings"
    };

    const title = pageTitles[pathname] || "My Inventory App";

    return (
        <header className="bg-indigo-600 text-white shadow-md py-4">
        <div className="container mx-auto flex items-center justify-between px-4 relative">
            {/* Left nav (optional: logo or links) */}
            <div className="flex gap-6">
            <Link href="/" className="hover:text-indigo-200 transition">
                Home
            </Link>
            <Link href="/warehouses" className="hover:text-indigo-200 transition">
                Warehouses
            </Link>

            <Link href="/settings" className="hover:text-indigo-200 transition">
                Settings
            </Link>

            </div>

            
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">
            {title}
            </h1>

            
            <div className="flex gap-6">
            
            </div>
        </div>
        </header>
    );
}
