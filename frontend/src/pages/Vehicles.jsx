import { useState, useEffect } from 'react'
import { getVehicles, createVehicle } from '../api/index'

const statusColor = {
  active: 'bg-green-100 text-green-700',
  maintenance: 'bg-orange-100 text-orange-700',
  inactive: 'bg-red-100 text-red-700',
}

function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [form, setForm] = useState({
    vehicle_number: '', model_name: '', vehicle_type: '', capacity: '', status: 'active', purchase_date: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchVehicles() }, [])

  const fetchVehicles = async () => {
    try {
      const res = await getVehicles()
      setVehicles(res.data)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = vehicles.filter(v => {
    const matchSearch = v.vehicle_number?.toLowerCase().includes(search.toLowerCase()) ||
      v.model_name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || v.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleAdd = async () => {
    if (!form.vehicle_number || !form.model_name || !form.vehicle_type || !form.capacity) {
      setError('Please fill all fields')
      return
    }
    try {
      await createVehicle({ ...form, capacity: Number(form.capacity) })
      fetchVehicles()
      setForm({ vehicle_number: '', model_name: '', vehicle_type: '', capacity: '', status: 'active', purchase_date: '' })
      setError('')
      setShowModal(false)
    } catch (err) {
      setError('Failed to add vehicle. Try again.')
      console.error(err.response?.data)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vehicles</h2>
          <p className="text-gray-500 text-sm">Manage your fleet registry</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
          + Add Vehicle
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <input type="text" placeholder="Search by name or reg number..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
        {['All', 'active', 'maintenance', 'inactive'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading vehicles...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Reg Number</th>
                <th className="px-4 py-3">Model Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Purchase Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-blue-600">{v.vehicle_number}</td>
                  <td className="px-4 py-3">{v.model_name}</td>
                  <td className="px-4 py-3">{v.vehicle_type}</td>
                  <td className="px-4 py-3">{v.capacity}</td>
                  <td className="px-4 py-3">{v.purchase_date || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[v.status]}`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No vehicles found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Vehicle</h3>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="space-y-3">
              {[
                { label: 'Registration Number', key: 'vehicle_number', placeholder: 'GJ01AB1234' },
                { label: 'Model Name', key: 'model_name', placeholder: 'Tata Ace' },
                { label: 'Vehicle Type', key: 'vehicle_type', placeholder: 'Mini Truck' },
                { label: 'Capacity', key: 'capacity', placeholder: '500' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input type="text" placeholder={field.placeholder} value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                <input type="date" value={form.purchase_date}
                  onChange={e => setForm({ ...form, purchase_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="active">Active</option>
                  <option value="maintenance">In Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowModal(false); setError('') }}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleAdd}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
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