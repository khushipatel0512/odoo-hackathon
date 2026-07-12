import { useState } from 'react'

const initialDrivers = [
  { id: 1, name: 'Raj Kumar', license: 'DL01-20180012345', category: 'Heavy', expiry: '2026-12-31', contact: '9876543210', safety: 92, status: 'Available' },
  { id: 2, name: 'Alex Shah', license: 'GJ02-20190023456', category: 'Medium', expiry: '2025-06-30', contact: '9876543211', safety: 78, status: 'On Trip' },
  { id: 3, name: 'Priya Patel', license: 'GJ03-20200034567', category: 'Light', expiry: '2027-03-15', contact: '9876543212', safety: 95, status: 'Available' },
  { id: 4, name: 'Mohan Das', license: 'MH04-20170045678', category: 'Heavy', expiry: '2024-01-01', contact: '9876543213', safety: 60, status: 'Suspended' },
]

const statusColor = {
  Available: 'bg-green-100 text-green-700',
  'On Trip': 'bg-blue-100 text-blue-700',
  'Off Duty': 'bg-gray-100 text-gray-700',
  Suspended: 'bg-red-100 text-red-700',
}

function Drivers() {
  const [drivers, setDrivers] = useState(initialDrivers)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    name: '', license: '', category: 'Light', expiry: '', contact: '', safety: '', status: 'Available'
  })
  const [error, setError] = useState('')

  const isExpired = (date) => new Date(date) < new Date()

  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.license.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    if (!form.name || !form.license || !form.expiry || !form.contact) {
      setError('Please fill all fields')
      return
    }
    setDrivers([...drivers, { ...form, id: drivers.length + 1, safety: Number(form.safety) }])
    setForm({ name: '', license: '', category: 'Light', expiry: '', contact: '', safety: '', status: 'Available' })
    setError('')
    setShowModal(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Drivers</h2>
          <p className="text-gray-500 text-sm">Manage driver profiles and compliance</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + Add Driver
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name or license..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">License</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Safety Score</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{d.name}</td>
                <td className="px-4 py-3 text-blue-600">{d.license}</td>
                <td className="px-4 py-3">{d.category}</td>
                <td className={`px-4 py-3 ${isExpired(d.expiry) ? 'text-red-500 font-semibold' : ''}`}>
                  {d.expiry} {isExpired(d.expiry) && '⚠️ Expired'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${d.safety >= 80 ? 'bg-green-500' : d.safety >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${d.safety}%` }}
                      />
                    </div>
                    <span>{d.safety}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[d.status]}`}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Driver</h3>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="space-y-3">
              {[
                { label: 'Full Name', key: 'name', placeholder: 'Raj Kumar' },
                { label: 'License Number', key: 'license', placeholder: 'GJ01-20180012345' },
                { label: 'Contact Number', key: 'contact', placeholder: '9876543210' },
                { label: 'Safety Score', key: 'safety', placeholder: '85' },
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
                <label className="block text-sm font-medium text-gray-700 mb-1">License Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option>Light</option>
                  <option>Medium</option>
                  <option>Heavy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry Date</label>
                <input
                  type="date"
                  value={form.expiry}
                  onChange={e => setForm({ ...form, expiry: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option>Available</option>
                  <option>Off Duty</option>
                  <option>Suspended</option>
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
                Add Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Drivers