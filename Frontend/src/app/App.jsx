import { RouterProvider } from 'react-router'
import { router } from './app.routes.jsx'
import { useAuthHook } from '../features/auth/hooks/useAuthHook.js';
import { useEffect } from 'react';

const App = () => {

  const { handleGetMe } = useAuthHook();

  useEffect(() => {
    handleGetMe()
  }, [])
  

  return (
    <RouterProvider router={router}/>
  )
}

export default App
