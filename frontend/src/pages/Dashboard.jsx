import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const kpis = [
  { label: 'Total Vehicles', value: 12, icon: '🚛', color: 'bg-blue-500' },
  { label: 'Active Trips', value: 4, icon: '🗺️', color: 'bg-green-500' },
  { label: 'Drivers On Duty', value: 6, icon: '👤', color: 'bg-purple-500' },
  { label: 'In Maintenance', value: 2, icon: '🔧', color: 'bg-orange-500' },
  { label: 'Available Vehicles', value: 6, icon: '✅', color: 'bg-teal-500' },
  { label: 'Fleet Utilization', value: '67%', icon: '📊', color: 'bg-pink-500' },
]

const tripData = [
  { day: 'Mon', trips: 4 },
  { day: 'Tue', trips: 6 },
  { day: 'Wed', trips: 3 },
  { day: 'Thu', trips: 8 },
  { day: 'Fri', trips: 5 },
  { day: 'Sat', trips: 2 },
  { day: 'Sun', trips: 1 },
]

const fuelData = [
  { month: 'Feb', cost: 12000 },
  { month: 'Mar', cost: 15000 },
  { month: 'Apr', cost: 11000 },
  { month: 'May', cost: 17000 },
  { month: 'Jun', cost: 14000 },
  { month: 'Jul', cost: 16000 },
]

const recentTrips = [
  { id: 'T001', from: 'Mumbai', to: 'Pune', driver: 'Raj Kumar', status: 'Completed' },
  { id: 'T002', from: 'Ahmedabad', to: 'Surat', driver: 'Alex Shah', status: 'Active' },
  { id: 'T003', from: 'Delhi', to: 'Jaipur', driver: 'Priya Patel', status: 'Pending' },
  { id: 'T004', from: 'Bangalore', to: 'Chennai', driver: 'Mohan Das', status: 'Active' },
]

const statusColor = {
  Completed: 'bg-green-100 text-green-700',
  Active: 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
}

function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 text-sm">Welcome back! Here's your fleet overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className={`${kpi.color} text-white text-2xl w-12 h-12 rounded-lg flex items-center justify-center`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-gray-500 text-xs">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-4">Trips This Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tripData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="trips" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-4">Fuel Cost Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={fuelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cost" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold text-gray-700 mb-4">Recent Trips</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Trip ID</th>
              <th className="pb-2">From</th>
              <th className="pb-2">To</th>
              <th className="pb-2">Driver</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTrips.map((trip) => (
              <tr key={trip.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-2 font-medium text-blue-600">{trip.id}</td>
                <td className="py-2">{trip.from}</td>
                <td className="py-2">{trip.to}</td>
                <td className="py-2">{trip.driver}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[trip.status]}`}>
                    {trip.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard