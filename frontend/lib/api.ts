import axios from "axios";
import { User } from "@/types/User";  // imports the User type
import { Warehouse } from "@/types/Warehouse";  // imports the Warehouse type
import { Item } from "@/types/Item"; // imports the Item type

// URL for [ USER ] API endpoints
const USERS_URL = "http://localhost:8080/users";

// Get all users
export const getUsers = async (): Promise<User[]> => {
    const res = await axios.get(USERS_URL);
    return res.data;
};

// Create a new user
export const createUser = async (user: User): Promise<User> => {
    const res = await axios.post(USERS_URL, user);
    return res.data;
};


// URL for [ WAREHOUSE ] API endpoints
const WAREHOUSE_URL = "http://localhost:8080/warehouses";


// Get all warehouses
export const getWarehouses = async (): Promise<Warehouse[]> => {
    const res = await axios.get(WAREHOUSE_URL);
    return res.data;
};

// Get a single warehouse by ID
export const getWarehouseById = async (warehouseId: number): Promise<Warehouse> => {
    const res = await axios.get(`${WAREHOUSE_URL}/${warehouseId}`);
    return res.data;
};

// Create a new warehouse
export const createWarehouse = async (warehouse: Warehouse): Promise<Warehouse> => {
    const res = await axios.post(WAREHOUSE_URL, warehouse);
    return res.data; 
};

// Update an existing warehouse
export const updateWarehouse = async (warehouse: Warehouse): Promise<Warehouse> => {
    const res = await axios.put(`${WAREHOUSE_URL}/${warehouse.warehouseId}`, warehouse);
    return res.data;
};

// Delete a warehouse by ID
export const deleteWarehouse = async (warehouseId: number): Promise<void> => {
    await axios.delete(`${WAREHOUSE_URL}/${warehouseId}`);
};

const ITEMS_URL = "http://localhost:8080/warehouses"; // Same but to keep it consistent whatever

// Get items in a warehouse
export const getItems = async (warehouseId: number): Promise<Item[]> => {
    const res = await axios.get(`${ITEMS_URL}/${warehouseId}/items`);
    return res.data;
};

// Create item
export const createItem = async (warehouseId: number, item: Item): Promise<Item> => {
    const res = await axios.post(`${ITEMS_URL}/${warehouseId}/items`, item);
    return res.data;
};

// Update item
export const updateItem = async (warehouseId: number, item: Item): Promise<Item> => {
    const res = await axios.put(`${ITEMS_URL}/${warehouseId}/items/${item.itemId}`, item);
    return res.data;
};

// Delete item
export const deleteItem = async (warehouseId: number, itemId: number): Promise<void> => {
        await axios.delete(`${ITEMS_URL}/${warehouseId}/items/${itemId}`);
};
