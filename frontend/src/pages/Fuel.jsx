import { useState, useEffect } from 'react'
import { getFuel, createFuel } from '../api/index'

function Fuel() {
  const [logs, setLogs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    vehicle: '', liters: '', cost: '', date: '', odometer_reading: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFuel()
  }, [])

  const fetchFuel = async () => {
    try {
      const res = await getFuel()
      setLogs(res.data)
    } catch (err) {
      console.error('Error fetching fuel:', err)
    } finally {
      setLoading(false)
    }
  }

  const totalCost = logs.reduce((a, b) => a + Number(b.cost), 0)
  const totalLiters = logs.reduce((a, b) => a + Number(b.liters), 0)

  const handleAdd = async () => {
    if (!form.vehicle || !form.cost || !form.date) {
      setError('Please fill all fields')
      return
    }
    try {
      await createFuel({
        ...form,
        liters: Number(form.liters),
        cost: Number(form.cost),
        odometer_reading: Number(form.odometer_reading)
      })
      fetchFuel()
      setForm({ vehicle: '', liters: '', cost: '', date: '', odometer_reading: '' })
      setError('')
      setShowModal(false)
    } catch (err) {
      setError('Failed to add log.')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Fuel & Expenses</h2>
          <p className="text-gray-500 text-sm">Track fuel consumption and costs</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
          + Add Log
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Fuel Cost', value: `₹${totalCost.toLocaleString()}`, icon: '⛽', color: 'bg-blue-500' },
          { label: 'Total Liters', value: `${totalLiters} L`, icon: '🪣', color: 'bg-green-500' },
          { label: 'Total Logs', value: logs.length, icon: '📋', color: 'bg-purple-500' },
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
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Liters</th>
                <th className="px-4 py-3">Cost (₹)</th>
                <th className="px-4 py-3">Odometer</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{l.vehicle}</td>
                  <td className="px-4 py-3">{l.liters} L</td>
                  <td className="px-4 py-3">₹{Number(l.cost).toLocaleString()}</td>
                  <td className="px-4 py-3">{l.odometer_reading} km</td>
                  <td className="px-4 py-3">{l.date}</td>
                </tr>
              ))}
              {logs.length === 0 && !loading && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No fuel logs found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add Fuel Log</h3>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="space-y-3">
              {[
                { label: 'Vehicle ID', key: 'vehicle', placeholder: '1' },
                { label: 'Liters', key: 'liters', placeholder: '45' },
                { label: 'Cost (₹)', key: 'cost', placeholder: '4500' },
                { label: 'Odometer Reading (km)', key: 'odometer_reading', placeholder: '12000' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input type="text" placeholder={field.placeholder} value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
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