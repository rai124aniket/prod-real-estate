import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Property from './pages/Property'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Layout from './pages/Layout'
import NotFound from './pages/NotFound'
import CreateProperty from './pages/CreateProperty'
import { AuthProvider } from './useContext/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import Random from './pages/Random'
import FavoriteProperties from './pages/FavoriteProperties'
import ViewProperty from './pages/ViewProperty'
import MyProperty from './pages/MyProperty'
import UpdateProperty from './pages/UpdateProperty'
import ChatBox from './pages/ChatBox'
const App = () => {
  return (
    <div>
  
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Property/>}/>
              <Route path="/createProperty" element={
                <ProtectedRoute>
                  <CreateProperty/>
                </ProtectedRoute>  
              }/>
              <Route path="/auth/signup" element={<Signup/>}/>
              <Route path="/auth/signin" element={<Signin/>}/>
              <Route path='/random' element={<Random/>}/>
              <Route path='/favorite' element={
                <ProtectedRoute>
                  <FavoriteProperties/>
                </ProtectedRoute>
              }/>
              <Route path='/property/:propertyId' element={<ViewProperty/>} />
              <Route path='/myproperty/update/:propertyId' element={<UpdateProperty/>} />
              <Route path='/myproperty' element={
                <ProtectedRoute>
                  <MyProperty/>
                </ProtectedRoute>
              } />
              <Route path='/chat/:receiverId' element={
                //<ProtectedRoute>
                  <ChatBox/>
                //</ProtectedRoute>
              } />
            </Route>
            <Route path='*' element={<NotFound/>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App
