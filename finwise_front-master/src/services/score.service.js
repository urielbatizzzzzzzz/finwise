import api from '../api/axios'

export const scoreService = {
  getScore: () => api.get('/score').then((res) => res.data ?? null),
}
