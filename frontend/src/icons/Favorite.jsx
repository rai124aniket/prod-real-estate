import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'



const Favorite = ({propertyId,initialActive = false}) => {
    const [color,setColor]=useState(initialActive)
    const navigate=useNavigate()
    async function onclick(){
        try {
            if(!color){
                const fav=await axios.post(`http://localhost:3000/favorite/${propertyId}`,
                   {},
                {
                    withCredentials:true
                })
                
                
                if(!(fav.data.msg=="user is not authorized")) setColor(true)
                else{
                    navigate('/auth/signin')
                }

            }
            else{
                
                console.log(propertyId)
                await axios.delete(`http://localhost:3000/favorite/${propertyId}`,{
                    withCredentials:true
                })
                setColor(false)
                
            }
        } catch (error) {
            console.error(error)
        }

    }
  return (
    <div onClick={onclick} className='cursor-pointer'>
        <svg xmlns="http://www.w3.org/2000/svg" fill={color ? "red" : "none"} viewBox="0 0 24 24" strokeWidth="1.5" stroke={color ? "red" : "currentColor"} className="size-6 font-bold" 
         
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>



    </div>
  )
}

export default Favorite
