// app/warehouses/[id]/analytics/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
    import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    } from "recharts";
    import { getItems, getWarehouseById } from "@/lib/api";
    import { Item } from "@/types/Item";
    import { Warehouse } from "@/types/Warehouse";
    import { Variant } from "@/types/Variant";


    type Props = {
    warehouseId: number;
    };


    type ActivityEvent = {
    type: "CREATE" | "UPDATE" | "DELETE" | string;
    message: string;
    timestamp: string;
    };

    


    export default function WarehouseAnalyticsPage({ warehouseId }: Props) {

    const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<ActivityEvent[]>([]);

    useEffect(() => {
        async function fetchAll() {
        setLoading(true);
        try {
            const [w, i] = await Promise.all([
            getWarehouseById(warehouseId),
            getItems(warehouseId),
            ]);
            setWarehouse(w);
            setItems(Array.isArray(i) ? i : []);
        } catch (err) {
            console.error("Analytics fetch error", err);
        } finally {
            setLoading(false);
        }
        }
        fetchAll();

        // load activity log from localStorage (MVP approach)
        try {
        const raw = localStorage.getItem("activityLog");
        const parsed = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed)) setEvents(parsed as ActivityEvent[]);
        } catch {
        setEvents([]);
        }
    }, [warehouseId]);

    // Derived metrics
    const totalItems = items.length;
    const totalVariants = items.reduce((sum, it) => sum + (it.variants?.length || 0), 0);
    const totalQuantity = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
    const maxCapacity = warehouse?.maximumCapacity ?? 0;
    const capacityPercent = maxCapacity ? (totalQuantity / maxCapacity) * 100 : 0;
    const usedCapacity = totalQuantity;
    const remainingCapacity = Math.max(0, maxCapacity - usedCapacity);

    // Chart data
    const itemQuantityData = useMemo(
        () =>
        items.map((it) => ({
            name: it.name.length > 18 ? it.name.slice(0, 15) + "…" : it.name,
            fullName: it.name,
            quantity: it.quantity ?? 0,
        })),
        [items]
    );

    
    // Variant distributions
    const sizeDistribution = useMemo(() => {
        const map = new Map<string, number>();
        items.forEach((it) => {
        (it.variants || []).forEach((v: Variant) => {
            const key = (v.size ?? "Unknown").toString();
            const qty = Number((v.quantityVariant ?? 0) || 0);
            map.set(key, (map.get(key) || 0) + qty);
        });
        });
        return Array.from(map.entries()).map(([size, value]) => ({ size, value }));
    }, [items]);

    const colorDistribution = useMemo(() => {
        const map = new Map<string, number>();
        items.forEach((it) => {
        (it.variants || []).forEach((v: Variant) => {
            const key = (v.color ?? "Unknown").toString();
            const qty = Number((v.quantityVariant ?? 0) || 0);
            map.set(key, (map.get(key) || 0) + qty);
        });
        });
        return Array.from(map.entries()).map(([color, value]) => ({ color, value }));
    }, [items]);

    // Low stock list (threshold < 5)
    const lowStockItems = items.filter((i) => (i.quantity ?? 0) < 25);

    // Helpers
    const COLORS = [
        "#4f46e5",
        "#06b6d4",
        "#f97316",
        "#ef4444",
        "#10b981",
        "#8b5cf6",
        "#f43f5e",
        "#14b8a6",
    ];

    const refreshData = async () => {
        setLoading(true);
        try {
        const [w, i] = await Promise.all([
            getWarehouseById(warehouseId),
            getItems(warehouseId),
        ]);
        setWarehouse(w);
        setItems(Array.isArray(i) ? i : []);
        // re-read events
        const raw = localStorage.getItem("activityLog");
        setEvents(raw ? JSON.parse(raw) : []);
        } catch (err) {
        console.error("refresh error", err);
        } finally {
        setLoading(false);
        }
    };

    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-600">Loading analytics…</p>
        </div>
        );
    }

    return (
        <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
            <div>
            <h1 className="text-2xl font-bold text-white">
                Analytics — {warehouse?.name ?? `Warehouse ${warehouseId}`}
            </h1>
            <p className="text-sm text-white">Overview & inventory insights</p>
            </div>
            <div className="flex gap-2">
            <button
                onClick={refreshData}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
            >
                Refresh
            </button>
            </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card label="Total Items" value={totalItems.toString()} />
            <Card label="Total Variants" value={totalVariants.toString()} />
            <Card label="Total Inventory" value={totalQuantity.toString()} />
            <Card
            label="Capacity Usage"
            value={`${capacityPercent.toFixed(1)}%`}
            sub={`${usedCapacity} / ${maxCapacity}`}
            />
        </div>

        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Item quantities bar chart */}
            <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-black text-lg font-semibold mb-2">Item Quantities</h3>
            <div style={{ height: 320 }}>
                {itemQuantityData.length === 0 ? (
                <p className="text-gray-500">No items to show.</p>
                ) : (
                    <ResponsiveContainer className={"text-black"} width="100%" height="100%">
                        <BarChart data={itemQuantityData}>
                            <XAxis dataKey="name" interval={0} angle={-25} textAnchor="end" height={70} />
                            <YAxis/>
                            <Tooltip
                                formatter={(
                                    value: number,
                                    name: string,
                                ) => [value, "Quantity"]}
                                />
                            <Bar dataKey="quantity" fill="#4f46e5" />
                        </BarChart>
                        </ResponsiveContainer>



                )}
            </div>
            </div>

            {/* Pie chart capacity */}
            <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-black text-lg font-semibold mb-2">Storage Usage</h3>
            <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={[
                        { name: "Used", value: usedCapacity },
                        { name: "Remaining", value: Math.max(0, remainingCapacity) },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                    >
                    <Cell fill={COLORS[0]} />
                    <Cell fill={COLORS[1]} />
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
                </ResponsiveContainer>
            </div>
            </div>

            {/* Size & color distributions */}
            <div className="bg-white p-4 rounded-xl shadow space-y-4">
            <div>
                <h3 className="text-black text-lg font-semibold mb-2">Size Distribution</h3>
                {sizeDistribution.length === 0 ? (
                <p className="text-gray-500">No variant data.</p>
                ) : (
                <div style={{ height: 120 }}>
                    <ResponsiveContainer className="text-black" width="100%" height="100%">
                    <BarChart data={sizeDistribution}>
                        <XAxis dataKey="size" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill={COLORS[2]} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                )}
            </div>

            <div>
                <h3 className="text-black text-lg font-semibold mb-2">Color Distribution</h3>
                {colorDistribution.length === 0 ? (
                <p className="text-gray-500">No variant data.</p>
                ) : (
                <div style={{ height: 120 }}>
                    <ResponsiveContainer className="text-black" width="100%" height="100%">
                    <BarChart
                        data={colorDistribution.map((c: { color: string; value: number }) => ({
                            name: c.color,
                            value: c.value,
                        }))}
                    >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill={COLORS[3]} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                )}
            </div>
            </div>
        </div>

        {/* Low stock + recent changes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-black text-lg font-semibold mb-4">Low Stock Alerts</h3>
            {lowStockItems.length === 0 ? (
                <p className="text-gray-500">No low-stock items (threshold: &lt; 5)</p>
            ) : (
                <table className="w-full text-left table-auto">
                <thead>
                    <tr>
                    <th className="text-black py-2">Item</th>
                    <th className="text-black py-2">Quantity</th>
                    <th className="text-black py-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {lowStockItems.map((i) => (
                    <tr key={i.itemId}>
                        <td className="text-black py-2">{i.name}</td>
                        <td className="text-black py-2">{i.quantity}</td>
                        <td className="text-black py-2 text-amber-600">⚠️ Low Stock</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-black text-lg font-semibold">Recent Changes</h3>
                <button
                onClick={() => {
                    const raw = localStorage.getItem("activityLog");
                    setEvents(raw ? JSON.parse(raw) : []);
                }}
                className="text-black px-3 py-1 bg-gray-100 rounded"
                >
                Refresh
                </button>
            </div>

            {events.length === 0 ? (
                <p className="text-gray-500">No recent activity.</p>
            ) : (
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                {events.slice(0, 50).map((ev, idx) => (
                    <li key={idx} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between">
                        <div>
                        <div className="text-sm font-medium">{ev.type}</div>
                        <div className="text-sm text-gray-700">{ev.message}</div>
                        </div>
                        <div className="text-xs text-gray-400">
                        {new Date(ev.timestamp).toLocaleString()}
                        </div>
                    </div>
                    </li>
                ))}
                </ul>
            )}
            </div>
        </div>
        </div>
    );
    }

    /* Small reusable stat card */
    function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
        <div className="text-sm text-gray-500">{label}</div>
        <div className="mt-2">
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
        </div>
        </div>
    );
}
