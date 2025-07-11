// import React, { useState, useEffect } from 'react'
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { createCheckout } from '../../redux/slices/checkoutSlice';
// import axios from 'axios';

// const Checkout = ({ loading, error }) => {
//     const navigate = useNavigate();

//     const dispatch = useDispatch();
//     //   const navigate=useNavigate();
//     //   const location=useLocation();
//     const { user, guestId } = useSelector((state) => state.auth);
//     const { cart } = useSelector((state) => state.cart);
//     const [checkoutId, setCheckoutId] = useState(null);
//     const [shippingAddress, setShippingAddress] = useState({
//         firstName: "",
//         lastName: "",
//         address: "",
//         city: "",
//         postalCode: "",
//         country: "",
//         phone: "",
//     });

//     useEffect(() => {
//         if (!cart || !cart.products || cart.products.length === 0) {
//             navigate("/");
//         }
//     }, [cart, navigate]);

//     const handleCreateCheckout = async (e) => {
//         e.preventDefault();
//         if (cart && cart.products.length > 0) {
//             const res = await dispatch(
//                 createCheckout({
//                     checkoutItems: cart.products,
//                     shippingAddress,
//                     paymentMethod: "Razorpay",
//                     totalPrice: cart.totalPrice,
//                 })
//             );
//             console.log("res.payload:",res.payload);
//             if (res.payload && res.payload._id) {
//                 setCheckoutId(res.payload._id);
//             }
//         }
//     };

//     const handlePaymentSuccess = async (details) => {
//         try {
//             const response = await axios.put(
//                 `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
//                 {
//                     paymentStatus: "paid",
//                     paymentDetails: details,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//                     },
//                 }
//             );

//             await handleFinalizeCheckout(checkoutId); // Finalize checkout if payment is successful
//         } catch (error) {
//             console.error(error);
//         }

//         navigate("/order-confirmation");
//     };
//     const handleFinalizeCheckout = async (checkoutId) => {
//         try {
//             const response = await axios.post(
//                 `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
//                 {},
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//                     },
//                 }
//             );

//             navigate("/order-confirmation");
//         } catch (error) {
//             console.error();
//         }
//     };

//     if (loading) {
//         return <p>Loading cart ...</p>
//     }
//     if (error) {
//         return <p>Error:{error}</p>
//     }
//     if (!cart || !cart.products || cart.products.length === 0) {
//         return <p>Your cart is empty</p>
//     }
//     const handleRazorpayPayment = () => {
//         const options = {
//             key: "rzp_test_BApbvKTVX3ZVkN",
//             amount: cart.totalPrice * 100,
//             currency: "INR",
//             name: "Your Shop Name",
//             description: "Order Payment",
//             image: "https://your_logo_url.com/logo.png",
//             order_id: "",
//             handler: function (response) {
//                 alert("Payment Successful!");
//                 console.log(response);
//                 // ✅ This is the key fix
//                 handlePaymentSuccess(response); 
//             },
//             prefill: {
//                 name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
//                 email: "user@example.com",
//                 contact: shippingAddress.phone,
//             },
//             notes: {
//                 address: shippingAddress.address,
//             },
//             theme: {
//                 color: "#000000",
//             },
//         };

//         const rzp = new window.Razorpay(options);
//         rzp.open();
//     };

//     useEffect(() => {
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.async = true;
//         document.body.appendChild(script);
//     }, []);


//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
//             {/* Left Section */}
//             <div className="bg-white rounded-lg p-6">
//                 <h2 className="text-2xl uppercase mb-6">Checkout</h2>

//                 <form onSubmit={handleCreateCheckout}>
//                     <h3 className="text-lg mb-4">Contact Details</h3>
//                     <div className="mb-4">
//                         <label className="block text-gray-700">Email</label>
//                         <input
//                             type="email"
//                             value={user ? user.email : " "}
//                             className="w-full p-2 border rounded"
//                             disabled
//                         />
//                     </div>

//                     <h3 className="text-lg mb-4">Delivery</h3>
//                     <div className="mb-4 grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-gray-700">First Name</label>
//                             <input
//                                 type="text"
//                                 value={shippingAddress.firstName}
//                                 onChange={(e) =>
//                                     setShippingAddress({
//                                         ...shippingAddress,
//                                         firstName: e.target.value,
//                                     })
//                                 }
//                                 className="w-full p-2 border rounded"
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700">Last Name</label>
//                             <input
//                                 type="text"
//                                 value={shippingAddress.lastName}
//                                 onChange={(e) =>
//                                     setShippingAddress({
//                                         ...shippingAddress,
//                                         lastName: e.target.value,
//                                     })
//                                 }
//                                 className="w-full p-2 border rounded"
//                                 required
//                             />
//                         </div>

