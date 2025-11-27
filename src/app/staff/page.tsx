export default function StaffDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Order Management</h3>
          <p className="text-gray-600">View and manage incoming orders</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Kitchen Display</h3>
          <p className="text-gray-600">View current orders in progress</p>
        </div>
      </div>
    </div>
  );
}
