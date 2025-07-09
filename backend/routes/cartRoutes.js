const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
//helper function to get a cart by user id or guest id
const getCart = async (userId, guestId) => {
    if (userId) {
        return Cart.findOne({ user: userId });
    } else if (guestId) {
        return Cart.findOne({ guestId });
    }
    return null;
}

// @route   POST /api/cart
// @desc    add a product to the cart for a guest or logged in user
// @access  Public

router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "product not found" });
        }
        //determine if the user is logged in or guest
        let cart = await getCart(userId, guestId);
        //if cart exist we need to update it
        if (cart) {
            const productIndex = cart.products.findIndex((p) =>
                p.productId.toString() === productId && p.size === size && p.color === color
            );

            if (productIndex > -1) {
                // ✅ Safe quantity update
                const currentQty = Number(cart.products[productIndex].quantity);
                const newQty = Number(quantity);

                if (isNaN(currentQty) || isNaN(newQty)) {
                    return res.status(400).json({ message: "Invalid quantity" });
                }

                cart.products[productIndex].quantity = currentQty + newQty;
            } else {
                // New product add karo
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity: Number(quantity), // ✅ yeh bhi number hona chahiye
                });
            }

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * Number(item.quantity),
                0
            );
            await cart.save();
            return res.status(200).json(cart);
        }

        // else {
        //     //create a new cart for the guest or user
        //     const newCart = await Cart.create({
        //         user: userId ? userId : undefined,
        //         guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        //         products: [
        //             {
        //                 productId,
        //                 name: product.name,
        //                 image: product.images[0].url,
        //                 price: product.price,
        //                 size,
        //                 color,
        //                 quantity,

        //             }
        //         ],
        //         totalPrice: product.price * numericQuantity,
        //     });
        //     return res.status(201).json(newCart);
        // }
        else {
            const numericQuantity = Number(quantity); // ✅ Add this line

            if (isNaN(numericQuantity)) {
                return res.status(400).json({ message: "Invalid quantity" });
            }

            //create a new cart for the guest or user
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity: numericQuantity, // ✅ Use here
                    }
                ],
                totalPrice: product.price * numericQuantity, // ✅ Fixed
            });

            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" })
    }
})

// @route   PUT /api/cart
// @desc   update quantity in the cart for a guest or logged in user
// @access  Public

router.put("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            const numericQuantity = Number(quantity); // 👈 Cast to number

            if (numericQuantity > 0) {
                cart.products[productIndex].quantity = numericQuantity;
            } else {
                cart.products.splice(productIndex, 1); // Remove product if quantity is 0
            }

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * Number(item.quantity),
                0
            );

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in the cart" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
});

// @route   DELETE /api/cart
// @desc  delete a product from the cart
// @access  Public

router.delete("/", async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1); // Remove product 

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * Number(item.quantity),
                0
            );

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in the cart" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
});

// @route   GET /api/cart
// @desc  get logged-in user's or guest user's cart
// @access  Public

router.get("/", async (req, res) => {
    const { guestId, userId } = req.query;

    try {
        let cart = await getCart(userId, guestId);
        if (cart) return res.json(cart);
        else return res.status(404).json({ message: "Cart not found" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
});


// @route   GET /api/cart/merge
// @desc  merge logged-in user's with guest user's cart
// @access  Public

router.post("/merge",protect, async (req, res) => {
    const { guestId} = req.body;

    try {
        const guestCart=await Cart.findOne({guestId});
        const userCart=await Cart.findOne({user:req.user._id});
        if(guestCart){
            if(guestCart.products.length===0){
                return res.status(404).json({ message: "guest cart is empty" });
            }
            if(userCart){
                // merge guest cart into usercart
                guestCart.products.forEach((guestItem)=>{
                    const productIndex=userCart.products.findIndex((item)=>
                        item.productId.toString()===guestItem.productId.toString()&& item.size===guestItem.size && item.color===guestItem.color
                );
                if(productIndex>-1){
                    // if the items exists in the user cart ,update the quantity
                    userCart.products[productIndex].quantity+=guestItem.quantity;
                }
                else{
                    // otherwise add the guest itme to the cart
                    userCart.products.push(guestItem);
                }
                });
                userCart.totalPrice=userCart.products.reduce((acc,item)=> acc+item.price*item.quantity,0);
                await userCart.save();
                //now remove the guest cart after merging
                try {
                    await Cart.findOneAndDelete({guestId});
                } catch (error) {
                      console.log("Error deleting this cart:",error);
                }
                res.status(200).json(userCart);
            }else{
                //if the user has no existing cart,assign the guest acrt to the user
                guestCart.user=req.user._id;
                guestCart.guestId=undefined;
                await guestCart.save();
                res.status(200).json(guestCart);
            }
        }else{
            if(userCart){
                //guest cart has already been merged ,return user acrt
                return res.status(200).json(userCart);
            }
            res.status(404).json({message:"guest cart not found"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
});

module.exports = router;