//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700">Address</label>
//                         <input
//                             type="text"
//                             value={shippingAddress.address}
//                             onChange={(e) =>
//                                 setShippingAddress({
//                                     ...shippingAddress,
//                                     address: e.target.value,
//                                 })
//                             }
//                             className="w-full p-2 border rounded"
//                             required
//                         />
//                     </div>
//                     <div className="mb-4 grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-gray-700">City</label>
//                             <input
//                                 type="text"
//                                 value={shippingAddress.city}
//                                 onChange={(e) =>
//                                     setShippingAddress({
//                                         ...shippingAddress,
//                                         city: e.target.value,
//                                     })
//                                 }
//                                 className="w-full p-2 border rounded"
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700">Postal Code</label>
//                             <input
//                                 type="text"
//                                 value={shippingAddress.postalCode}
//                                 onChange={(e) =>
//                                     setShippingAddress({
//                                         ...shippingAddress,
//                                         postalCode: e.target.value,
//                                     })
//                                 }
//                                 className="w-full p-2 border rounded"
//                                 required
//                             />
//                         </div>
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700">Country</label>
//                         <input
//                             type="text"
//                             value={shippingAddress.country}
//                             onChange={(e) =>
//                                 setShippingAddress({
//                                     ...shippingAddress,
//                                     country: e.target.value,
//                                 })
//                             }
//                             className="w-full p-2 border rounded"
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700">Phone</label>
//                         <input
//                             type="text"
//                             value={shippingAddress.phone}
//                             onChange={(e) =>
//                                 setShippingAddress({
//                                     ...shippingAddress,
//                                     phone: e.target.value,
//                                 })
//                             }
//                             className="w-full p-2 border rounded"
//                             required
//                         />
//                     </div>
//                     <div className="mt-6">
//                         <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
//                             <img src="https://cdn.razorpay.com/logo.svg" alt="Razorpay" className="w-6 h-6" />
//                             Secure Payment via Razorpay
//                         </h3>

//                         <button
//                             onClick={handleRazorpayPayment}
//                             className="w-full bg-[#2B84EA] text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-[#1A73E8] transition duration-200 flex justify-center items-center gap-2"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="white" className="h-5 w-5" viewBox="0 0 24 24">
//                                 <path d="M2 4.5A2.5 2.5 0 014.5 2h15a2.5 2.5 0 012.5 2.5v15a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 19.5v-15zM4.5 3A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3h-15zM6 8h12v1.5H6V8zm0 4h12v1.5H6V12zm0 4h8v1.5H6V16z" />
//                             </svg>
//                             Pay ₹{cart.totalPrice} Now
//                         </button>

//                         <p className="text-xs text-gray-500 mt-2 text-center">
//                             You’ll be redirected to Razorpay’s secure checkout page.
//                         </p>
//                     </div>

//                 </form>
//             </div>
//             <div className="bg-gray-50 p-6 rounded-lg">
//                 <h3 className="text-lg mb-4">Order Summary</h3>
//                 <div className="border-t py-4 mb-4">
//                     {cart.products.map((product, index) => (
//                         <div
//                             key={index}
//                             className="flex items-start justify-between py-2 border-b"
//                         >
//                             <div className="flex items-start">
//                                 <img
//                                     src={product.image}
//                                     alt={product.name}
//                                     className="w-20 h-24 object-cover mr-4"
//                                 />
//                                 <div>
//                                     <h3 className="text-md">{product.name}</h3>
//                                     <p className="text-gray-500">Size: {product.size}</p>
//                                     <p className="text-gray-500">Size: {product.color}</p>
//                                 </div>
//                             </div>
//                             <p className="text-xl">
//                                 ₹{product.price?.toLocaleString("en-IN")}
//                             </p>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="flex justify-between items-center text-lg mb-4">
//                     <p>Subtotal</p>
//                     <p>₹{cart.totalPrice?.toLocaleString("en-IN")}</p>
//                 </div>

//                 <div className="flex justify-between items-center text-lg">
//                     <p>Shipping</p>
//                     <p>Free</p>
//                 </div>

//                 <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
//                     <p>Total</p>
//                     <p>₹{cart.totalPrice?.toLocaleString("en-IN")}</p>
//                 </div>
//             </div>

//         </div>
//     );
// };

// export default Checkout;


import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createCheckout } from '../../redux/slices/checkoutSlice';
import axios from 'axios';

