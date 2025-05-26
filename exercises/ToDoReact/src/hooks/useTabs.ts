import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '../store/clientStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4321'

export const tabKeys = {
  all: ['tabs'] as const,
}

const fetchTabs = async (): Promise<{ tabs: string[]; activeTab: string }> => {
  const response = await fetch(`${API_URL}/api/tabs`)
  if (!response.ok) throw new Error(`Error: ${response.status}`)
  return response.json()
}

const addTabAPI = async (name: string): Promise<{ tab: string }> => {
  const response = await fetch(`${API_URL}/api/tabs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!response.ok) throw new Error(`Error: ${response.status}`)
  return response.json()
}

export const useTabs = () => {
  return useQuery({
    queryKey: tabKeys.all,
    queryFn: fetchTabs,
  })
}

export const useAddTab = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useNotifications()
  
  return useMutation({
    mutationFn: addTabAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tabKeys.all })
      showSuccess('New tab!', 'More jobs to do!')
    },
    onError: (error) => {
      showError('¡No tab added!', `${error.message}`)
    },
  })
}