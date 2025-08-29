// src/resolvers.ts
import {
  products as initialProducts,
  warehouses as initialWarehouses,
  cloneProducts,
} from "./data.js";
import { v4 as uuidv4 } from "uuid";

let products = cloneProducts(); // mutable in-memory copy

function computeStatus(p: { stock: number; demand: number }) {
  if (p.stock > p.demand) return "Healthy";
  if (p.stock === p.demand) return "Low";
  return "Critical";
}

export const resolvers = {
  Query: {
    products: (
      _: any,
      args: { search?: string; status?: string; warehouse?: string }
    ) => {
      let result = products;

      if (args.search) {
        const term = args.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.sku.toLowerCase().includes(term) ||
            p.id.toLowerCase().includes(term)
        );
      }

      if (args.warehouse) {
        result = result.filter((p) => p.warehouse === args.warehouse);
      }

      if (args.status && args.status !== "All") {
        result = result.filter((p) => {
          const s = computeStatus(p);
          return s === args.status;
        });
      }

      return result;
    },

    warehouses: () => initialWarehouses,

    kpis: (_: any, { range }: { range?: string }) => {
      // Produce mock trend data. range can be "7d" | "14d" | "30d".
      const days = range === "14d" ? 14 : range === "30d" ? 30 : 7;
      // sum current totals to create a plausible baseline
      const totalStock = products.reduce((s, p) => s + p.stock, 0);
      const totalDemand = products.reduce((s, p) => s + p.demand, 0);

      const res = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const iso = date.toISOString().slice(0, 10);
        // create gentle variation around baseline
        const stock = Math.max(
          0,
          Math.round(totalStock * (0.9 + Math.random() * 0.2))
        );
        const demand = Math.max(
          1,
          Math.round(totalDemand * (0.9 + Math.random() * 0.2))
        );
        res.push({ date: iso, stock, demand });
      }
      return res;
    },
  },

  Mutation: {
    updateDemand: (_: any, { id, demand }: { id: string; demand: number }) => {
      const p = products.find((x) => x.id === id);
      if (!p) throw new Error("Product not found");
      p.demand = demand;
      return p;
    },

    transferStock: (
      _: any,
      {
        id,
        from,
        to,
        qty,
      }: { id: string; from: string; to: string; qty: number }
    ) => {
      if (qty <= 0) throw new Error("qty must be > 0");
      // find source product by id and warehouse matching 'from'
      const source = products.find((x) => x.id === id && x.warehouse === from);
      if (!source)
        throw new Error("Source product not found for given id/from");

      if (source.stock < qty) throw new Error("Insufficient stock in source");

      // deduct from source
      source.stock -= qty;

      // try find target product by same SKU and warehouse === to
      const target = products.find(
        (x) => x.sku === source.sku && x.warehouse === to
      );
      if (target) {
        target.stock += qty;
      } else {
        // create a new product entry in that warehouse (new id)
        const newProd = {
          id: `P-${uuidv4().slice(0, 8)}`,
          name: source.name,
          sku: source.sku,
          warehouse: to,
          stock: qty,
          demand: 0,
        };
        (products as any).push(newProd);
      }

      return source;
    },
  },
};
