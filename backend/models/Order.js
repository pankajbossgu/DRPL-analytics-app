const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Delivered", "Pending", "In Transit", "Cancelled"],
      required: true,
      default: "Pending",
    },
    deliveryTime: {
      type: Number,
      required: true,
      default: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Order", orderSchema);
