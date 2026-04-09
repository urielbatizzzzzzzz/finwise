import api from '../api/axios'

export const dashboardService = {
  getDashboard: ({ token }) => 
    api.get('/dashboard', {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    }).then((res) => res.data || {}),
}
