import axios from 'axios'

const API = axios.create({
  baseURL: 'https://transitops-backend-4hhh.onrender.com'
})

export const getVehicles = () => API.get('/api/vehicles/vehicles/')
export const createVehicle = (data) => API.post('/api/vehicles/vehicles/', data)

export const getDrivers = () => API.get('/api/drivers/drivers/')
export const createDriver = (data) => API.post('/api/drivers/drivers/', data)

export const getTrips = () => API.get('/api/trips/trips/')
export const createTrip = (data) => API.post('/api/trips/trips/', data)
export const updateTrip = (id, data) => API.patch(`/api/trips/trips/${id}/`, data)

export const getMaintenance = () => API.get('/api/maintenance/maintenance/')
export const createMaintenance = (data) => API.post('/api/maintenance/maintenance/', data)
export const updateMaintenance = (id, data) => API.patch(`/api/maintenance/maintenance/${id}/`, data)

export const getFuel = () => API.get('/api/fuel/fuel/')
export const createFuel = (data) => API.post('/api/fuel/fuel/', data)

export default API