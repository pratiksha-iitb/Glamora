// this file is entry point to the express application
const express=require("express");
const cors=require("cors");
// use dotenv library to load the value of port from env file
const dotenv=require("dotenv")
const connectDB=require("./config/db")
const userRoutes=require("./routes/userRoutes");
const ProductRoutes=require("./routes/ProductRoutes");
const CartRoutes=require("./routes/cartRoutes");
const CheckoutRoutes=require("./routes/CheckoutRoutes");
const orderRoutes=require("./routes/orderRoutes");
const uploadRoutes=require("./routes/uploadRoutes");
const subscriberRoutes=require("./routes/subscriberRoutes");
const adminRoutes=require("./routes/adminRoutes");
const ProductAdminRoutes=require("./routes/ProductAdminRoutes");
const adminOrderRoutes=require("./routes/adminOrderRoutes");

// initialise express application
const app=express(); 
// ensure that server is able to work with the json data
app.use(express.json());
// to communicate with the react server lets enable cross origin request
app.use(cors());

// to load the enviornment varables we have to call the config function
dotenv.config()
console.log(process.env.PORT)
const PORT=process.env.PORT||3000;

// connect to the mongoDB
connectDB();
app.get("/",(req,res)=>{
    res.send("Welcome to glamora")
});

// API Routes
app.use("/api/users",userRoutes)
app.use("/api/products",ProductRoutes)
app.use("/api/cart",CartRoutes)
app.use("/api/checkout",CheckoutRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/upload",uploadRoutes)
app.use("/api",subscriberRoutes)

//admin
app.use("/api/admin/users",adminRoutes);
app.use("/api/admin/products",ProductAdminRoutes);
app.use("/api/admin/orders",adminOrderRoutes);

app.listen(PORT,()=>{
   console.log(`server is running on http://localhost:${PORT}`)
})