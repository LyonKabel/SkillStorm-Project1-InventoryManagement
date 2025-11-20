"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getItems, createItem, deleteItem, getWarehouseById } from "@/lib/api";
import { Item } from "@/types/Item";
import SearchBar from "@/app/Components/SearchBar/searchbar";

export default function WarehouseItemsClient({ warehouseId }: { warehouseId: number }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [warehouseName, setWarehouseName] = useState<string>("");

  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [search, setSearch] = useState("");

  // Fetch items
  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const data = await getItems(warehouseId);
        setItems(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load items.");
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [warehouseId]);

  // Fetch warehouse name
  useEffect(() => {
    async function fetchWarehouse() {
      try {
        const warehouse = await getWarehouseById(warehouseId);
        setWarehouseName(warehouse.name);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load warehouse info.");
      }
    }
    fetchWarehouse();
  }, [warehouseId]);

  // Create item
  const handleCreateItem = async () => {
    if (!newName || newQuantity <= 0) return toast.error("Fill all fields");

    try {
      const newItem = await createItem(warehouseId, { name: newName, quantity: newQuantity });
      setItems([...items, newItem]);
      toast.success("Item created!");
      setShowCreateForm(false);
      setNewName("");
      setNewQuantity(0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create item.");
    }
  };

  // Delete item
  const handleDelete = async (itemId: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteItem(warehouseId, itemId);
      setItems(items.filter((i) => i.itemId !== itemId));
      toast.success("Item deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item.");
    }
  };

  if (loading)
    return <p className="text-center mt-20 text-gray-500 text-lg">Loading items...</p>;

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
      <SearchBar value={search} onChange={setSearch} placeholder="Search items..." />
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-700">
          Items in Warehouse {warehouseName}
        </h2>
        <button
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 transform transition flex items-center gap-2"
          onClick={() => setShowCreateForm(true)}
        >
          + Add Item
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-6 p-6 bg-white rounded-2xl shadow-md animate-fadeIn">
          <h3 className="font-semibold text-lg mb-4 text-black">Create New Item</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <input
              className="text-black border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-indigo-500"
              placeholder="Item name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className="text-black border p-3 w-32 rounded-lg focus:ring-2 focus:ring-indigo-500"
              type="number"
              placeholder="Quantity"
              value={newQuantity}
              onChange={(e) => setNewQuantity(Number(e.target.value))}
            />
            <div className="flex gap-2">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
                onClick={handleCreateItem}
              >
                Save
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-400 transition"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg animate-fadeIn">
        <table className="min-w-full border-collapse table-auto">
          <thead className="bg-indigo-100 text-indigo-700 font-semibold">
            <tr>
              <th className="p-4 text-left border-b border-indigo-200">ID</th>
              <th className="p-4 text-left border-b border-indigo-200">Name</th>
              <th className="p-4 text-left border-b border-indigo-200">Quantity</th>
              <th className="p-4 text-left border-b border-indigo-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.itemId}
                className="hover:bg-indigo-50 transition-colors"
              >
                <td className="font-bold text-black p-4 border-b border-gray-200">{item.itemId}</td>
                <td className="font-bold text-black p-4 border-b border-gray-200">{item.name}</td>
                <td className="font-bold text-black p-4 border-b border-gray-200">{item.quantity}</td>
                <td className="font-bold text-black p-4 border-b border-gray-200">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
                    onClick={() => handleDelete(item.itemId!)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
