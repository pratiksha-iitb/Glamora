import React, { useRef, useState, useEffect } from 'react'
import ProductGrid from '../components/Products/ProductGrid';
import SortOptions from '../components/Products/SortOptions';
import { FaFilter } from "react-icons/fa";
import FilterSidebar from '../components/Products/FilterSidebar';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CollectionPage = () => {
    const { collection } = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.product);
    const queryParams = Object.fromEntries([...searchParams]);
    // const [products, setProducts] = useState([]);
    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    useEffect(() => {
        dispatch(fetchProductsByFilters({ collection, ...queryParams }))
    }, [dispatch, collection, searchParams]);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (e) => {
        // Close sidebar if clicked outside
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        // Add Event listener for clicks
        document.addEventListener("mousedown", handleClickOutside);
        // Clean event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col lg:flex-row">
            {/* Mobile Filter button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden border p-2 flex justify-center items-center"
            >
                <FaFilter className="mr-2" /> Filters
            </button>

            {/* Filter Sidebar */}
            <div
                ref={sidebarRef}
                className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } fixed inset-y-0 z-50 left-0 w-60 md:w-80 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
            >
                <FilterSidebar />
            </div>

            <div className="flex-grow p-4">
                <Link to="/collection/all">
                    <h2 className="text-2xl font-medium uppercase mb-4 hover:underline cursor-pointer">
                        All Collection
                    </h2>
                </Link>

                {/* Sort Options */}
                <SortOptions />

                {/* Product Grid */}
                <ProductGrid products={products} loading={loading} error={error} />
            </div>
        </div>
    );
}

export default CollectionPage;