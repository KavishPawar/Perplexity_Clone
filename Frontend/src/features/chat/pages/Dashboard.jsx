import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useChatHook } from '../hooks/useChatHook'

const Dashboard = () => {
    const chat = useChatHook();

    const { user } = useSelector(state => state.auth)
    console.log(user)
    
    useEffect(() => {
        chat.initializeSocketConnection()
    }, [])

  return (
    <div>
      {user? <h1>Dashboard</h1>:<h2>Not User Found !</h2>}
    </div>
  )
}

export default Dashboard
