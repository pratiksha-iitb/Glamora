

import React from 'react';
import { Link } from 'react-router-dom';

const Adminhome = () => {
  const orders = [
    {
      _id: 123422,
      user: { name: 'pratiksha' },
      totalPrice: 110,
      status: 'Processing',
    },
    {
      _id: 123423,
      user: { name: 'pratiksha' },
      totalPrice: 120,
      status: 'Shipped',
    },
    {
      _id: 123424,
      user: { name: 'pratiksha' },
      totalPrice: 130,
      status: 'Delivered',
    },
    {
      _id: 123425,
      user: { name: 'pratiksha' },
      totalPrice: 140,
      status: 'Cancelled',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Revenue</h2>
          <p className="text-2xl">$10000</p>
        </div>

        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl">200</p>
          <Link to="/admin/orders" className="text-blue-500 hover:underline">Manage Orders</Link>
        </div>

        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-2xl">100</p>
          <Link to="/admin/products" className="text-blue-500 hover:underline">Manage Products</Link>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>

        {/* Table view for larger screens */}
        <div className="hidden sm:block">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{order.user.name}</td>
                    <td className="p-4">${order.totalPrice}</td>
                    <td className="p-4">{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card view for mobile */}
        <div className="block sm:hidden space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="border rounded-lg p-4 shadow-sm hover:bg-gray-50 transition"
              >
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Order ID:</span>
                  <span>{order._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">User:</span>
                  <span>{order.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Total Price:</span>
                  <span>${order.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Status:</span>
                  <span>{order.status}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No recent orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Adminhome;

