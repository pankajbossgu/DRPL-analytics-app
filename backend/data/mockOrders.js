const mockOrders = [
  {
    id: "ORD-1001",
    status: "Delivered",
    deliveryTime: 42,
    location: "New York, NY",
    createdAt: "2026-04-12T10:00:00.000Z",
  },
  {
    id: "ORD-1002",
    status: "Pending",
    deliveryTime: 0,
    location: "San Francisco, CA",
    createdAt: "2026-04-13T11:30:00.000Z",
  },
  {
    id: "ORD-1003",
    status: "In Transit",
    deliveryTime: 28,
    location: "Austin, TX",
    createdAt: "2026-04-14T08:15:00.000Z",
  },
  {
    id: "ORD-1004",
    status: "Delivered",
    deliveryTime: 37,
    location: "Chicago, IL",
    createdAt: "2026-04-15T16:45:00.000Z",
  },
];

module.exports = mockOrders;
