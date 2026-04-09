import api from '../api/axios'

export const nesiService = {
  sync: () => api.post('/nesi/sync').then((res) => res.data),
}
