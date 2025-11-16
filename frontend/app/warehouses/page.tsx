"use client";

import { useEffect, useState } from "react";
import {
    deleteWarehouse,
    getWarehouses,
    createWarehouse,
    updateWarehouse,
} from "@/lib/api";
import { Warehouse } from "@/types/Warehouse";

export default function WarehousesPage() {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

    // DELETE
    const [deleteTarget, setDeleteTarget] = useState<Warehouse | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // UPDATE
    const [updateTarget, setUpdateTarget] = useState<Warehouse | null>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    // CREATE
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newWarehouse, setNewWarehouse] = useState({
        name: "",
        location: "",
        maximumCapacity: 0,
    });

    // Shared validation errors
    const [errors, setErrors] = useState({
        name: "",
        location: "",
        maximumCapacity: "",
    });

    useEffect(() => {
        const fetchWarehouses = async () => {
            const data = await getWarehouses();
            setWarehouses(data);
        };
        fetchWarehouses();
    }, []);

    // ----------------------- VALIDATION -----------------------
    const validate = (data: any) => {
        let valid = true;
        const newErrors = { name: "", location: "", maximumCapacity: "" };

        if (!data.name.trim()) {
            newErrors.name = "Name is required.";
            valid = false;
        }

        if (!data.location.trim()) {
            newErrors.location = "Location is required.";
            valid = false;
        }

        if (!data.maximumCapacity || isNaN(data.maximumCapacity) || data.maximumCapacity <= 0) {
            newErrors.maximumCapacity = "Max capacity must be a number greater than 0.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // ----------------------- CREATE SUBMIT -----------------------
    const handleCreateSubmit = async () => {
        if (
            !validate({
                name: newWarehouse.name,
                location: newWarehouse.location,
                maximumCapacity: newWarehouse.maximumCapacity,
            })
        )
            return;

        const created = await createWarehouse({
            name: newWarehouse.name,
            location: newWarehouse.location,
            maximumCapacity: newWarehouse.maximumCapacity,
        });

        setWarehouses([...warehouses, created]);

        setShowCreateModal(false);
        setNewWarehouse({ name: "", location: "", maximumCapacity: 0 });
        setErrors({ name: "", location: "", maximumCapacity: "" });
    };

    // ----------------------- UPDATE SUBMIT -----------------------
    const handleUpdateSubmit = async () => {
        if (!updateTarget) return;

        if (!validate(updateTarget)) return;

        const updated = await updateWarehouse(
            updateTarget
        );

        setWarehouses(
            warehouses.map((w) =>
                w.warehouseId === updated.warehouseId ? updated : w
            )
        );

        setShowUpdateModal(false);
        setUpdateTarget(null);
        setErrors({ name: "", location: "", maximumCapacity: "" });
    };

    // ----------------------- DELETE SUBMIT -----------------------
    const handleDelete = async () => {
        if (!deleteTarget || deleteTarget.warehouseId === undefined) return;

        await deleteWarehouse(deleteTarget.warehouseId);

        setWarehouses(
            warehouses.filter((w) => w.warehouseId !== deleteTarget.warehouseId)
        );

        setDeleteTarget(null);
        setShowDeleteModal(false);
    };

    return (
        <div className="p-6">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Warehouses</h1>

                <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => setShowCreateModal(true)}
                >
                    Create Warehouse
                </button>
            </div>

            {/* WAREHOUSE GRID */}
            {warehouses.length === 0 ? (
                <p className="text-gray-600">No warehouses found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {warehouses.map((warehouse) => (
                        <div
                            key={warehouse.warehouseId}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition cursor-pointer"
                        >
                            <h2 className="text-xl font-semibold text-indigo-600 mb-2">
                                {warehouse.name}
                            </h2>
                            <p className="text-gray-600 mb-1">
                                <span className="font-medium">Location:</span>{" "}
                                {warehouse.location}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Max Capacity:</span>{" "}
                                {warehouse.maximumCapacity}
                            </p>

                            <div className="flex gap-2 mt-4">
                                <button
                                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                    onClick={() => {
                                        setUpdateTarget(warehouse);
                                        setShowUpdateModal(true);
                                        setErrors({ name: "", location: "", maximumCapacity: "" });
                                    }}
                                >
                                    Update
                                </button>

                                <button
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={() => {
                                        setDeleteTarget(warehouse);
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ----------------------- CREATE MODAL ----------------------- */}
            {showCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4 text-black">
                            Create Warehouse
                        </h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleCreateSubmit();
                            }}
                            className="space-y-4"
                        >
                            {/* NAME */}
                            <div>
                                <input
                                    className="text-black w-full p-2 border rounded"
                                    type="text"
                                    placeholder="Name"
                                    value={newWarehouse.name}
                                    onChange={(e) =>
                                        setNewWarehouse({
                                            ...newWarehouse,
                                            name: e.target.value,
                                        })
                                    }
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name}</p>
                                )}
                            </div>

                            {/* LOCATION */}
                            <div>
                                <input
                                    className="text-black w-full p-2 border rounded"
                                    type="text"
                                    placeholder="Location"
                                    value={newWarehouse.location}
                                    onChange={(e) =>
                                        setNewWarehouse({
                                            ...newWarehouse,
                                            location: e.target.value,
                                        })
                                    }
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-sm">{errors.location}</p>
                                )}
                            </div>

                            {/* MAX CAPACITY */}
                            <div>
                                <input
                                    className="text-black w-full p-2 border rounded"
                                    type="number"
                                    placeholder="Max Capacity"
                                    value={newWarehouse.maximumCapacity}
                                    onChange={(e) =>
                                        setNewWarehouse({
                                            ...newWarehouse,
                                            maximumCapacity: Number(e.target.value),
                                        })
                                    }
                                />
                                {errors.maximumCapacity && (
                                    <p className="text-red-500 text-sm">
                                        {errors.maximumCapacity}
                                    </p>
                                )}
                            </div>

                            {/* BUTTONS */}
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setNewWarehouse({
                                            name: "",
                                            location: "",
                                            maximumCapacity: 0,
                                        });
                                        setErrors({
                                            name: "",
                                            location: "",
                                            maximumCapacity: "",
                                        });
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    type="submit"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ----------------------- UPDATE MODAL ----------------------- */}
            {showUpdateModal && updateTarget && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4 text-black">
                            Update Warehouse
                        </h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateSubmit();
                            }}
                            className="space-y-4"
                        >
                            {/* NAME */}
                            <div>
                                <input
                                    className="text-black w-full p-2 border rounded"
                                    type="text"
                                    placeholder="Name"
                                    value={updateTarget?.name ?? ""}
                                    onChange={(e) =>
                                        setUpdateTarget({
                                            ...updateTarget,
                                            name: e.target.value,
                                        })
                                    }
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name}</p>
                                )}
                            </div>

                            {/* LOCATION */}
                            <div>
                                <input
                                    className="text-black w-full p-2 border rounded"
                                    type="text"
                                    placeholder="Location"
                                    value={updateTarget?.location ?? ""}
                                    onChange={(e) =>
                                        setUpdateTarget({
                                            ...updateTarget,
                                            location: e.target.value,
                                        })
                                    }
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-sm">{errors.location}</p>
                                )}
                            </div>

                            {/* MAX CAPACITY */}
                            <div>
                                <input
                                    className="text-black w-full p-2 border rounded"
                                    type="number"
                                    placeholder="Max Capacity"
                                    value={updateTarget?.maximumCapacity?.toString() ?? ""}
                                    onChange={(e) =>
                                        setUpdateTarget({
                                            ...updateTarget,
                                            maximumCapacity: Number(e.target.value)
                                        })
                                    }
                                />
                                {errors.maximumCapacity && (
                                    <p className="text-red-500 text-sm">
                                        {errors.maximumCapacity}
                                    </p>
                                )}
                            </div>

                            {/* BUTTONS */}
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    type="button"
                                    onClick={() => {
                                        setShowUpdateModal(false);
                                        setUpdateTarget(null);
                                        setErrors({
                                            name: "",
                                            location: "",
                                            maximumCapacity: "",
                                        });
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    type="submit"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ----------------------- DELETE MODAL ----------------------- */}
            {showDeleteModal && deleteTarget && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4 text-black">
                            Confirm Delete
                        </h2>
                        <p className="mb-6 text-black">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold">
                                {deleteTarget.name}
                            </span>
                            ?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteTarget(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={handleDelete}
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
