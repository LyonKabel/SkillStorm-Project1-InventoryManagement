// app/settings/page.tsx
"use client";

import React, { useState } from "react";
    import toast, { Toaster } from "react-hot-toast";


    export default function SettingsPage() {
    const [username, setUsername] = useState("John Doe");
    const [email, setEmail] = useState("john@example.com");
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const handleSave = () => {
        // Validation
        if (!username.trim()) {
        toast.error("Username cannot be empty!");
        return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address!");
        return;
        }

        // All good, show success toast
        toast.success("Settings saved!");
    };

    return (
        <div className=" bg-white fill">
            
            <div className="p-6 max-w-3xl mx-auto space-y-8">
            {/* Toast container */}
            <Toaster position="top-right" />
            <h1 className="text-white text-2xl font-bold text-gray-800 mb-4">Settings</h1>
            {/* Profile Section */}
            <section className="bg-white p-6 rounded-xl shadow space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-500 mb-1">Username</label>
                    <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-500 mb-1">Email</label>
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                </div>
            </section>
            {/* Notifications Section */}
            <section className="bg-white p-6 rounded-xl shadow space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">Notifications</h2>
                <div className="flex items-center justify-between">
                <span className="text-gray-600">Enable notifications</span>
                <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="w-5 h-5 accent-indigo-600"
                />
                </div>
            </section>
            {/* Theme Section */}
            <section className="bg-white p-6 rounded-xl shadow space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">Appearance</h2>
                <div className="flex items-center justify-between">
                <span className="text-gray-600">Dark Mode</span>
                <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    className="w-5 h-5 accent-indigo-600"
                />
                </div>
            </section>
            {/* Save Button */}
            <div className="flex justify-end">
                <button
                onClick={handleSave}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
                >
                Save Settings
                </button>
            </div>
            </div>
            
        </div>
    );
}
