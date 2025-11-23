import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Location from "../icons/Location";
import Favorite from "../icons/Favorite";
import Chat from "../icons/Chat";
import Profile from "../icons/Profile";
import Mail from "../icons/Mail";
import { useAuth } from "../useContext/useAuth";

const ViewProperty = () => {
  const { propertyId } = useParams();
  const [propertyData, setPropertyData] = useState(null);
  const [fav, setFav] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true); // Added loading state
  const [chatError, setChatError] = useState(""); // Replaced alert()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/property/${propertyId}`,
          {
            withCredentials: true,
          }
        );

        const fav = await axios.get(`http://localhost:3000/favorite`, {
          withCredentials: true,
        });
        setPropertyData(res.data);

        const found = fav.data.some(
          (favres) => favres.propertyId === res.data.id
        );
        setFav(found);
      } catch (error) {
        console.log("something went wrong", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [propertyId]);

  const handleChat = () => {
    setChatError(""); // Clear previous errors
    if (!user) {
      setChatError("Please login to chat with the owner.");
      return;
    }
    if (user.id === propertyData.ownerId) {
      setChatError("You cannot chat with yourself.");
      return;
    }

    navigate(`/chat/${propertyData.ownerId}`);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600 font-medium text-lg">Loading property...</p>
      </div>
    );
  }

  // Empty State
  if (!propertyData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h2>
          <button onClick={() => navigate('/')} className="text-indigo-600 hover:underline font-medium">
            ← Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Image Section */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
          <img
            src={propertyData.imageUrl}
            alt={propertyData.title}
            className="w-full h-full object-cover [filter:brightness(75%)]"
          />
          {/* Gradient Overlay for Text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          {/* Text on Image */}
          <div className="absolute bottom-0 left-0 p-5 md:p-8 text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              {propertyData.title}
            </h1>
            <div className="text-lg md:text-xl text-gray-200 flex items-center gap-2 mt-1">
              <Location /> {propertyData.location}, India
            </div>
            <div className="text-2xl md:text-3xl font-semibold text-green-400 mt-3">
              ₹{propertyData.price.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Details + Owner Info Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Property Details (Left) */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Property Details
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {propertyData.description}
            </p>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="font-bold text-lg text-gray-900">Additional Info</h3>
              <ul className="list-disc pl-5 text-gray-600 mt-2 space-y-1">
                <li>
                  <span className="font-medium text-gray-800">Location:</span> {propertyData.location}
                </li>
                <li>
                  <span className="font-medium text-gray-800">Price:</span> ₹{propertyData.price.toLocaleString()}
                </li>
              </ul>
            </div>
          </div>

          {/* Owner Info (Right) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 h-fit md:sticky md:top-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">
              Owner Info
            </h2>
            
            <div className="space-y-3 mb-6">
              <div className="text-gray-700 flex items-center gap-3 text-lg">
                <Profile className="w-6 h-6 text-indigo-500" /> 
                <span className="font-medium">{propertyData.owner.name}</span>
              </div>
              <div className="text-gray-600 flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-gray-400" /> 
                <span>{propertyData.owner.email}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {/* Chat Button */}
              <button
                onClick={handleChat}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                <Chat /> Chat with Owner
              </button>
              
              {/* Favorite Button */}
              <button
                onClick={() => setFav(!fav)} // Keep the user's exact logic
                className={`rounded-2xl flex justify-center items-center w-[60px]
                  bg-pink-50 text-pink-600 border-pink-200
                    
                `}
              >
                {/* This assumes your <Favorite> component is just an ICON.
                  If it's a "smart" component that makes its own API calls, 
                  you should remove the onClick from this button and let the component handle it.
                */}
                <Favorite initialActive={fav} propertyId={propertyData.id} /> 
                
              </button>
            </div>

            {/* Error message div */}
            {chatError && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm text-center">
                {chatError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProperty;