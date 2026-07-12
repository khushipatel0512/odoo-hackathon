import { useState } from 'react'

const initialVehicles = [
  { id: 1, reg: 'GJ01AB1234', name: 'Tata Ace', type: 'Mini Truck', capacity: 500, odometer: 12000, status: 'Available' },
  { id: 2, reg: 'GJ02CD5678', name: 'Ashok Leyland', type: 'Heavy Truck', capacity: 5000, odometer: 45000, status: 'On Trip' },
  { id: 3, reg: 'GJ03EF9012', name: 'Mahindra Bolero', type: 'Pickup', capacity: 800, odometer: 8000, status: 'In Shop' },
  { id: 4, reg: 'GJ04GH3456', name: 'Eicher Pro', type: 'Medium Truck', capacity: 2000, odometer: 23000, status: 'Available' },
  { id: 5, reg: 'GJ05IJ7890', name: 'Force Traveller', type: 'Van', capacity: 1000, odometer: 5000, status: 'Retired' },
]

const statusColor = {
  Available: 'bg-green-100 text-green-700',
  'On Trip': 'bg-blue-100 text-blue-700',
  'In Shop': 'bg-orange-100 text-orange-700',
  Retired: 'bg-red-100 text-red-700',
}

function Vehicles() {
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [form, setForm] = useState({
    reg: '', name: '', type: '', capacity: '', odometer: '', status: 'Available'
  })
  const [error, setError] = useState('')

  const filtered = vehicles.filter(v => {
    const matchSearch = v.reg.toLowerCase().includes(search.toLowerCase()) ||
      v.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || v.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleAdd = () => {
    if (!form.reg || !form.name || !form.type || !form.capacity) {
      setError('Please fill all fields')
      return
    }
    if (vehicles.find(v => v.reg === form.reg)) {
      setError('Registration number already exists')
      return
    }
    setVehicles([...vehicles, { ...form, id: vehicles.length + 1, capacity: Number(form.capacity), odometer: Number(form.odometer) }])
    setForm({ reg: '', name: '', type: '', capacity: '', odometer: '', status: 'Available' })
    setError('')
    setShowModal(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vehicles</h2>
          <p className="text-gray-500 text-sm">Manage your fleet registry</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + Add Vehicle
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or reg number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        {['All', 'Available', 'On Trip', 'In Shop', 'Retired'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Reg Number</th>
              <th className="px-4 py-3">Name/Model</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Capacity (kg)</th>
              <th className="px-4 py-3">Odometer (km)</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-blue-600">{v.reg}</td>
                <td className="px-4 py-3">{v.name}</td>
                <td className="px-4 py-3">{v.type}</td>
                <td className="px-4 py-3">{v.capacity}</td>
                <td className="px-4 py-3">{v.odometer}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[v.status]}`}>
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No vehicles found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Vehicle</h3>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="space-y-3">
              {[
                { label: 'Registration Number', key: 'reg', placeholder: 'GJ01AB1234' },
                { label: 'Vehicle Name/Model', key: 'name', placeholder: 'Tata Ace' },
                { label: 'Type', key: 'type', placeholder: 'Mini Truck' },
                { label: 'Max Capacity (kg)', key: 'capacity', placeholder: '500' },
                { label: 'Odometer (km)', key: 'odometer', placeholder: '0' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Available</option>
                  <option>In Shop</option>
                  <option>Retired</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { setShowModal(false); setError('') }}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Vehicles