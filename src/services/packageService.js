import api from './api'

export const getPackages = () => api.get('/addresses').then(res => res.data)

export const createPackage = (data) => api.post('/addresses', data).then(res => res.data)

export const updatePackageStatus = (addressId, packageId, status) =>
  api.patch(`/addresses/${encodeURIComponent(addressId)}/packages/${packageId}/status`, { status }).then(res => res.data)
