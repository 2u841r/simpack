"use client";
import React from "react";

const AdminOrders = ({ orders, handleCancelOrder, handleCompleteOrder }) => {
  console.log(orders);
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Orders
        </h2>

        {orders.length > 0 ? (
          <ul className="space-y-6">
            {orders
              .sort(
                (a, b) =>
                  new Date(b.order_time).getTime() -
                  new Date(a.order_time).getTime()
              ) // Sort by order_time in descending order
              .map((order) => {
                const orderDate = new Date(order.order_time);

                // Adjust for GMT+6
                orderDate.setHours(orderDate.getHours() + 6);

                // Manually format the date as dd-mm-yyyy hh:mm:ss
                const formattedDate = `${String(orderDate.getDate()).padStart(2, "0")}-${String(orderDate.getMonth() + 1).padStart(2, "0")}-${orderDate.getFullYear()} ${String(orderDate.getHours()).padStart(2, "0")}:${String(orderDate.getMinutes()).padStart(2, "0")}:${String(orderDate.getSeconds()).padStart(2, "0")}`;

                return (
                  <li
                    key={order.id}
                    className={`p-6 rounded-lg shadow-lg ${
                      order.cancelled
                        ? "bg-red-100 border-red-500" // If cancelled, apply red styles
                        : order.completed
                          ? "bg-green-100 border-green-500" // If completed but not cancelled, apply green styles
                          : "bg-blue-100 border-blue-500" // If neither cancelled nor completed, apply blue styles (pending)
                    } border-2`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div className="mb-4 sm:mb-0">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {order.packages.operator} {order.packages.gb}GB +{" "}
                          {order.packages.minutes}
                          Minutes - {order.packages.price} TK
                        </h3>

                        <p className="text-gray-600">
                          Mobile: {order.mobile_number}
                        </p>
                        <p className="text-xs text-gray-500">
                          Payment:
                          {order.payment_method} Transaction ID:{" "}
                          {order.transaction_id}
                        </p>
                        <p className="text-xs text-gray-500">
                          {/* Displaying order time in dd-mm-yyyy hh:mm:ss format */}
                          Order Time: {formattedDate}
                        </p>
                      </div>

                      {!order.completed && !order.cancelled && (
                        <div>
                          <button
                            onClick={() => handleCompleteOrder(order.id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                          >
                            X
                          </button>
                        </div>
                      )}

                      {order.completed && (
                        <span className="text-green-700 font-bold">
                          Completed
                        </span>
                      )}
                      {order.cancelled && (
                        <span className="text-red-700 font-bold">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
