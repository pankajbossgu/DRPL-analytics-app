# DRPL Delivery Analytics App

Production-ready starter for a delivery analytics platform with a React dashboard and Express REST API.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Recharts
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose schema placeholders
- **API:** REST

## Project Structure

```text
.
├── backend
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   └── orderController.js
│   ├── data/
│   │   └── mockOrders.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   └── Order.js
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   └── orderRoutes.js
│   └── services/
│       ├── analyticsService.js
│       └── orderService.js
├── frontend
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/api.js
│   └── ...vite/tailwind configs
└── package.json
```

## Quick Start

1. Install all dependencies:

```bash
npm install
npm run install:all
```

2. Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Run backend + frontend:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## API Endpoints

- `GET /api/orders` - list mock orders
- `POST /api/orders` - create a mock order
- `GET /api/analytics` - delivery analytics placeholders

## Notes

- Analytics and business rules are intentionally placeholder implementations for future expansion.
- MongoDB connection is optional during this phase; app runs with mock data if unavailable.
