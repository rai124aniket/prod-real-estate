import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Favorite from '../icons/Favorite'
import Location from '../icons/Location'
import { useNavigate } from 'react-router-dom'

const FavoriteProperties = () => {
    const [favorite,setFavorite]=useState([])
    const [loading,setLoading]=useState(true)
    const navigate=useNavigate()

    useEffect(()=>{
        const data=async ()=>{
            try {
                const res=await axios.get("http://localhost:3000/favorite",{
                    withCredentials:true
                })
                console.log(res.data.map((fav)=>fav.property))
                setFavorite(res.data.map((fav)=>fav.property))
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        data();
    },[])

    // Styled Loading State
    if(loading) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading your favorites...</p>
        </div>
      );
    }
    
    // Styled Empty State
    if(!loading && favorite.length === 0){
        return (
          <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center max-w-lg w-full">
              <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mb-4">
                ❤️
              </div>
              <h3 className="text-2xl font-bold text-slate-800">No Favorites Found</h3>
              <p className="text-slate-500 mt-1 mb-6">You haven't saved any properties yet.</p>
              <button 
                onClick={() => navigate('/')} 
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                Find Properties
              </button>
            </div>
          </div>
        );
    }

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              My Favorites
            </h1>
            <p className="mt-2 text-lg text-slate-500">
              Properties you've saved for later.
            </p>
          </div>

          {/* Property Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {favorite.map((props)=>(
                  <div key={props.id} className='relative group w-full rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-100 hover:shadow-xl transition-all duration-300'>
                      
                      {/* Image Section */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                            src={props.imageUrl}
                            alt={props.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 [filter:brightness(75%)]"
                        />
                      </div>
                      
                      {/* Price Badge */}
                      <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1.5 rounded-full font-bold text-sm shadow-md'>
                        {/* Added toLocaleString for nice formatting */}
                        ₹{props.price?.toLocaleString() ?? "N/A"}
                      </div>

                      {/* Favorite Button (Always active) */}
                      <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 cursor-pointer shadow-md'>
                        <Favorite initialActive={true} propertyId={props.id} />
                      </div>

                      {/* Content Overlay */}
                      <div className='absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent'>
                        <div className="flex justify-between items-end gap-2">
                          
                          {/* Title & Location */}
                          <div className='text-white flex-1 min-w-0 mr-2'>
                              <h3 className="text-lg font-bold truncate leading-tight mb-1">{props.title}</h3>
                              <div className="flex items-center gap-1 text-xs text-gray-300">
                                <Location className="w-4 h-4"/>
                                <span className="truncate">{props.location}, India</span>
                              </div>
                          </div>
                          
                          {/* View Button */}
                          <div className="flex-shrink-0">
                              <button 
                                onClick={()=>navigate(`/property/${props.id}`)}  
                                className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20"
                              >
                                  View More
                              </button>
                          </div>
                        </div>    
                    </div>
                  </div>
              ))}
          
          </div>
      </div>
    </div>
  )
}

export default FavoriteProperties