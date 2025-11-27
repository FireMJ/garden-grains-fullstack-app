export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Menu Management</h3>
          <p className="text-gray-600">Manage menu items and categories</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Order Analytics</h3>
          <p className="text-gray-600">View order statistics and reports</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Staff Management</h3>
          <p className="text-gray-600">Manage staff accounts and permissions</p>
        </div>
      </div>
    </div>
  );
}
