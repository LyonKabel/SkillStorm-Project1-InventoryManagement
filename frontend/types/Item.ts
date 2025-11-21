import { Variant } from "./Variant";

export interface Item {
    itemId?: number;
    name: string;
    quantity: number;
    description: string;
    variants: Variant[];
}
