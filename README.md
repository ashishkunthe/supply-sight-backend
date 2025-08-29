SupplySight Backend (GraphQL Server)

This is the "GraphQL backend" for the SupplySight Dashboard.
It runs on "Node.js with Apollo Server" and serves dummy inventory data.

Features

- GraphQL API with schema & resolvers
- Dummy data for products, warehouses, and KPIs
- Supports queries & mutations:

  - "Products Query" with optional filters (search, warehouse)
  - "Warehouses Query"
  - "KPIs Query" (date range)
  - "Mutations": Update demand & transfer stock

Tech Stack

- Node.js
- Apollo Server (GraphQL)

Setup & Run (Backend)

1.  Clone Repo

```bash
git clone https://github.com/your-username/supply-sight-backend.git
cd supply-sight-backend
```

2.  Install Dependencies

```bash
npm install
```

3.  Start Server

```bash
npm start
```

- Server runs at:

  http://localhost:4000/graphql

Example Queries

Products Query

```graphql
query {
  products {
    id
    name
    sku
    warehouse
    stock
    demand
  }
}
```

Filtered Products

```graphql
query {
  products(search: "hex", warehouse: "BLR-A") {
    id
    name
    sku
    warehouse
    stock
    demand
  }
}
```

Warehouses Query

```graphql
query {
  warehouses {
    code
    name
    city
    country
  }
}
```

KPIs Query

```graphql
query {
  kpis(range: "7d") {
    date
    stock
    demand
  }
}
```

Transfer Stock Mutation

```graphql
mutation {
  transferStock(id: "P-1001", from: "BLR-A", to: "DEL-B", qty: 10) {
    id
    name
    sku
    warehouse
    stock
    demand
  }
}
```

Notes

- This backend uses "mock data only" for testing.
- Extend resolvers & schema if you want persistence (e.g., with MongoDB or Postgres).
- Designed to pair with the [SupplySight Frontend](https://github.com/ashishkunthe/supply-sight).
