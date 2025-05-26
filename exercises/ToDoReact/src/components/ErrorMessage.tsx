import React from 'react'

interface ErrorMessageProps {
  error: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center text-red-600">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    </div>
  )
}

export default ErrorMessage