"use client";

import { useState } from "react";
import { 
  FiPackage, 
  FiMapPin, 
  FiClock, 
  FiDollarSign,
  FiCheckCircle,
  FiNavigation,
  FiUser,
  FiSmartphone
} from "react-icons/fi";

export default function DriverPortal() {
  const [activeTab, setActiveTab] = useState("deliveries");

  const deliveries = [
    { id: 1, address: "123 Main St", amount: 45, status: "pending", time: "15 min" },
    { id: 2, address: "456 Oak Ave", amount: 60, status: "assigned", time: "25 min" },
    { id: 3, address: "789 Pine Rd", amount: 35, status: "completed", time: "completed" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Portal</h1>
          <p className="text-gray-600">Manage your deliveries and earnings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <FiPackage className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Today&apos;s Deliveries</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Today&apos;s Earnings</p>
                <p className="text-2xl font-bold">R320</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Active Time</p>
                <p className="text-2xl font-bold">4h 30m</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <FiCheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Rating</p>
                <p className="text-2xl font-bold">4.8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Deliveries Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="border-b">
                <div className="flex">
                  <button
                    className={`flex-1 py-4 text-center font-medium ${activeTab === "deliveries" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                    onClick={() => setActiveTab("deliveries")}
                  >
                    Active Deliveries
                  </button>
                  <button
                    className={`flex-1 py-4 text-center font-medium ${activeTab === "history" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                    onClick={() => setActiveTab("history")}
                  >
                    Delivery History
                  </button>
                </div>
              </div>

              <div className="p-6">
                {deliveries.map((delivery) => (
                  <div key={delivery.id} className="border rounded-lg p-4 mb-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-50 rounded-lg mr-4">
                          <FiMapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{delivery.address}</h3>
                          <p className="text-sm text-gray-500">Delivery #{delivery.id}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-lg">R{delivery.amount}</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          delivery.status === "completed" 
                            ? "bg-green-100 text-green-800" 
                            : delivery.status === "assigned"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {delivery.status === "completed" && <FiCheckCircle className="w-4 h-4 mr-1" />}
                          {delivery.status === "assigned" && <FiClock className="w-4 h-4 mr-1" />}
                          {delivery.time}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-3">
                      <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center">
                        <FiNavigation className="w-4 h-4 mr-2" />
                        Start Navigation
                      </button>
                      <button className="flex-1 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition flex items-center justify-center">
                        <FiSmartphone className="w-4 h-4 mr-2" />
                        Call Customer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Driver Info Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <FiUser className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">John Driver</h3>
                  <p className="text-gray-600">Professional Delivery Partner</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle</span>
                  <span className="font-medium">Toyota Corolla</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Driver ID</span>
                  <span className="font-medium">#DRV-7842</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">Jan 2024</span>
                </div>
              </div>
            </div>

            <div className="bg-green-600 text-white rounded-xl shadow p-6">
              <h3 className="font-bold text-lg mb-4">Delivery Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Always verify the order before delivery</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Contact customer if you&apos;re running late</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Take clear photos for proof of delivery</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
