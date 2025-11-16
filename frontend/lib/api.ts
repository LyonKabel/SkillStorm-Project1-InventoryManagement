import axios from "axios";
import { User } from "@/types/User";  // import the User type
import { Warehouse } from "@/types/Warehouse";  // import the Warehouse type

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
