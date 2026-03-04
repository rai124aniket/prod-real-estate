import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://prod-real-estate-backend.onrender.com/chat",
          { withCredentials: true }
        );
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
          <p className="text-sm text-gray-500">Your recent conversations</p>
        </div>

        {/* User List */}
        <div className="divide-y divide-gray-50">
          {users.length === 0 ? (
            <div className="p-10 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No conversations yet</p>
            </div>
          ) : (
            users.map((id) => (
              <div
                key={id}
                onClick={() => navigate(`/chat/${id}`)}
                className="group flex items-center px-6 py-4 cursor-pointer transition-all hover:bg-blue-50/50"
              >
                {/* Placeholder Avatar */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm group-hover:scale-105 transition-transform">
                  {id.toString().slice(0, 1).toUpperCase()}
                </div>

                {/* Content */}
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                      User {id.toString().slice(-4)} {/* Showing last 4 chars for cleanliness */}
                    </h3>
                    <span className="text-xs text-gray-400">Active</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    Click to open your conversation
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;