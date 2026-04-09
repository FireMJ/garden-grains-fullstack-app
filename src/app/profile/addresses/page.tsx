"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaHome, FaBuilding, FaCheck } from "react-icons/fa";

type AddressType = 'home' | 'work' | 'other';

interface Address {
  id: string;
  type: AddressType;
  street: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    type: 'home' as AddressType,
    street: '',
    city: '',
    postalCode: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadAddresses();
  }, [user, router]);

  const loadAddresses = async () => {
    setIsLoading(true);
    try {
      const savedAddresses = localStorage.getItem(`addresses_${user?.uid}`);
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      } else {
        setAddresses([
          {
            id: '1',
            type: 'home',
            street: '123 Main Street',
            city: 'Cape Town',
            postalCode: '8001',
            isDefault: true,
          },
          {
            id: '2',
            type: 'work',
            street: '456 Business Park',
            city: 'Century City',
            postalCode: '7441',
            isDefault: false,
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAddresses = (updatedAddresses: Address[]) => {
    setAddresses(updatedAddresses);
    localStorage.setItem(`addresses_${user?.uid}`, JSON.stringify(updatedAddresses));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAddress) {
      const updatedAddresses = addresses.map(addr =>
        addr.id === editingAddress.id
          ? { ...editingAddress, ...formData }
          : addr
      );
      saveAddresses(updatedAddresses);
    } else {
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0,
      };
      saveAddresses([...addresses, newAddress]);
    }
    
    setShowForm(false);
    setEditingAddress(null);
    setFormData({ type: 'home', street: '', city: '', postalCode: '' });
  };

  const setDefaultAddress = (id: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    saveAddresses(updatedAddresses);
  };

  const deleteAddress = (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== id);
      if (updatedAddresses.length > 0 && !updatedAddresses.some(addr => addr.isDefault)) {
        updatedAddresses[0].isDefault = true;
      }
      saveAddresses(updatedAddresses);
    }
  };

  const editAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
    });
    setShowForm(true);
  };

  const getTypeIcon = (type: AddressType) => {
    switch (type) {
      case 'home': return <FaHome className="text-blue-600" />;
      case 'work': return <FaBuilding className="text-purple-600" />;
      default: return <FaMapMarkerAlt className="text-gray-600" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/profile" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600">
            <FaArrowLeft /> Back to Profile
          </Link>
          <button
            onClick={() => {
              setEditingAddress(null);
              setFormData({ type: 'home', street: '', city: '', postalCode: '' });
              setShowForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <FaPlus /> Add Address
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Addresses</h1>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-8">
              <FaMapMarkerAlt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No addresses saved yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-green-600 hover:underline"
              >
                Add your first address
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border rounded-lg p-4 transition ${
                    address.isDefault ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="mt-1">{getTypeIcon(address.type)}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {address.type}
                          </h3>
                          {address.isDefault && (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">{address.street}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.postalCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!address.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(address.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Set as default"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button
                        onClick={() => editAddress(address)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteAddress(address.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Address Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as AddressType })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    {editingAddress ? 'Update' : 'Save'} Address
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingAddress(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
