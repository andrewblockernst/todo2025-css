// src/App.tsx
import Header from "./components/Header"
import TaskForm from "./components/TaskForm"
import TaskList from "./components/TaskList"
import TabList from "./components/TabList"
import FilterButtons from "./components/FilterButtons"
import Footer from "./components/Footer"
import LoadingSpinner from "./components/LoadingSpinner"
import ErrorMessage from "./components/ErrorMessage"
import NotificationSystem from "./components/NotificationSystem" // Nuevo
import { useTabs } from "./hooks/useTabs"

function App() {
  const { data: tabsData, isLoading, error } = useTabs()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage error={error.message} />
  }

  return (
    <div className="min-h-screen bg-[url('/img/wood-pattern.png')] flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto py-2 w-full">
        <div className="bg-orange-950 border-4 border-amber-200 rounded-lg overflow-hidden">
          <Header />
          <TaskForm />
          <TabList tabs={tabsData?.tabs || []} />
          <TaskList />
          <FilterButtons />
          <Footer />
        </div>
      </div>
      
      {/* Sistema de notificaciones */}
      <NotificationSystem />
    </div>
  )
}

export default App