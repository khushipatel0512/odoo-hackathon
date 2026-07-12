import { useState } from 'react'

const initialTrips = [
  { id: 'T001', from: 'Mumbai', to: 'Pune', vehicle: 'GJ01AB1234', driver: 'Raj Kumar', cargo: 450, distance: 150, status: 'Completed' },
  { id: 'T002', from: 'Ahmedabad', to: 'Surat', vehicle: 'GJ04GH3456', driver: 'Alex Shah', cargo: 1800, distance: 265, status: 'Dispatched' },
  { id: 'T003', from: 'Delhi', to: 'Jaipur', vehicle: 'GJ01AB1234', driver: 'Priya Patel', cargo: 300, distance: 280, status: 'Draft' },
]

const statusColor = {
  Draft: 'bg-gray-100 text-gray-700',
  Dispatched: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

const availableVehicles = ['GJ01AB1234', 'GJ04GH3456']
const availableDrivers = ['Raj Kumar', 'Priya Patel']

function Trips() {
  const [trips, setTrips] = useState(initialTrips)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    from: '', to: '', vehicle: '', driver: '', cargo: '', distance: ''
  })
  const [error, setError] = useState('')

  const handleAdd = () => {
    if (!form.from || !form.to || !form.vehicle || !form.driver || !form.cargo) {
      setError('Please fill all fields')
      return
    }
    const newTrip = {
      ...form,
      id: `T00${trips.length + 1}`,
      cargo: Number(form.cargo),
      distance: Number(form.distance),
      status: 'Draft'
    }
    setTrips([...trips, newTrip])
    setForm({ from: '', to: '', vehicle: '', driver: '', cargo: '', distance: '' })
    setError('')
    setShowModal(false)
  }

  const updateStatus = (id, newStatus) => {
    setTrips(trips.map(t => t.id === id ? { ...t, status: newStatus } : t))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Trips</h2>
          <p className="text-gray-500 text-sm">Manage trip dispatch and lifecycle</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + Create Trip
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Trip ID</th>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Cargo (kg)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map(t => (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-blue-600">{t.id}</td>
                <td className="px-4 py-3">{t.from} → {t.to}</td>
                <td className="px-4 py-3">{t.vehicle}</td>
                <td className="px-4 py-3">{t.driver}</td>
                <td className="px-4 py-3">{t.cargo}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[t.status]}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {t.status === 'Draft' && (
                      <button
                        onClick={() => updateStatus(t.id, 'Dispatched')}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Dispatch
                      </button>
                    )}
                    {t.status === 'Dispatched' && (
                      <>
                        <button
                          onClick={() => updateStatus(t.id, 'Completed')}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updateStatus(t.id, 'Cancelled')}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Create New Trip</h3>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="space-y-3">
              {[
                { label: 'From', key: 'from', placeholder: 'Mumbai' },
                { label: 'To', key: 'to', placeholder: 'Pune' },
                { label: 'Cargo Weight (kg)', key: 'cargo', placeholder: '450' },
                { label: 'Planned Distance (km)', key: 'distance', placeholder: '150' },
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                <select
                  value={form.vehicle}
                  onChange={e => setForm({ ...form, vehicle: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select vehicle</option>
                  {availableVehicles.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                <select
                  value={form.driver}
                  onChange={e => setForm({ ...form, driver: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select driver</option>
                  {availableDrivers.map(d => <option key={d}>{d}</option>)}
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
                Create Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Trips