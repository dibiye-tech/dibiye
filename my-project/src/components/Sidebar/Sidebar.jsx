
import React from 'react';
const Sidebar = () => {
  return (
    <div className="fixed w-64 h-screen bg-blue-gray-800 text-white">
      <div className="flex items-center justify-center py-4">
        <h1 className="text-xl font-bold">Sidebar</h1>
      </div>
      <ul className="mt-6">
        <li className="px-4 py-2 rounded-md hover:bg-blue-gray-700">
          <a href="#" className="text-sm font-medium">Dashboard</a>
        </li>
        <li className="px-4 py-2 rounded-md hover:bg-blue-gray-700">
          <a href="#" className="text-sm font-medium">Settings</a>
        </li>
        <li className="px-4 py-2 rounded-md hover:bg-blue-gray-700">
          <a href="#" className="text-sm font-medium">Logout</a>
        </li>
      </ul>
    </div>

  )
}

export default Sidebar