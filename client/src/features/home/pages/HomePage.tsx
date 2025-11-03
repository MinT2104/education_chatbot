import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Auto redirect to chat page
    navigate('/home/app', { replace: true })
  }, [navigate])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Home</h1>
      <p>Welcome to Education Chat Bot</p>
      <p className="mt-4 text-gray-600">Redirecting to chat...</p>
    </div>
  )
}

export default HomePage


