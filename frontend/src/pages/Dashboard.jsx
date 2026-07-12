import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { getVehicles, getDrivers, getTrips, getFuelLogs } from '../api/index'

const statusColor = {
  Completed: 'bg-green-100 text-green-700',
  completed: 'bg-green-100 text-green-700',
  Active: 'bg-blue-100 text-blue-700',
  ongoing: 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  scheduled: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
  cancelled: 'bg-red-100 text-red-700',
}

function Dashboard() {
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [trips, setTrips] = useState([])
  const [fuelLogs, setFuelLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getVehicles(),
      getDrivers(),
      getTrips(),
      getFuelLogs().catch(() => ({ data: [] }))
    ]).then(([v, d, t, f]) => {
      setVehicles(v.data)
      setDrivers(d.data)
      setTrips(t.data)
      setFuelLogs(f.data)
      setLoading(false)
    })
  }, [])

  // KPI calculations from real data
  const totalVehicles = vehicles.length
  const activeTrips = trips.filter(t => t.status === 'ongoing').length
  const driversOnDuty = drivers.filter(d => d.status === 'on_trip' || d.status === 'active').length
  const inMaintenance = vehicles.filter(v => v.status === 'maintenance').length
  const availableVehicles = vehicles.filter(v => v.status === 'active').length
  const fleetUtilization = totalVehicles > 0 ? Math.round((availableVehicles / totalVehicles) * 100) : 0

  const kpis = [
    { label: 'Total Vehicles', value: totalVehicles, icon: '🚛', color: 'bg-blue-500' },
    { label: 'Active Trips', value: activeTrips, icon: '🗺️', color: 'bg-green-500' },
    { label: 'Drivers On Duty', value: driversOnDuty, icon: '👤', color: 'bg-purple-500' },
    { label: 'In Maintenance', value: inMaintenance, icon: '🔧', color: 'bg-orange-500' },
    { label: 'Available Vehicles', value: availableVehicles, icon: '✅', color: 'bg-teal-500' },
    { label: 'Fleet Utilization', value: `${fleetUtilization}%`, icon: '📊', color: 'bg-pink-500' },
  ]

  // Trips this week by day
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const tripData = days.map(day => ({
    day,
    trips: trips.filter(t => {
      const d = new Date(t.start_time)
      return days[d.getDay()] === day
    }).length
  }))

  // Fuel cost by month from real data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const fuelData = months.map(month => ({
    month,
    cost: fuelLogs
      .filter(f => {
        const d = new Date(f.date || f.created_at)
        return months[d.getMonth()] === month
      })
      .reduce((sum, f) => sum + Number(f.total_cost || f.cost || 0), 0)
  })).filter(m => m.cost > 0)

  // Recent trips — last 5
  const recentTrips = [...trips]
    .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
    .slice(0, 5)

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Loading dashboard...</div>
  }

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
            <LineChart data={fuelData.length > 0 ? fuelData : [{ month: 'No data', cost: 0 }]}>
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
            {recentTrips.length === 0 ? (
              <tr><td colSpan={5} className="py-4 text-center text-gray-400">No trips yet</td></tr>
            ) : (
              recentTrips.map((trip) => (
                <tr key={trip.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-2 font-medium text-blue-600">T{String(trip.id).padStart(3, '0')}</td>
                  <td className="py-2">{trip.origin}</td>
                  <td className="py-2">{trip.destination}</td>
                  <td className="py-2">{trip.driver_name || `Driver ${trip.driver}`}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[trip.status]}`}>
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard