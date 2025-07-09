const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products");
dotenv.config();

//connect to mongodb
mongoose.connect(process.env.MONGO_URI);

//fucntion to seed the data;
const seedData = async () => {
    try {
        //clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();


        //create a default admin user
        const createdUser = await User.create({
            "name": "admin user",
            "email": "admin@example.com",
            "password": "1234567",
            "role": "admin",
        });
        //Assign the default user id to each product
        const userId=createdUser._id;
        const sampleProducts=products.map((product)=>{
           return {...product,user:userId};
        });
        //Insert the products in the database
        await Product.insertMany(sampleProducts);
        console.log("product data seeded successfully");
        process.exit();
    } catch (error) {
        console.error("Error seeding the data",error);
       process.exit(1);
    }
}
seedData();
