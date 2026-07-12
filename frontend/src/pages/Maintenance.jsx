import { useState } from 'react'

const initialLogs = [
  { id: 'M001', vehicle: 'GJ03EF9012', type: 'Oil Change', description: 'Regular oil change', date: '2026-07-01', cost: 2500, status: 'Completed' },
  { id: 'M002', vehicle: 'GJ02CD5678', type: 'Tyre Replacement', description: 'Front tyres worn out', date: '2026-07-10', cost: 8000, status: 'In Progress' },
  { id: 'M003', vehicle: 'GJ01AB1234', type: 'Brake Service', description: 'Brake pads replacement', date: '2026-07-12', cost: 3500, status: 'Pending' },
]

const statusColor = {
  Pending: 'bg-yellow-100 text-yellow-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
}

const vehicles = ['GJ01AB1234', 'GJ02CD5678', 'GJ03EF9012', 'GJ04GH3456']

function Maintenance() {
  const [logs, setLogs] = useState(initialLogs)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    vehicle: '', type: '', description: '', date: '', cost: ''
  })
  const [error, setError] = useState('')

  const handleAdd = () => {
    if (!form.vehicle || !form.type || !form.date || !form.cost) {
      setError('Please fill all fields')
      return
    }
    setLogs([...logs, {
      ...form,
      id: `M00${logs.length + 1}`,
      cost: Number(form.cost),
      status: 'Pending'
    }])
    setForm({ vehicle: '', type: '', description: '', date: '', cost: '' })
    setError('')
    setShowModal(false)
  }

  const updateStatus = (id, status) => {
    setLogs(logs.map(l => l.id === id ? { ...l, status } : l))
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

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Records', value: logs.length, color: 'bg-blue-500' },
          { label: 'In Progress', value: logs.filter(l => l.status === 'In Progress').length, color: 'bg-orange-500' },
          { label: 'Total Cost', value: `₹${logs.reduce((a, b) => a + b.cost, 0).toLocaleString()}`, color: 'bg-purple-500' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className={`${card.color} w-10 h-10 rounded-lg`} />
            <div>
              <p className="text-gray-500 text-xs">{card.label}</p>
              <p className="text-xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Cost (₹)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-blue-600">{l.id}</td>
                <td className="px-4 py-3">{l.vehicle}</td>
                <td className="px-4 py-3">{l.type}</td>
                <td className="px-4 py-3">{l.date}</td>
                <td className="px-4 py-3">₹{l.cost.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[l.status]}`}>
                    {l.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {l.status === 'Pending' && (
                      <button
                        onClick={() => updateStatus(l.id, 'In Progress')}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Start
                      </button>
                    )}
                    {l.status === 'In Progress' && (
                      <button
                        onClick={() => updateStatus(l.id, 'Completed')}
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        Complete
                      </button>
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
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add Maintenance Record</h3>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                <select
                  value={form.vehicle}
                  onChange={e => setForm({ ...form, vehicle: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              {[
                { label: 'Maintenance Type', key: 'type', placeholder: 'Oil Change' },
                { label: 'Description', key: 'description', placeholder: 'Describe the issue' },
                { label: 'Cost (₹)', key: 'cost', placeholder: '2500' },
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
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