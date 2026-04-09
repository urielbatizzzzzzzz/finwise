import api from '../api/axios'

export const authService = {
  login: ({ email, password }) =>
    api.post('/auth/login', { email, password }).then((res) => res.data ),

  register: ({ email, password, name }) =>
    api.post('/auth/register', { email, password, name }).then((res) => res.data),
}
