import api from '../api/axios'

export const liquidityService = {
  getProjection: ({ token }) => 
    api.get('/dashboard', {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    }).then((res) => res.data ?? {}),
}