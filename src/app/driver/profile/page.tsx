"use client";

import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Car, 
  Shield, 
  Edit2, 
  Camera,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const DRIVER_PROFILE = {
  name: 'John Driver',
  email: 'john.driver@example.com',
  phone: '+27 123 456 789',
  address: '123 Driver St, Cape Town, 8001',
  vehicle: {
    make: 'Toyota',
    model: 'Corolla',
    year: '2020',
    color: 'White',
    plate: 'CA 123-456'
  },
  documents: {
    license: { verified: true, expiry: '2025-12-31' },
    insurance: { verified: true, expiry: '2024-06-30' },
    vehicle: { verified: true, expiry: '2024-12-31' }
  },
  rating: 4.8,
  totalDeliveries: 342,
  memberSince: '2022-03-15'
};

export default function DriverProfilePage() {
  const [profile, setProfile] = useState(DRIVER_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...DRIVER_PROFILE });

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      setProfile(formData);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      vehicle: {
        ...prev.vehicle,
        [name]: value
      }
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Profile</h1>
            <p className="text-gray-600">Manage your driver account and documents</p>
          </div>
          <button
            onClick={handleEdit}
            className={`mt-4 md:mt-0 px-6 py-3 rounded-lg font-medium flex items-center ${
              isEditing
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="font-medium">{profile.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="font-medium">{profile.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="font-medium">{profile.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="font-medium">{profile.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      Changes to your personal information may require re-verification.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Vehicle Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {['make', 'model', 'year', 'color', 'plate'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field === 'plate' ? 'License Plate' : field}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name={field}
                        value={formData.vehicle[field as keyof typeof formData.vehicle]}
                        onChange={handleVehicleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Car className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="font-medium">
                          {profile.vehicle[field as keyof typeof profile.vehicle]}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Photo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    {isEditing ? 'Upload vehicle photo' : 'Vehicle photo uploaded'}
                  </p>
                  {isEditing && (
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                      Choose File
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Documents & Stats */}
          <div className="space-y-8">
            {/* Documents */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Documents</h2>

              <div className="space-y-4">
                {Object.entries(profile.documents).map(([doc, info]) => (
                  <div key={doc} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="font-medium capitalize">{doc}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        info.verified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {info.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Expires: {formatDate(info.expiry)}
                    </p>
                    <button className="mt-3 text-sm text-blue-600 hover:text-blue-800">
                      {isEditing ? 'Update Document' : 'View Document'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Important:</span> Keep all documents updated to avoid account suspension.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Driver Stats</h2>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Driver Rating</span>
                    <span className="font-bold text-gray-900">{profile.rating}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(profile.rating / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Total Deliveries</span>
                    <span className="font-bold text-gray-900">{profile.totalDeliveries}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(profile.totalDeliveries / 500) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-bold text-gray-900">
                      {new Date(profile.memberSince).getFullYear()}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Driver Level</p>
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full">
                      Gold Driver
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Top 10% of drivers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Actions</h2>
              <div className="space-y-3">
                <button className="w-full py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                  Change Password
                </button>
                <button className="w-full py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                  Two-Factor Authentication
                </button>
                <button className="w-full py-3 border-2 border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50">
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
