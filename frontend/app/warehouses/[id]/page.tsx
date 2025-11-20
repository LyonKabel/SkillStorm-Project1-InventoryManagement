"use client";

import { useParams } from "next/navigation";
import WarehouseItemsClient from "./WarehouseItemsClient";

export default function WarehouseItemsPage() {
    const params = useParams();
    const warehouseId = Number(params?.id);

    if (!warehouseId) return <p>Invalid warehouse ID</p>;

    return <WarehouseItemsClient warehouseId={warehouseId} />;
}
