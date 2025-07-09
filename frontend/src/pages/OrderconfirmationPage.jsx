import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { checkout } = useSelector((state) => state.checkout);

    // Clear the cart when the order is confirmed
    useEffect(() => {
        if (checkout && checkout._id) {
            dispatch(clearCart());
            localStorage.removeItem("cart");
        } else {
            navigate("/my-order");
        }
    }, [checkout, dispatch, navigate]);
    const calculateEstimatedDelivery = (createdAt) => {
        const orderDate = new Date(createdAt);
        orderDate.setDate(orderDate.getDate() + 10);
        return orderDate.toLocaleDateString();
    }
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
                Thank You for Your Order!
            </h1>

            {checkout && (
                <div className="p-6 rounded-lg border">
                    <div className="flex justify-between mb-10">
                        {/* Order ID and Date */}
                        <div>
                            <h2 className="text-xl font-semibold">
                                Order ID: {checkout._id}
                            </h2>
                            <p className="text-gray-500">
                                Order date:{" "}
                                {new Date(checkout.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        {/* Estimated Delivery */}
                        <div>
                            <p className="text-emerald-700 text-sm">
                                Estimated Delivery:{" "}
                                {calculateEstimatedDelivery(checkout.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="mb-10">
                        {checkout.checkoutItems.map((item) => (
                            <div
                                key={item.productId}
                                className="flex justify-between items-center mb-4"
                            >
                                {/* Image and product info */}
                                <div className="flex items-center">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-md mr-4"
                                    />
                                    <div className="text-left">
                                        <h4 className="text-md font-semibold">{item.name}</h4>
                                        <p className="text-sm text-gray-500">
                                            {item.color} | {item.size}
                                        </p>
                                    </div>
                                </div>

                                {/* Price and quantity */}
                                <div className="text-right">
                                    <p className="text-md">&#8377;{item.price}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* payments and delivery info */}
                    <div className="grid grid-cols-3 gap-8">
                        {/* payment info */}
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Payment</h4>
                            <p className="text-gray-600">PayPal</p>
                        </div>
                        {/* delivery info */}
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                            <p className="text-gray-600">{checkout.shippingAddress.address}</p>
                            <p className="text-gray-600">{checkout.shippingAddress.city},{checkout.shippingAddress.coutry}</p>
                        </div>
                    </div>
                    {/* </div> */}
                </div>
            )}
        </div>
    );
};

export default OrderConfirmationPage;
