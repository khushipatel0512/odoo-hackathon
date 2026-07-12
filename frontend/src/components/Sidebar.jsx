import { useState } from 'react'

const allNavItems = [
  { name: 'Dashboard', icon: '📊', id: 'dashboard', roles: ['fleet_manager', 'safety_officer', 'financial_analyst'] },
  { name: 'Vehicles', icon: '🚛', id: 'vehicles', roles: ['fleet_manager'] },
  { name: 'Drivers', icon: '👤', id: 'drivers', roles: ['fleet_manager', 'safety_officer'] },
  { name: 'Trips', icon: '🗺️', id: 'trips', roles: ['fleet_manager', 'driver'] },
  { name: 'Maintenance', icon: '🔧', id: 'maintenance', roles: ['fleet_manager'] },
  { name: 'Fuel & Expenses', icon: '⛽', id: 'fuel', roles: ['fleet_manager', 'financial_analyst'] },
  { name: 'Reports', icon: '📈', id: 'reports', roles: ['fleet_manager', 'safety_officer', 'financial_analyst'] },
]

const roleLabels = {
  fleet_manager: { label: 'Fleet Manager', color: 'bg-blue-600' },
  driver: { label: 'Driver', color: 'bg-green-600' },
  safety_officer: { label: 'Safety Officer', color: 'bg-purple-600' },
  financial_analyst: { label: 'Financial Analyst', color: 'bg-orange-600' },
}

function Sidebar({ activePage, setActivePage, onLogout, role }) {
  const [collapsed, setCollapsed] = useState(false)
  const navItems = allNavItems.filter(item => item.roles.includes(role))
  const roleInfo = roleLabels[role] || roleLabels['fleet_manager']

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-gray-900 min-h-screen flex flex-col`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-700">
        {!collapsed && (
          <div>
            <h1 className="text-white font-bold text-xl">TransitOps</h1>
            <p className="text-gray-400 text-xs">Transport Platform</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white text-xl"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-gray-700">
          <span className={`${roleInfo.color} text-white text-xs px-2 py-1 rounded-full font-medium`}>
            {roleInfo.label}
          </span>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 py-4">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all
              ${activePage === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 text-gray-400 hover:text-red-400 transition"
        >
          <span className="text-xl">🚪</span>
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar