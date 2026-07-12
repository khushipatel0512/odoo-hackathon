import { useState, useEffect } from 'react'
import { getTrips, createTrip, updateTrip, getDrivers, getVehicles } from '../api/index'

const statusColor = {
  scheduled: 'bg-yellow-100 text-yellow-700',
  ongoing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

function Trips() {
  const [trips, setTrips] = useState([])
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    vehicle: '', driver: '', origin: '', destination: '',
    start_time: '', end_time: '', distance_km: '', status: 'scheduled'
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTrips()
    getDrivers().then(res => setDrivers(res.data))
    getVehicles().then(res => setVehicles(res.data))
  }, [])

  const fetchTrips = async () => {
    try {
      const res = await getTrips()
      setTrips(res.data)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!form.vehicle || !form.driver || !form.origin || !form.destination || !form.start_time) {
      setError('Please fill all required fields')
      return
    }
    try {
      await createTrip({
        vehicle: Number(form.vehicle),
        driver: Number(form.driver),
        origin: form.origin,
        destination: form.destination,
        start_time: new Date(form.start_time).toISOString(),
        end_time: form.end_time ? new Date(form.end_time).toISOString() : null,
        distance_km: form.distance_km ? Number(form.distance_km) : null,
        status: form.status
      })
      fetchTrips()
      setForm({ vehicle: '', driver: '', origin: '', destination: '', start_time: '', end_time: '', distance_km: '', status: 'scheduled' })
      setError('')
      setShowModal(false)
    } catch (err) {
      setError('Failed to create trip.')
      console.error(err.response?.data)
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateTrip(id, { status })
      fetchTrips()
    } catch (err) {
      console.error('Error updating trip:', err)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Trips</h2>
          <p className="text-gray-500 text-sm">Manage trip dispatch and lifecycle</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
          + Create Trip
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading trips...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Start Time</th>
                <th className="px-4 py-3">Distance</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(t => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{t.origin} → {t.destination}</td>
                  <td className="px-4 py-3">{t.vehicle}</td>
                  <td className="px-4 py-3">{t.driver}</td>
                  <td className="px-4 py-3">{new Date(t.start_time).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{t.distance_km ? `${t.distance_km} km` : '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {t.status === 'scheduled' && (
                        <button onClick={() => handleStatusUpdate(t.id, 'ongoing')}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                          Start
                        </button>
                      )}
                      {t.status === 'ongoing' && (
                        <button onClick={() => handleStatusUpdate(t.id, 'completed')}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                          Complete
                        </button>
                      )}
                      {(t.status === 'scheduled' || t.status === 'ongoing') && (
                        <button onClick={() => handleStatusUpdate(t.id, 'cancelled')}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {trips.length === 0 && !loading && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No trips found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-screen overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Create New Trip</h3>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                <select value={form.vehicle}
                  onChange={e => setForm({ ...form, vehicle: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.registration_number} - {v.model}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                <select value={form.driver}
                  onChange={e => setForm({ ...form, driver: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">Select Driver</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              {[
                { label: 'Origin', key: 'origin', placeholder: 'Mumbai' },
                { label: 'Destination', key: 'destination', placeholder: 'Pune' },
                { label: 'Distance (km)', key: 'distance_km', placeholder: '150' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input type="text" placeholder={field.placeholder} value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input type="datetime-local" value={form.start_time}
                  onChange={e => setForm({ ...form, start_time: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time (optional)</label>
                <input type="datetime-local" value={form.end_time}
                  onChange={e => setForm({ ...form, end_time: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
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