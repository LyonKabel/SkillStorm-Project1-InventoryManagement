"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getItems, createItem, deleteItem, getWarehouseById, updateItem } from "@/lib/api";
import { Item } from "@/types/Item";
import SearchBar from "@/app/Components/SearchBar/searchbar";
import { Variant } from "@/types/Variant";
import React from "react";

export default function WarehouseItemsClient({ warehouseId }: { warehouseId: number }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [warehouseName, setWarehouseName] = useState<string>("");
  const [currentCapacity, setCurrentCapacity] = useState<number>(0);
  const [maxCapacity, setMaxCapacity] = useState<number>(0);
  const [expanded, setExpanded] = useState<{[key: number]: boolean}>({});
  const [newName, setNewName] = useState("");
  
  const [newDescription, setNewDescription] = useState("");
  const [search, setSearch] = useState("");
  const [variants, setVariants] = useState<Variant[]>([]);
  const [newSize, setNewSize] = useState("Small");
  const [newColor, setNewColor] = useState("Red");  

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editingVariants, setEditingVariants] = useState<Variant[]>([]);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  

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
        setMaxCapacity(warehouse.maximumCapacity);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load warehouse info.");
      }
    }
    fetchWarehouse();
  }, [warehouseId]);

  // Current capacity 
  useEffect(() => {
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
    setCurrentCapacity(totalQuantity);
  }, [items]);

  // Create item
  const handleCreateItem = async () => {
    if (!newName) return toast.error("Item name required!");
    if(newDescription.trim().length === 0) return toast.error("Description cannot be empty!");
    if (items.some(i => i.name.toLowerCase() === newName.trim().toLowerCase())) {
      return toast.error("An item with this name already exists in this database!");
    }
    
    

    // Sum variant quantities
    const totalVariantQuantity = variants.reduce(
      (sum, v) => sum + (v.quantityVariant || 0),
      0
    );

    if (totalVariantQuantity <= 0)
      return toast.error("Variant quantities must be greater than 0");

    // Check warehouse capacity
    if (currentCapacity + totalVariantQuantity > maxCapacity)
      return toast.error("Exceeds warehouse capacity");

    try {
      const newItem = await createItem(warehouseId, {
        name: newName,
        description: newDescription,
        variants: variants,
        quantity: totalVariantQuantity,
      });

      setItems([...items, newItem]);
      toast.success("Item created!");

      // Reset form
      setShowCreateForm(false);
      setNewName("");
      setNewDescription("");
      setVariants([]);
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

  // Update item
  const handleUpdate = (item: Item) => {
    setEditingItem(item);
    setEditingName(item.name);
    setEditingDescription(item.description);
    setEditingVariants(item.variants ? [...item.variants] : []);
  };


  const updateEditingVariant = (
    index: number,
    field: keyof Variant,
    value: string | number
  ) => {
    const newVariants = [...editingVariants];

    if (field === "quantityVariant") {
      newVariants[index][field] = Number(value) as Variant[typeof field];
    } else {
      newVariants[index][field] = value as Variant[typeof field];
    }

    setEditingVariants(newVariants);
  };


  const removeEditingVariant = (index: number) => {
    const newVariants = [...editingVariants];
    newVariants.splice(index, 1);
    setEditingVariants(newVariants);
  };

  const saveEditingItem = async () => {
    if (!editingItem) return;

    const totalQuantity = editingVariants.reduce((sum, v) => sum + (v.quantityVariant || 0), 0);
    if (totalQuantity <= 0) return toast.error("Total quantity must be > 0");

    // Calculate new warehouse capacity if this item is updated
    const otherItemsQuantity = items
      .filter(i => i.itemId !== editingItem.itemId)
      .reduce((sum, i) => sum + i.quantity, 0);

    if (otherItemsQuantity + totalQuantity > maxCapacity) {
      return toast.error("Updating this item exceeds warehouse capacity!");
    }

    try {
      const updatedItem = await updateItem(warehouseId, {
        ...editingItem,
        name: editingName,
        description: editingDescription,
        variants: editingVariants,
        quantity: totalQuantity,
      });

      setItems(items.map(i => (i.itemId === updatedItem.itemId ? updatedItem : i)));
      toast.success("Item updated!");
      setEditingItem(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update item");
    }
  };




  if (loading)
    return <p className="text-center mt-20 text-gray-500 text-lg">Loading items...</p>;

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.description.toLowerCase().includes(search.toLowerCase())
  );

  
  const addVariant = () => {
    setVariants([...variants, { size: newSize, color: newColor, quantityVariant: 0 }]);
  }

  



  const removeVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string | number
  ) => {
    const newVariants = [...variants];

    if (field === "quantityVariant") {
      newVariants[index][field] = Number(value) as Variant[typeof field];
    } else {
      newVariants[index][field] = value as Variant[typeof field];
    }

    setVariants(newVariants);
  };


  const toggleExpand = (id: number) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
      <SearchBar value={search} onChange={setSearch} placeholder="Search items..." />
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        
        <h2 className="text-center w-full text-2xl font-bold text-indigo-700">
          Items in Warehouse {warehouseName}
          <span className="pl-10">
            Capacity: {currentCapacity} / {maxCapacity}
          </span>
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
              className="flex-1/1 text-black border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-indigo-500"
              placeholder="Item name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            {/* Description */}
            <input
              className="flex-1/1 text-black border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
              type="text"
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            {variants.map((v, i) => (
              <div className="flex-1/1 gap-2 items-center" key={i}>
                <select
                  className="text-black border p-3 w-32 rounded-lg"
                  value={v.size}
                  onChange={(e) => updateVariant(i, "size", e.target.value)}
                >
                  <option>X-Small</option>
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                  <option>X-Large</option>
                </select>

                <select
                  className="text-black border p-3 w-32 rounded-lg"
                  value={v.color}
                  onChange={(e) => updateVariant(i, "color", e.target.value)}
                >
                  <option>Red</option>
                  <option>Blue</option>
                  <option>Green</option>
                  <option>Yellow</option>
                  <option>Black</option>
                  <option>White</option>
                  <option>Purple</option>
                </select>
                <> </>
                <input
                  type="number"
                  className="text-black border p-3 w-32 rounded-lg"
                  placeholder="Qty"
                  value={v.quantityVariant}
                  onChange={(e) => updateVariant(i, "quantityVariant", Number(e.target.value))}
                />
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition ml-2" type="button" onClick={() => removeVariant(i)}>Remove</button>
              </div>
            ))}

            <button type="button" className="text-green-500 font-semibold" onClick={addVariant}>Add Variant</button>
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
              <th className="p-4 text-left border-b border-indigo-200">Description</th>
              <th className="p-4 text-left border-b border-indigo-200">Quantity</th>
              <th className="p-4 text-left border-b border-indigo-200">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item) => (
              <React.Fragment key={item.itemId}>
                
                {/* Parent Row */}
                <tr
                  className="hover:bg-indigo-50 transition-colors cursor-pointer"
                  onClick={() => toggleExpand(item.itemId!)}
                >
                  <td className="font-bold text-black p-4 border-b border-gray-200">
                    {item.itemId}
                  </td>

                  <td className="font-bold text-black p-4 border-b border-gray-200">
                    {item.name}
                  </td>

                  <td className="font-bold text-black p-4 border-b border-gray-200">
                    {item.description.length > 50
                      ? item.description.substring(0, 50) + "..."
                      : item.description}
                  </td>

                  <td className="font-bold text-black p-4 border-b border-gray-200">
                    {item.quantity}
                  </td>

                  <td className="font-bold text-black p-4 border-b border-gray-200">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.itemId!);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdate(item);
                      }}
                    >
                      Update
                    </button>
                  </td>
                </tr>

                {/* Expandable Variants Section */}
                {expanded[item.itemId!] && (
                  <tr>
                    <td colSpan={5} className="ml-4 p-4 bg-indigo-200 border-b border-indigo-200">
                      
                      <div className="p-4 bg-white rounded-xl shadow-inner">
                        <h3 className="text-lg font-semibold text-indigo-700 mb-3">
                          Variants for {item.name}
                        </h3>

                        {/* Nested table */}
                        <table className="text-black w-full border border-gray-300 rounded-lg overflow-hidden">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="p-3 border-b text-left">Size</th>
                              <th className="p-3 border-b text-left">Color</th>
                              <th className="p-3 border-b text-left">Quantity</th>
                            </tr>
                          </thead>

                          <tbody>
                            {item.variants.length > 0 ? (
                              item.variants.map((v, id) => (
                                <tr key={id} className="hover:bg-gray-50">
                                  <td className="p-3 border-b">{v.size}</td>
                                  <td className="p-3 border-b">{v.color}</td>
                                  <td className="p-3 border-b">{v.quantityVariant}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={3}
                                  className="p-3 text-gray-500 text-center border-b"
                                >
                                  No variants available.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>

                      </div>

                    </td>
                  </tr>
                )}

              </React.Fragment>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>


        {/* Edit modal */}
        {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="text-black bg-white p-6 rounded-2xl shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Item</h3>

            <input
              className="w-full p-3 border rounded-lg mb-4"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
            />

            <input
              className="w-full p-3 border rounded-lg mb-4"
              value={editingDescription}
              onChange={(e) => setEditingDescription(e.target.value)}
            />

            {editingVariants.map((v, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <span className="w-16">{v.size}</span>
                <span className="w-16">{v.color}</span>
                <input
                  type="number"
                  className="border p-2 rounded w-20"
                  value={v.quantityVariant}
                  onChange={(e) => updateEditingVariant(i, "quantityVariant", Number(e.target.value))}
                />
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => removeEditingVariant(i)}
                >
                  Delete
                </button>
              </div>
            ))}

            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setEditingItem(null)}>Cancel</button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={saveEditingItem}>Save</button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
