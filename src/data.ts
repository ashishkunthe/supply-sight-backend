// src/data.ts
export type Product = {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
};

export type Warehouse = {
  code: string;
  name: string;
  city: string;
  country: string;
};

export const products: Product[] = [
  {
    id: "P-1001",
    name: "12mm Hex Bolt",
    sku: "HEX-12-100",
    warehouse: "BLR-A",
    stock: 180,
    demand: 120,
  },
  {
    id: "P-1002",
    name: "Steel Washer",
    sku: "WSR-08-500",
    warehouse: "BLR-A",
    stock: 50,
    demand: 80,
  },
  {
    id: "P-1003",
    name: "M8 Nut",
    sku: "NUT-08-200",
    warehouse: "PNQ-C",
    stock: 80,
    demand: 80,
  },
  {
    id: "P-1004",
    name: "Bearing 608ZZ",
    sku: "BRG-608-50",
    warehouse: "DEL-B",
    stock: 24,
    demand: 120,
  },
];

export const warehouses: Warehouse[] = [
  {
    code: "BLR-A",
    name: "Bangalore Warehouse A",
    city: "Bangalore",
    country: "India",
  },
  { code: "PNQ-C", name: "Pune Warehouse C", city: "Pune", country: "India" },
  { code: "DEL-B", name: "Delhi Warehouse B", city: "Delhi", country: "India" },
];

// utility to clone product list for in-memory mutation safety
export const cloneProducts = () => products.map((p) => ({ ...p }));
