import { useState } from 'react'

const initialLogs = [
  { id: 'F001', vehicle: 'GJ01AB1234', liters: 45, cost: 4500, date: '2026-07-10', type: 'Fuel' },
  { id: 'F002', vehicle: 'GJ02CD5678', liters: 80, cost: 8000, date: '2026-07-09', type: 'Fuel' },
  { id: 'F003', vehicle: 'GJ04GH3456', liters: 0, cost: 500, date: '2026-07-08', type: 'Toll' },
  { id: 'F004', vehicle: 'GJ01AB1234', liters: 50, cost: 5000, date: '2026-07-07', type: 'Fuel' },
]

const vehicles = ['GJ01AB1234', 'GJ02CD5678', 'GJ03EF9012', 'GJ04GH3456']

function Fuel() {
  const [logs, setLogs] = useState(initialLogs)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    vehicle: '', liters: '', cost: '', date: '', type: 'Fuel'
  })
  const [error, setError] = useState('')

  const totalFuel = logs.filter(l => l.type === 'Fuel').reduce((a, b) => a + b.cost, 0)
  const totalToll = logs.filter(l => l.type === 'Toll').reduce((a, b) => a + b.cost, 0)
  const totalLiters = logs.filter(l => l.type === 'Fuel').reduce((a, b) => a + b.liters, 0)

  const handleAdd = () => {
    if (!form.vehicle || !form.cost || !form.date) {
      setError('Please fill all fields')
      return
    }
    setLogs([...logs, {
      ...form,
      id: `F00${logs.length + 1}`,
      liters: Number(form.liters),
      cost: Number(form.cost),
    }])
    setForm({ vehicle: '', liters: '', cost: '', date: '', type: 'Fuel' })
    setError('')
    setShowModal(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Fuel & Expenses</h2>
          <p className="text-gray-500 text-sm">Track fuel consumption and operational costs</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + Add Log
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Fuel Cost', value: `₹${totalFuel.toLocaleString()}`, color: 'bg-blue-500', icon: '⛽' },
          { label: 'Total Toll Cost', value: `₹${totalToll.toLocaleString()}`, color: 'bg-orange-500', icon: '🛣️' },
          { label: 'Total Liters', value: `${totalLiters} L`, color: 'bg-green-500', icon: '🪣' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className={`${card.color} text-white text-2xl w-12 h-12 rounded-lg flex items-center justify-center`}>
              {card.icon}
            </div>
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
              <th className="px-4 py-3">Liters</th>
              <th className="px-4 py-3">Cost (₹)</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-blue-600">{l.id}</td>
                <td className="px-4 py-3">{l.vehicle}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${l.type === 'Fuel' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                    {l.type}
                  </span>
                </td>
                <td className="px-4 py-3">{l.liters > 0 ? `${l.liters} L` : '-'}</td>
                <td className="px-4 py-3">₹{l.cost.toLocaleString()}</td>
                <td className="px-4 py-3">{l.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add Fuel / Expense Log</h3>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option>Fuel</option>
                  <option>Toll</option>
                  <option>Other</option>
                </select>
              </div>
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
              {form.type === 'Fuel' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Liters</label>
                  <input
                    type="number"
                    placeholder="45"
                    value={form.liters}
                    onChange={e => setForm({ ...form, liters: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost (₹)</label>
                <input
                  type="number"
                  placeholder="4500"
                  value={form.cost}
                  onChange={e => setForm({ ...form, cost: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
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
                Add Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Fuel