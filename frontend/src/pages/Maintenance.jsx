import { useState, useEffect } from 'react'
import { getMaintenance, createMaintenance } from '../api/index'

function Maintenance() {
  const [logs, setLogs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    vehicle: '', maintenance_type: 'routine', description: '', date: '', cost: '', next_due_date: ''
  })
  const [error, setError] = useState('')

  useEffect(() => { fetchMaintenance() }, [])

  const fetchMaintenance = async () => {
    try {
      const res = await getMaintenance()
      setLogs(res.data)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!form.vehicle || !form.maintenance_type || !form.date || !form.cost) {
      setError('Please fill all fields')
      return
    }
    try {
      await createMaintenance({
        vehicle: Number(form.vehicle),
        maintenance_type: form.maintenance_type,
        description: form.description,
        date: form.date,
        cost: Number(form.cost),
        next_due_date: form.next_due_date || null
      })
      fetchMaintenance()
      setForm({ vehicle: '', maintenance_type: 'routine', description: '', date: '', cost: '', next_due_date: '' })
      setError('')
      setShowModal(false)
    } catch (err) {
      setError('Failed to add record.')
      console.error(err.response?.data)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Maintenance</h2>
          <p className="text-gray-500 text-sm">Track vehicle maintenance and repairs</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
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
                <th className="px-4 py-3">Next Due</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{l.vehicle}</td>
                  <td className="px-4 py-3 capitalize">{l.maintenance_type}</td>
                  <td className="px-4 py-3">{l.description}</td>
                  <td className="px-4 py-3">{l.date}</td>
                  <td className="px-4 py-3">₹{l.cost}</td>
                  <td className="px-4 py-3">{l.next_due_date || '-'}</td>
                </tr>
              ))}
              {logs.length === 0 && !loading && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No records found</td></tr>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle ID</label>
                <input type="number" placeholder="1" value={form.vehicle}
                  onChange={e => setForm({ ...form, vehicle: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Type</label>
                <select value={form.maintenance_type}
                  onChange={e => setForm({ ...form, maintenance_type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="routine">Routine Service</option>
                  <option value="repair">Repair</option>
                  <option value="inspection">Inspection</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" placeholder="Describe the issue" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost (₹)</label>
                <input type="number" placeholder="2500" value={form.cost}
                  onChange={e => setForm({ ...form, cost: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date (optional)</label>
                <input type="date" value={form.next_due_date}
                  onChange={e => setForm({ ...form, next_due_date: e.target.value })}
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