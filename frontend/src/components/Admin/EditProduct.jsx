import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails, updateProduct } from "../../redux/slices/productSlice";
import axios from "axios";

const EditProductPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector((state) => state.product)
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false); // Image uploading state

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));

      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };


// const handleImageUpload = (e) => {
//   const files = Array.from(e.target.files);
//   const newImages = files.map(file => ({
//     url: URL.createObjectURL(file)
//   }));
//   setProductData((prevData) => ({
//     ...prevData,
//     images: [...prevData.images, ...newImages]
//   }));
// };

const handleSubmit = (e) => {
  e.preventDefault();
  dispatch(updateProduct({ id, productData }));
  navigate("/admin/products");
};



const handleChange = (e) => {
  const { name, value } = e.target;
  setProductData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error}</p>;

return (
  <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
    <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
    <form onSubmit={handleSubmit}>
      {/* Name */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Product Name</label>
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Description</label>
        <textarea
          name="description"
          value={productData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Price */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Price</label>
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Count In Stock */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Count In Stock</label>
        <input
          type="number"
          name="countInStock"
          value={productData.countInStock}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* SKU */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">SKU</label>
        <input
          type="text"
          name="sku"
          value={productData.sku}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      {/* Sizes */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Sizes (comma-separated)</label>
        <input
          type="text"
          name="sizes"
          value={productData.sizes.join(", ")}
          onChange={(e) => {
            setProductData({
              ...productData,
              sizes: e.target.value.split(",").map((size) => size.trim()),
            });
          }}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      {/* colors*/}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Colors (comma-separated)</label>
        <input
          type="text"
          name="colors"
          value={productData.colors.join(", ")}
          onChange={(e) => {
            setProductData({
              ...productData,
              colors: e.target.value.split(",").map((color) => color.trim()),
            });
          }}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      {/* Image Upload */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Upload Image</label>
        <input type="file" multiple onChange={handleImageUpload} />
        {uploading && <p>Uploading image..</p>}
        <div className="flex gap-4 mt-4 flex-wrap">
          {productData.images.map((image, index) => (
            <div key={index}>
              <img
                src={image.url}
                alt={image.altText || "Product Image"}
                className="w-20 h-20 object-cover rounded-md shadow-md"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Update product
      </button>
    </form>
  </div>
);
};

export default EditProductPage;
