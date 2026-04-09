import api from '../api/axios'

export const goalsService = {

  getGoals: ({ token }) => 
    api.get('/goals', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => res.data ?? []),

  createGoal: ({ token, goalData }) => 
    api.post('/goals', goalData, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => res.data ?? null),


  deleteGoal: ({ token, goalId }) => 
    api.delete(`/goals/${goalId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => res.data ?? null),
}