const Checkout = ({ loading, error }) => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    //   const navigate=useNavigate();
    //   const location=useLocation();
    const { user, guestId } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);
    const [checkoutId, setCheckoutId] = useState(null);
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
    });

    useEffect(() => {
        if (!cart || !cart.products || cart.products.length === 0) {
            navigate("/");
        }
    }, [cart, navigate]);

    const handleCreateCheckout = async () => {
        if (cart && cart.products.length > 0) {
            const res = await dispatch(
                createCheckout({
                    checkoutItems: cart.products,
                    shippingAddress,
                    paymentMethod: "Razorpay",
                    totalPrice: cart.totalPrice,
                })
            );

            if (res.payload && res.payload._id) {
                setCheckoutId(res.payload._id);
                // ✅ Trigger Razorpay after setting checkout ID
                handleRazorpayPayment(res.payload._id);
            }
        }
    };

    const handlePaymentSuccess = async (details, id) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${id}/pay`,
                {
                    paymentStatus: "paid",
                    paymentDetails: details,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );

            await handleFinalizeCheckout(id);
        } catch (error) {
            console.error(error);
        }

        navigate("/order-confirmation");
    };

    const handleFinalizeCheckout = async (checkoutId) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );

            navigate("/order-confirmation");
        } catch (error) {
            console.error();
        }
    };

    if (loading) {
        return <p>Loading cart ...</p>
    }
    if (error) {
        return <p>Error:{error}</p>
    }
    if (!cart || !cart.products || cart.products.length === 0) {
        return <p>Your cart is empty</p>
    }
    const handleRazorpayPayment = (checkoutId) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: cart.totalPrice * 100,
            currency: "INR",
            name: "Your Shop Name",
            description: "Order Payment",
            image: "https://your_logo_url.com/logo.png",
            order_id: "", // If you're generating orders on backend, add it here
            handler: function (response) {
                alert("Payment Successful!");
                handlePaymentSuccess(response, checkoutId);
            },
            prefill: {
                name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                email: "user@example.com",
                contact: shippingAddress.phone,
            },
            notes: {
                address: shippingAddress.address,
            },
            theme: {
                color: "#000000",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
            {/* Left Section */}
            <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl uppercase mb-6">Checkout</h2>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateCheckout();
                }}>
                    <h3 className="text-lg mb-4">Contact Details</h3>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={user ? user.email : " "}
                            className="w-full p-2 border rounded"
                            disabled
                        />
                    </div>

                    <h3 className="text-lg mb-4">Delivery</h3>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">First Name</label>
                            <input
                                type="text"
                                value={shippingAddress.firstName}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        firstName: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Last Name</label>
                            <input
                                type="text"
                                value={shippingAddress.lastName}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        lastName: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            value={shippingAddress.address}
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    address: e.target.value,
                                })
                            }
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">City</label>
                            <input
                                type="text"
                                value={shippingAddress.city}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        city: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Postal Code</label>
                            <input
                                type="text"
                                value={shippingAddress.postalCode}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        postalCode: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Country</label>
                        <input
                            type="text"
                            value={shippingAddress.country}
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    country: e.target.value,
                                })
                            }
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Phone</label>
                        <input
                            type="text"
                            value={shippingAddress.phone}
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    phone: e.target.value,
                                })
                            }
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <img src="https://cdn.razorpay.com/logo.svg" alt="Razorpay" className="w-6 h-6" />
                            Secure Payment via Razorpay
                        </h3>

                        <button
                            type='submit'
                            className="w-full bg-[#2B84EA] text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-[#1A73E8] transition duration-200 flex justify-center items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="white" className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M2 4.5A2.5 2.5 0 014.5 2h15a2.5 2.5 0 012.5 2.5v15a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 19.5v-15zM4.5 3A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3h-15zM6 8h12v1.5H6V8zm0 4h12v1.5H6V12zm0 4h8v1.5H6V16z" />
                            </svg>
                            Pay ₹{cart.totalPrice} Now
                        </button>

                        <p className="text-xs text-gray-500 mt-2 text-center">
                            You’ll be redirected to Razorpay’s secure checkout page.
                        </p>
                    </div>

                </form>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg mb-4">Order Summary</h3>
                <div className="border-t py-4 mb-4">
                    {cart.products.map((product, index) => (
                        <div
                            key={index}
                            className="flex items-start justify-between py-2 border-b"
                        >
                            <div className="flex items-start">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-20 h-24 object-cover mr-4"
                                />
                                <div>
                                    <h3 className="text-md">{product.name}</h3>
                                    <p className="text-gray-500">Size: {product.size}</p>
                                    <p className="text-gray-500">Size: {product.color}</p>
                                </div>
                            </div>
                            <p className="text-xl">
                                ₹{product.price?.toLocaleString("en-IN")}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center text-lg mb-4">
                    <p>Subtotal</p>
                    <p>₹{cart.totalPrice?.toLocaleString("en-IN")}</p>
                </div>

                <div className="flex justify-between items-center text-lg">
                    <p>Shipping</p>
                    <p>Free</p>
                </div>

                <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
                    <p>Total</p>
                    <p>₹{cart.totalPrice?.toLocaleString("en-IN")}</p>
                </div>
            </div>

        </div>
    );
};

export default Checkout;