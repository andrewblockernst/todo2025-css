import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function useTabs() {
  const [tabs, setTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('today');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTabs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/tabs`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      
      const data = await response.json();
      setTabs(data.tabs || []);
      setActiveTab(data.activeTab || 'today');
    } catch (err) {
      console.error('Error al cargar pestañas:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar pestañas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabs();
  }, []);

  const changeActiveTab = async (tab: string) => {
    try {
      const response = await fetch(`${API_URL}/api/tabs`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tab })
      });
      
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      
      setActiveTab(data.activeTab);
    } catch (err) {
      console.error('Error al cambiar pestaña:', err);
      setError(err instanceof Error ? err.message : 'Error al cambiar pestaña');
    }
  };

  const addTab = async (name: string) => {
    if (!name.trim() || tabs.includes(name.trim())) return;
    
    try {
      const response = await fetch(`${API_URL}/api/tabs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      
      setTabs(prev => [...prev, data.tab]);
      setActiveTab(data.tab);
    } catch (err) {
      console.error('Error al añadir pestaña:', err);
      setError(err instanceof Error ? err.message : 'Error al añadir pestaña');
    }
  };

  return {
    tabs,
    activeTab,
    loading,
    error,
    setActiveTab: changeActiveTab,
    addTab,
    fetchTabs
  };
}