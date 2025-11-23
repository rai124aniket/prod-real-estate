import React, { useState } from "react";
import { useForm } from "react-hook-form";
import LoadingProperties from "../components/LoadingProperties";
import axios from "axios";

const Property = () => {
  const { register, handleSubmit } = useForm();
  const [filteredProps, setFilteredProps] = useState(null);

  const onSubmit = async (data) => {
    try {
      const res = await axios.get("http://localhost:3000/property/filter", {
        params: {
          location: data.location,
          minPrice: data.MinPrice,
          maxPrice: data.MaxPrice,
        },
      });
      setFilteredProps(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // Use min-h-screen and a consistent slate background
    <div className="min-h-screen bg-slate-50">
      
      {/* Main container with padding and max-width */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl mb-4">
            🔍
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Find Your Next Property
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Filter by location, price, and more to find your perfect match.
          </p>
        </div>

        {/* Filter Form Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-100 mb-12">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Responsive grid for inputs + button */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              
              {/* Location (Spans 2 cols on desktop) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter location (e.g. Miami, FL)"
                    {...register("location")}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <span className="text-gray-400 font-semibold">$</span>
                   </div>
                  <input
                    type="number"
                    placeholder="0"
                    {...register("MinPrice")}
                    className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <span className="text-gray-400 font-semibold">$</span>
                   </div>
                  <input
                    type="number"
                    placeholder="Any"
                    {...register("MaxPrice")}
                    className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button (On new line for mobile, aligned on desktop) */}
            <div className="mt-4 md:flex md:justify-end">
              <button
                type="submit"
                className="w-full md:w-auto flex items-center justify-center bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Apply Filter
              </button>
            </div>
          </form>
        </div>

        {/* Results Area */}
        <div>
          <LoadingProperties filteredProps={filteredProps} />
        </div>
      </div>
    </div>
  );
};

export default Property;