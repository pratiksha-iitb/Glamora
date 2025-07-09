import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const FilterSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        category: "",
        gender: "",
        color: "",
        size: [],
        material: [],
        brand: [],
        minPrice: 0,
        maxPrice: 10000,
    });
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const categories = ["Top Wear", "Bottom Wear"];
    const colors = [
        "Red",
        "Blue",
        "Black",
        "Green",
        "Yellow",
        "Gray",
        "White",
        "Pink",
        "beige",
        "Navy",
    ];
    const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

    const materials = [
        "Cotton",
        "Wool",
        "Denim",
        "Polyester",
        "Silk",
        "Linen",
        "Viscose",
        "Fleece",
    ];
    const brands = [
        "Urban Threads",
        "Modern Fit",
        "Street Style",
        "Beach Breeze",
        "Fashionista",
        "ChicStyle",
    ];
    const genders = ["Men", "Women"];
    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);

        setFilters({
            category: params.category || "",
            gender: params.gender || "",
            color: params.color || "",
            size: params.size ? params.size.split(",") : [],
            material: params.material ? params.material.split(",") : [],
            brand: params.brand ? params.brand.split(",") : [],
            minPrice: params.minPrice || 0,
            maxPrice: params.maxPrice || 10000,
        });

        setPriceRange([0, params.maxPrice || 10000]);
    }, [searchParams]);

    const handleFilterChange = (e) => {
        const { name, value, type } = e.target;
        let newFilters = { ...filters };

        // Custom toggle logic for color (button-type)
        if (name === "color") {
            const current = newFilters[name] || [];
            if (current.includes(value)) {
                newFilters[name] = current.filter((item) => item !== value); // remove
            } else {
                newFilters[name] = [...current, value]; // add
            }
        } else if (type === "checkbox") {
            if (e.target.checked) {
                newFilters[name] = [...(newFilters[name] || []), value];
            } else {
                newFilters[name] = newFilters[name].filter((item) => item !== value);
            }
        } else {
            newFilters[name] = value;
        }

        setFilters(newFilters);
        console.log({ newFilters });
        updateURLParams(newFilters);
    };
    const updateURLParams = (newFilters) => {
        const params = new URLSearchParams();

        Object.keys(newFilters).forEach((key) => {
            if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
                params.append(key, newFilters[key].join(","));
            } else if (newFilters[key]) {
                params.append(key, newFilters[key]);
            }
        });

        setSearchParams(params);
        navigate(`?${params.toString()}`);
    };
    const handlePriceChange = (e) => {
        const newPrice = Number(e.target.value); // Ensure it's a number
        setPriceRange([0, newPrice]);

        const newFilters = {
            ...filters,
            minPrice: 0,
            maxPrice: newPrice
        };

        setFilters(newFilters);
        updateURLParams(newFilters);
    };



    return (
        <div className="p-4">
            <h3 className="flex text-xl font-medium text-gray-800 mb-4">Filter</h3>
            <button
                onClick={() => {
                    const defaultFilters = {
                        category: "",
                        gender: "",
                        color: "",
                        size: [],
                        material: [],
                        brand: [],
                        minPrice: 0,
                        maxPrice: 10000,
                    };
                    setFilters(defaultFilters);
                    setPriceRange([0, 10000]);
                    updateURLParams(defaultFilters);
                }}
                className="px-2 py-1 mb-4 text-sm rounded border border-gray-500 text-gray-900 hover:bg-blue-500 hover:text-white transition"
            >
                Reset Filters
            </button>


            {/* Category Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Category</label>
                {categories.map((category) => (
                    <div key={category} className="flex items-center mb-1">
                        <input
                            type="radio"
                            name="category"
                            value={category}
                            onChange={handleFilterChange}
                            checked={filters.category === category}
                            className="mr-2 h-4 w-4 accent-blue-500  border-gray-300"
                        />
                        <span className="text-gray-700">{category}</span>
                    </div>
                ))}
            </div>
            {/* gender Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Gender</label>
                {genders.map((gender) => (
                    <div key={gender} className="flex items-center mb-1">
                        <input
                            type="radio"
                            name="gender"
                            value={gender}
                            onChange={handleFilterChange}
                            checked={filters.gender === gender}
                            className="mr-2 h-4 w-4 accent-blue-500 border-gray-300"
                        />
                        <span className="text-gray-700">{gender}</span>
                    </div>
                ))}
            </div>
            {/* color Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Color</label>
                <div className='flex flex-wrap gap-2'>
                    {colors.map((color) => {
                        const isSelected = filters.color?.includes(color);
                        return (
                            <button
                                key={color}
                                name="color"
                                value={color}
                                type="button"
                                onClick={handleFilterChange}
                                className={`w-8 h-8 rounded-full border cursor-pointer transition hover:scale-105 ${isSelected ? "border-4 border-black" : "border-gray-300"
                                    }`}
                                style={{ backgroundColor: color.toLowerCase() }}
                            ></button>
                        );
                    })}
                </div>
            </div>

            {/* Size Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Size</label>
                {sizes.map((size) => (
                    <div key={size} className="flex items-center mb-1">
                        <input
                            type="checkbox"
                            name="size"
                            value={size}
                            onChange={handleFilterChange}
                            checked={filters.size.includes(size)}
                            className="mr-2 h-4 w-4 accent-blue-500  border-gray-300"
                        />
                        <span className="text-gray-700">{size}</span>
                    </div>
                ))}
            </div>
            {/* materials Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Material</label>
                {materials.map((material) => (
                    <div key={material} className="flex items-center mb-1">
                        <input
                            type="checkbox"
                            name="material"
                            value={material}
                            onChange={handleFilterChange}
                            checked={filters.material.includes(material)}
                            className="mr-2 h-4 w-4 accent-blue-500  border-gray-300"
                        />
                        <span className="text-gray-700">{material}</span>
                    </div>
                ))}
            </div>
            {/* brand Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Brand</label>
                {brands.map((brand) => (
                    <div key={brand} className="flex items-center mb-1">
                        <input
                            type="checkbox"
                            name="brand"
                            value={brand}
                            onChange={handleFilterChange}
                            checked={filters.brand.includes(brand)}
                            className="mr-2 h-4 w-4 accent-blue-500  border-gray-300"
                        />
                        <span className="text-gray-700">{brand}</span>
                    </div>
                ))}
            </div>
            {/* price range filter */}
            <div className="mb-8">
                <label className='block text-gray-600 font-medium mb-2'>Price Range</label>
                <input type='range' name="priceRange" min={0} max={10000}
                    className='w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none 
                   [&::-webkit-slider-thumb]:h-4 
                   [&::-webkit-slider-thumb]:w-4 
                   [&::-webkit-slider-thumb]:rounded-full 
                   [&::-webkit-slider-thumb]:bg-blue-500 
                   [&::-moz-range-thumb]:bg-blue-500 '
                    value={priceRange[1]}
                    onChange={handlePriceChange}
                />
                <div className='flex justify-between text-gray-600 mt-2'>
                    <span>&#8377;0</span>
                    <span>&#8377;{priceRange[1]}</span>

                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;