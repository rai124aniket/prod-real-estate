import React, { useState } from 'react'
import { Menu } from '../icons/menu'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  // Reusable styles for navigation links to keep code clean
  const navLinkStyles = "cursor-pointer text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
  const mobileLinkStyles = "cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-all"

  return (
    // Changed to sticky so it stays at top while scrolling, added backdrop blur
    <header className='sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm'>
      
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
            
            {/* Logo Section */}
            <div 
              onClick={() => navigate("/")} 
              className='flex items-center cursor-pointer group'
            >
              {/* Added a slight hover effect to the logo */}
              <span className='font-bold text-2xl tracking-tight text-blue-600 group-hover:text-blue-700 transition-colors'>
                RealState
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden sm:flex sm:items-center sm:gap-8'>
                <div onClick={() => navigate("/")} className={navLinkStyles}>Buy</div>
                <div onClick={() => navigate("/createProperty")} className={navLinkStyles}>Sell</div>
                <div onClick={() => navigate("/myproperty")} className={navLinkStyles}>My Property</div>
                <div onClick={() => navigate("/favorite")} className={navLinkStyles}>Favorites</div>
                
                {/* Divider for Auth actions */}
                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                <div onClick={() => navigate("/auth/signin")} className={navLinkStyles}>Log in</div>
                
                {/* Call to Action Button */}
                <div 
                  onClick={() => navigate("/auth/signup")} 
                  className='cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                >
                  Register
                </div>
            </div>

            {/* Mobile Menu Trigger */}
            <div 
              onClick={() => setOpen(!open)} 
              className='sm:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 cursor-pointer transition-colors'
            >
              <Menu />
            </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {/* Added animation logic and better positioning */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg border-b border-gray-100 sm:hidden flex flex-col py-2 animate-fade-in-down">
          <div className='flex flex-col px-4 gap-1 pb-4'>
            <div onClick={() => { navigate("/"); setOpen(false); }} className={mobileLinkStyles}>Buy Property</div>
            <div onClick={() => { navigate("/createProperty"); setOpen(false); }} className={mobileLinkStyles}>Sell Property</div>
            <div onClick={() => { navigate("/myproperty"); setOpen(false); }} className={mobileLinkStyles}>My Property</div>
            <div onClick={() => { navigate("/favorite"); setOpen(false); }} className={mobileLinkStyles}>Favorites</div>
            
            <div className="h-px w-full bg-gray-100 my-2"></div>
            
            <div onClick={() => { navigate("/auth/signin"); setOpen(false); }} className={mobileLinkStyles}>Login</div>
            <div onClick={() => { navigate("/auth/signup"); setOpen(false); }} className="cursor-pointer bg-blue-600 text-white text-center px-4 py-2.5 mt-2 rounded-lg font-medium active:bg-blue-700">
              Register Now
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header