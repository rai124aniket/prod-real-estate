import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Menu from '../icons/Menu'

const Header = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const navLinkStyles =
    "cursor-pointer text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"

  const mobileLinkStyles =
    "cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-all"

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer group"
          >
            <span className="font-bold text-2xl tracking-tight text-blue-600 group-hover:text-blue-700 transition-colors">
              RealState
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex sm:items-center sm:gap-8">
            <div onClick={() => navigate("/")} className={navLinkStyles}>Buy</div>
            <div onClick={() => navigate("/createProperty")} className={navLinkStyles}>Sell</div>
            <div onClick={() => navigate("/myproperty")} className={navLinkStyles}>My Property</div>
            <div onClick={() => navigate("/favorite")} className={navLinkStyles}>Favorites</div>

            {/* FIXED MESSAGE ROUTE */}
            <div onClick={() => navigate("/messages")} className={navLinkStyles}>Messages</div>

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            <div onClick={() => navigate("/auth/signin")} className={navLinkStyles}>Log in</div>

            <div
              onClick={() => navigate("/auth/signup")}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Register
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div
            onClick={() => setOpen(!open)}
            className="sm:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <Menu />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg border-b border-gray-100 sm:hidden flex flex-col py-2">
          <div className="flex flex-col px-4 gap-1 pb-4">

            <div onClick={() => { navigate("/"); setOpen(false) }} className={mobileLinkStyles}>
              Buy Property
            </div>

            <div onClick={() => { navigate("/createProperty"); setOpen(false) }} className={mobileLinkStyles}>
              Sell Property
            </div>

            <div onClick={() => { navigate("/myproperty"); setOpen(false) }} className={mobileLinkStyles}>
              My Property
            </div>

            <div onClick={() => { navigate("/favorite"); setOpen(false) }} className={mobileLinkStyles}>
              Favorites
            </div>

            <div onClick={() => { navigate("/messages"); setOpen(false) }} className={mobileLinkStyles}>
              Messages
            </div>

            <div className="h-px w-full bg-gray-100 my-2"></div>

            <div onClick={() => { navigate("/auth/signin"); setOpen(false) }} className={mobileLinkStyles}>
              Login
            </div>

            <div
              onClick={() => { navigate("/auth/signup"); setOpen(false) }}
              className="cursor-pointer bg-blue-600 text-white text-center px-4 py-2.5 mt-2 rounded-lg font-medium active:bg-blue-700"
            >
              Register Now
            </div>

          </div>
        </div>
      )}
    </header>
  )
}

export default Header