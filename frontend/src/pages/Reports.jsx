import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const fuelData = [
  { vehicle: 'GJ01', cost: 9500 },
  { vehicle: 'GJ02', cost: 8000 },
  { vehicle: 'GJ03', cost: 3200 },
  { vehicle: 'GJ04', cost: 6700 },
]

const tripStatusData = [
  { name: 'Completed', value: 12 },
  { name: 'Dispatched', value: 4 },
  { name: 'Draft', value: 2 },
  { name: 'Cancelled', value: 1 },
]

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

const efficiencyData = [
  { vehicle: 'GJ01', efficiency: 8.5 },
  { vehicle: 'GJ02', efficiency: 6.2 },
  { vehicle: 'GJ03', efficiency: 7.8 },
  { vehicle: 'GJ04', efficiency: 9.1 },
]

const roiData = [
  { vehicle: 'GJ01', roi: 12.4 },
  { vehicle: 'GJ02', roi: 8.7 },
  { vehicle: 'GJ03', roi: -2.1 },
  { vehicle: 'GJ04', roi: 15.3 },
]

const handleExport = () => {
  const rows = [
    ['Vehicle', 'Fuel Cost', 'Fuel Efficiency (km/L)', 'ROI (%)'],
    ['GJ01AB1234', 9500, 8.5, 12.4],
    ['GJ02CD5678', 8000, 6.2, 8.7],
    ['GJ03EF9012', 3200, 7.8, -2.1],
    ['GJ04GH3456', 6700, 9.1, 15.3],
  ]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'transitops_report.csv'
  a.click()
}

function Reports() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
          <p className="text-gray-500 text-sm">Operational insights and performance metrics</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Trips', value: 19, icon: '🗺️', color: 'bg-blue-500' },
          { label: 'Total Fuel Cost', value: '₹27,400', icon: '⛽', color: 'bg-orange-500' },
          { label: 'Avg Efficiency', value: '7.9 km/L', icon: '📊', color: 'bg-green-500' },
          { label: 'Avg ROI', value: '8.6%', icon: '💹', color: 'bg-purple-500' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <div className={`${card.color} text-white text-xl w-10 h-10 rounded-lg flex items-center justify-center`}>
              {card.icon}
            </div>
            <div>
              <p className="text-gray-500 text-xs">{card.label}</p>
              <p className="text-lg font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Fuel Cost */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-4">Fuel Cost by Vehicle</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={fuelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vehicle" />
              <YAxis />
              <Tooltip formatter={v => `₹${v}`} />
              <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trip Status Pie */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-4">Trip Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={tripStatusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label>
                {tripStatusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Fuel Efficiency */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-4">Fuel Efficiency (km/L)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vehicle" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="efficiency" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ROI */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-4">Vehicle ROI (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vehicle" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="roi" radius={[4, 4, 0, 0]}
                fill="#8b5cf6"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Reports