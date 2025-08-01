// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Link } from "react-router-dom";

// const OrderDetailsPage = () => {
//   const { id } = useParams();
//   const [orderDetails, setOrderDetails] = useState(null);

//   useEffect(() => {
//     const mockOrderDetails = {
//       _id: id,
//       createdAt: new Date(),
//       isPaid: true,
//       isDelivered: false,
//       paymentMethod: "PayPal",
//       shippingMethod: "Standard",
//       shippingAddress: {
//         city: "Hyderabad",
//         country: "India",
//       },
//       orderItems: [
//         {
//           productId: 1,
//           name: "T-shirt",
//           quantity: "1",
//           price: "150",
//           image: "http://picsum.photos/200?random=1",
//         },
//         {
//           productId: 2,
//           name: "T-shirt",
//           // size:"M",
//           // color:"Red",
//           quantity: "1",
//           price: "200",
//           image: "http://picsum.photos/200?random=2",
//         },
//       ]
//     };

//     setOrderDetails(mockOrderDetails);
//   }, [id]);

//   return (
//     <div className="max-w-7xl mx-auto p-4 sm:p-6">
//       <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>
//       {!orderDetails ? (
//         <p>No Order details found</p>
//       ) : (
//         <div className="p-4 sm:p-6 rounded-lg border">
//           {/* Order Info */}
//           <div className="flex flex-col sm:flex-row justify-between mb-8">
//             <div>
//               <h3 className="text-lg md:text-xl font-semibold">
//                 Order ID: #{orderDetails._id}
//               </h3>
//               <p className="text-gray-600">
//                 {new Date(orderDetails.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//             <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
//               <span
//                 className={`${orderDetails.isPaid
//                     ? "bg-green-100 text-green-700"
//                     : "bg-red-100 text-red-700"
//                   } px-3 py-1 rounded-full text-sm font-medium mb-2`}
//               >
//                 {orderDetails.isPaid ? "Approved" : "Pending"}
//               </span>
//               <span
//                 className={`${orderDetails.isDelivered
//                     ? "bg-green-100 text-green-700"
//                     : "bg-yellow-100 text-yellow-700"
//                   } px-3 py-1 rounded-full text-sm font-medium mb-2`}
//               >
//                 {orderDetails.isDelivered ? "Delivered" : "Pending"}
//               </span>
//             </div>
//           </div>

//           {/* Customer, Payment, Shipping Info */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
//             <div>
//               <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
//               <p>Payment Method: {orderDetails.paymentMethod}</p>
//               <p>Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
//             </div>
//             <div>
//               <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
//               <p>Shipping Method: {orderDetails.shippingMethod}</p>
//               <p>
//                 Address:{" "}
//                 {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}
//               </p>
//             </div>
//           </div>
//           {/* Product list */}
//         <div className="overflow-x-auto">
//           <h4 className="text-lg font-semibold mb-4">Products</h4>
//           <table className="min-w-full text-gray-600 mb-4">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="py-2 px-4">Name</th>
//                 <th className="py-2 px-4">Unit Price</th>
//                 <th className="py-2 px-4">Quantity</th>
//                 <th className="py-2 px-4">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orderDetails.orderItems.map((item) => (
//                 <tr key={item.productId} className="border-b">
//                   <td className="py-2 px-4 flex items-center">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-12 h-12 object-cover rounded-lg mr-4"
//                     />
//                     <Link
//                       to={`/product/${item.productId}`}
//                       className="text-blue-500 hover:underline"
//                     >
//                       {item.name}
//                     </Link>
//                   </td>
//                   <td className="py-2 px-4">${item.price}</td>
//                   <td className="py-2 px-4">{item.quantity}</td>
//                   <td className="py-2 px-4">
//                     ${item.price * item.quantity}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {/* Back to Orders button */}
//         <div className="mt-4">
//           <Link
//             to="/my-orders"
//             className="text-blue-500 hover:underline"
//           >
//             Back to My Orders
//           </Link>
//         </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderDetailsPage;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchOrderDetails } from "../redux/slices/orderSlice";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>

      {!orderDetails ? (
        <p>No Order details found</p>
      ) : (
        <div className="p-4 sm:p-6 rounded-lg border bg-white">
          {/* Order Info */}
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                Order ID: #{orderDetails._id}
              </h3>
              <p className="text-gray-600">
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0 gap-1">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium 
                  ${orderDetails.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}
              >
                {orderDetails.isPaid ? "Payment: Approved" : "Payment: Pending"}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium 
                  ${orderDetails.isDelivered
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {orderDetails.isDelivered
                  ? "Delivery: Completed"
                  : "Delivery: Pending"}
              </span>
            </div>
          </div>

          {/* Payment & Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
              <p>Payment Method: {orderDetails.paymentMethod}</p>
              <p>Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
              <p>Shipping Method: {orderDetails.shippingMethod}</p>
              <p>
                Address:{" "}
                {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}
              </p>
            </div>
          </div>

          {/* Product List */}
          <div className="w-full">
            <h4 className="text-lg font-semibold mb-4">Products</h4>

            {/* Table for desktop */}
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full table-fixed text-gray-700 table-auto border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left w-1/4">Name</th>
                    {/* <th className="py-2 px-4 text-left">Size</th> */}
                    <th className="py-2 px-4 text-right w-1/4">Unit Price</th>
                    <th className="py-2 px-4 text-right w-1/4">Quantity</th>
                    <th className="py-2 px-4 text-right w-1/4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.orderItems.map((item) => (
                    <tr key={item.productId} className="border-b">
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <Link
                            to={`/product/${item.productId}`}
                            className="text-blue-500 hover:underline"
                          >
                            {item.name}
                          </Link>
                        </div>
                      </td>
                      {/* <td className="py-2 px-4 text-left">{item.size || "-"}</td> */}
                      <td className="py-2 px-4 text-right">&#8377;{item.price}</td>
                      <td className="py-2 px-4 text-right">{item.quantity}</td>
                      <td className="py-2 px-4 text-right">
                        &#8377;{item.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card layout for mobile */}
            <div className="md:hidden space-y-4">
              {orderDetails.orderItems.map((item) => (
                <div key={item.productId} className="border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-4 mb-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-blue-500 font-medium hover:underline"
                      >
                        {item.name}
                      </Link>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    {/* <p><span className="font-medium">Size:</span> {item.size || "-"}</p> */}
                    <p><span className="font-medium">Unit Price:</span> &#8377;{item.price}</p>
                    <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                    <p><span className="font-medium">Total:</span> &#8377;{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>



          {/* Back to Orders */}
          <div className="mt-4">
            <Link to="/my-orders" className="text-blue-500 hover:underline">
              Back to My Orders
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
