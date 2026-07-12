import { useState } from 'react'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import Drivers from './pages/Drivers'
import Trips from './pages/Trips'
import Maintenance from './pages/Maintenance'
import Fuel from './pages/Fuel'
import Reports from './pages/Reports'

function App() {
  const [role, setRole] = useState(null)
  const [activePage, setActivePage] = useState('dashboard')

  const handleLogin = (selectedRole) => {
    setRole(selectedRole)
    setActivePage('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setRole(null)
  }

  if (!role) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
        role={role}
      />
      <main className="flex-1 overflow-auto">
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'vehicles' && <Vehicles />}
        {activePage === 'drivers' && <Drivers />}
        {activePage === 'trips' && <Trips />}
        {activePage === 'maintenance' && <Maintenance />}
        {activePage === 'fuel' && <Fuel />}
        {activePage === 'reports' && <Reports />}
      </main>
    </div>
  )
}

export default App