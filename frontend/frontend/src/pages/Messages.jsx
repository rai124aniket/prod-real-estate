import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Messages = () => {

  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {

    const fetchUsers = async () => {
      try {

        const res = await axios.get(
          "https://prod-real-estate-backend.onrender.com/chat",
          { withCredentials: true }
        )

        setUsers(res.data)

      } catch (err) {
        console.log(err)
      }
    }

    fetchUsers()

  }, [])

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded-xl p-6">

      <h2 className="text-xl font-bold mb-4">Messages</h2>

      {users.length === 0 && (
        <p className="text-gray-500">No conversations yet</p>
      )}

      {users.map((id) => (
        <div
          key={id}
          onClick={() => navigate(`/chat/${id}`)}
          className="p-4 border-b cursor-pointer hover:bg-gray-50"
        >
          Chat with User {id}
        </div>
      ))}

    </div>
  )
}

export default Messages