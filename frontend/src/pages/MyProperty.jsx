import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Location from "../icons/Location";

const MyProperty = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://prod-real-estate-backend.onrender.com/property/me", {
          withCredentials: true,
        });
        setProperties(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handledelete = async (propertyId) => {
    // Added confirmation for safety
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axios.delete(`https://prod-real-estate-backend.onrender.com/property/${propertyId}`, {
          withCredentials: true,
        });
        setProperties((prev) => prev.filter((prop) => prop.id !== propertyId));
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600 font-medium text-lg">Loading your properties...</p>
      </div>
    );
  }
  
  if (!loading && properties.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center max-w-lg w-full">
          <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mb-4">
            🏠
          </div>
          <h3 className="text-2xl font-bold text-slate-800">No Properties Found</h3>
          <p className="text-slate-500 mt-1 mb-6">You haven't listed any properties yet.</p>
          <button 
            onClick={() => navigate('/property/create')} 
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            List Your First Property
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            My Properties
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Manage, update, and delete your listings.
          </p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((props) => (
            <div
              key={props.id}
              className="relative group w-full rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={props.imageUrl}
                  alt={props.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 [filter:brightness(75%)]"
                />
              </div>

              {/* Price Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1.5 rounded-full font-bold text-sm shadow-md">
                ₹{props.price.toLocaleString()}
              </div>

              {/* Delete Button */}
              <button 
                onClick={() => handledelete(props.id)}
                className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-red-700 hover:scale-110 transition-all active:scale-95 z-10"
                title="Delete Property"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Content Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex justify-between items-end gap-2">
                  <div className="text-white flex-1 min-w-0 mr-2">
                    <h3 className="text-lg font-bold truncate leading-tight mb-1">
                      {props.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-300">
                      <Location className="w-4 h-4" />
                      <span className="truncate">{props.location}, India</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                    <button
                      onClick={() => navigate(`/property/${props.id}`)}
                      className="bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-white transition-colors whitespace-nowrap"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/myproperty/update/${props.id}`)}
                      className="bg-indigo-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20 whitespace-nowrap"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProperty;