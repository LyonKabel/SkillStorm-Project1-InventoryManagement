"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse, getItems } from "@/lib/api";
import { Warehouse } from "@/types/Warehouse";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import SearchBar from "../Components/SearchBar/searchbar";

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(0);
  const [search, setSearch] = useState("");

  const [warehouseCapacities, setWarehouseCapacities] = useState<{[id: number]: number}>({});
  

  useEffect(() => {
    const fetchCapacities = async () => {
      const capacities: { [id: number]: number } = {};
      await Promise.all(
        warehouses.map(async (w) => {
          if (w.warehouseId === undefined) return; // skip if no ID
          try {
            const items = await getItems(w.warehouseId);
            const total = items.reduce((sum, i) => sum + i.quantity, 0);
            capacities[w.warehouseId] = total;
          } catch {
            capacities[w.warehouseId] = 0;
          }
        })
      );
      setWarehouseCapacities(capacities);
    };

    if (warehouses.length > 0) fetchCapacities();
  }, [warehouses]);



  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await getWarehouses();
        setWarehouses(Array.isArray(data) ? data : []);
        console.log(data);
      } catch {
        toast.error("Failed to load warehouses.");
      } finally {
        setLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  const openModalForCreate = () => {
    setEditingWarehouse(null);
    setName("");
    setLocation("");
    setMaxCapacity(0);
    setIsModalOpen(true);
  };

  const openModalForUpdate = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setName(warehouse.name);
    setLocation(warehouse.location);
    setMaxCapacity(warehouse.maximumCapacity);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      return toast.error("Name is required.");
    }
    if (!location.trim()) {
      return toast.error("Location is required.");
    }
    if (maxCapacity <= 0) {
      return toast.error("Maximum capacity must be greater than 0.");
    }
    if (editingWarehouse?.warehouseId != null) {
      const current = warehouseCapacities[editingWarehouse.warehouseId] || 0;
      if (current > maxCapacity) {
        return toast.error("New capacity cannot be less than current inventory.");
      }
    }
    try {
      if (editingWarehouse) {
        const updated = await updateWarehouse({ ...editingWarehouse, name, location, maximumCapacity: maxCapacity });
        setWarehouses(prev => prev.map(w => w.warehouseId === updated.warehouseId ? updated : w));
        toast.success("Warehouse updated successfully!");
      } else {
        const created = await createWarehouse({ name, location, maximumCapacity: maxCapacity });
        setWarehouses(prev => [...prev, created]);
        toast.success("Warehouse created successfully!");
      }
      setIsModalOpen(false);
    } catch {
      toast.error("Action failed.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteWarehouse(id);
      setWarehouses(prev => prev.filter(w => w.warehouseId !== id));
      setConfirmDeleteId(null);
      toast.success("Warehouse deleted!");
    } catch {
      toast.error("Delete failed.");
    }

  };

  // Filters by name only for now 
  // Filters warehouses based on what is in the search bar
  const filteredWarehouses = warehouses.filter(w =>
      w.name.toLowerCase().includes(search.toLowerCase())
    );

    

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading warehouses...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
      
      
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <SearchBar value={search} onChange={setSearch} placeholder="Search warehouses..." />
        <button
          onClick={openModalForCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 transform transition text-white px-6 py-3 rounded-lg shadow-lg"
        >
          <FiPlus /> Add Warehouse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredWarehouses.map(w => (
            <Link
              key={w.warehouseId}
              href={`/warehouses/${w.warehouseId}`}
              className="block rounded-xl transform transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative bg-white rounded-xl shadow-lg p-6 cursor-pointer">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-gray-800">{w.name}</h2>
                  <p className="text-gray-500 mt-1">Location: {w.location}</p>
                  <p className="text-gray-500">
                    Capacity: {w.warehouseId && warehouseCapacities[w.warehouseId] ? warehouseCapacities[w.warehouseId] : 0} / {w.maximumCapacity}
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openModalForUpdate(w);
                      }}
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition transform hover:scale-105"
                    >
                      <FiEdit /> Update
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setConfirmDeleteId(w.warehouseId!);
                      }}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition transform hover:scale-105"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </Link>

        ))}
      </div>

      {/* Modal for Create/Update */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg animate-fadeIn">
            <h2 className="text-black text-2xl font-bold mb-6">{editingWarehouse ? "Update Warehouse" : "Create Warehouse"}</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="text-black border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="text-black border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Maximum Capacity"
                value={maxCapacity}
                onChange={e => setMaxCapacity(Number(e.target.value))}
                className="text-black border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition shadow"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this warehouse? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
