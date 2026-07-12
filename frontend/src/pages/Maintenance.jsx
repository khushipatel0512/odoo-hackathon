import { useState, useEffect } from 'react'
import { getMaintenance, createMaintenance, updateMaintenance } from '../api/index'

const statusColor = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
}

function Maintenance() {
  const [logs, setLogs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    vehicle: '', maintenance_type: '', description: '', date: '', cost: '', status: 'pending'
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMaintenance()
  }, [])

  const fetchMaintenance = async () => {
    try {
      const res = await getMaintenance()
      setLogs(res.data)
    } catch (err) {
      console.error('Error fetching maintenance:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!form.vehicle || !form.maintenance_type || !form.date) {
      setError('Please fill all fields')
      return
    }
    try {
      await createMaintenance({ ...form, cost: Number(form.cost) })
      fetchMaintenance()
      setForm({ vehicle: '', maintenance_type: '', description: '', date: '', cost: '', status: 'pending' })
      setError('')
      setShowModal(false)
    } catch (err) {
      setError('Failed to add record.')
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await updateMaintenance(id, { status })
      fetchMaintenance()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Maintenance</h2>
          <p className="text-gray-500 text-sm">Track vehicle maintenance and repairs</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + Add Record
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{l.vehicle}</td>
                  <td className="px-4 py-3">{l.maintenance_type}</td>
                  <td className="px-4 py-3">{l.description}</td>
                  <td className="px-4 py-3">{l.date}</td>
                  <td className="px-4 py-3">₹{l.cost}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[l.status]}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {l.status === 'pending' && (
                      <button onClick={() => updateStatus(l.id, 'in_progress')}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                        Start
                      </button>
                    )}
                    {l.status === 'in_progress' && (
                      <button onClick={() => updateStatus(l.id, 'completed')}
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && !loading && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No records found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add Maintenance Record</h3>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="space-y-3">
              {[
                { label: 'Vehicle ID', key: 'vehicle', placeholder: '1' },
                { label: 'Maintenance Type', key: 'maintenance_type', placeholder: 'Oil Change' },
                { label: 'Description', key: 'description', placeholder: 'Describe issue' },
                { label: 'Cost (₹)', key: 'cost', placeholder: '2500' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowModal(false); setError('') }}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleAdd}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Add Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Maintenance