import axios from 'axios'

const API = axios.create({
  baseURL: 'https://transitops-backend-4hhh.onrender.com'
})

export const getVehicles = () => API.get('/api/vehicles/')
export const createVehicle = (data) => API.post('/api/vehicles/', data)

export const getDrivers = () => API.get('/api/drivers/')
export const createDriver = (data) => API.post('/api/drivers/', data)

export const getTrips = () => API.get('/api/trips/')
export const createTrip = (data) => API.post('/api/trips/', data)
export const updateTrip = (id, data) => API.patch(`/api/trips/${id}/`, data)

export const getMaintenance = () => API.get('/api/maintenance/')
export const createMaintenance = (data) => API.post('/api/maintenance/', data)
export const updateMaintenance = (id, data) => API.patch(`/api/maintenance/${id}/`, data)

export const getFuel = () => API.get('/api/fuel/')
export const createFuel = (data) => API.post('/api/fuel/', data)

export default API