// frontend/src/components/LoadingProperties.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import Favorite from "../icons/Favorite";
import Location from "../icons/Location";
import { useNavigate } from "react-router-dom";

const LoadingProperties = ({ filteredProps }) => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true); // Ensure loading shows on re-fetch
      try {
        let data = [];

        // Use filtered props if provided
        if (filteredProps && Array.isArray(filteredProps)) {
          data = filteredProps;
        } else {
          // Otherwise fetch from backend
          const res = await axios.get("http://localhost:3000/property", {
            withCredentials: true,
          });
          
          // Robust data checking
          if (Array.isArray(res.data)) {
            data = res.data;
          } else if (res.data && Array.isArray(res.data.properties)) {
            data = res.data.properties;
          } else {
            data = [];
          }
        }

        setProperties(data);

        // Fetch favorites
        const favRes = await axios.get("http://localhost:3000/favorite", {
          withCredentials: true,
        });
        
        const favArray = Array.isArray(favRes.data)
          ? favRes.data
          : favRes.data?.favorites || [];

        setFavorites(favArray.map((fav) => fav.propertyId));

      } catch (error) {
        console.error("Error loading properties:", error);
        setFavorites([]);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [filteredProps]);

  // ✅ Inline Loading State (No external file needed)
  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {Array.isArray(properties) && properties.length > 0 ? (
        properties.map((props) => (
          <div
            key={props.id}
            className="relative group w-full rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={props.imageUrl}
                alt={props.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 [filter:brightness(75%)] group-hover:[filter:brightness(65%)]"
              />
              
              {/* Price Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                ₹{props.price?.toLocaleString() ?? "N/A"}
              </div>

              {/* Favorite Button */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm cursor-pointer hover:scale-110 transition-transform active:scale-95">
                <Favorite
                  initialActive={favorites.includes(props.id)}
                  propertyId={props.id}
                />
              </div>
            </div>

            {/* Content Overlay (Gradient) */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12">
              <div className="flex justify-between items-end">
                <div className="text-white flex-1 min-w-0 mr-2">
                  <h3 className="text-lg font-bold truncate leading-tight mb-1">
                    {props.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-300">
                    <Location className="w-4 h-4" /> 
                    <span className="truncate">{props.location}, India</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/property/${props.id}`)}
                  className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-lg shadow-indigo-900/20 whitespace-nowrap"
                >
                  View More
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        // Empty State
        <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <span className="text-4xl">🏠</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Properties Found</h3>
          <p className="text-gray-500">Try adjusting your search filters.</p>
        </div>
      )}
    </div>
  );
};

export default LoadingProperties;