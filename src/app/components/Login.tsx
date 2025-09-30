'use client'
import React, { useState, useEffect } from 'react'
import { signInWithGoogle, signOut, getSession, type User } from '../lib/auth-client'
import { useRouter } from 'next/navigation'

const Login = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const checkSession = async () => {
      const { user } = await getSession()
      setUser(user)
      setLoading(false)
    }
    checkSession()
  }, [])
  
  const handleSignOut = async () => {
    const { success } = await signOut()
    if (success) {
      setUser(null)
    }
  }
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  return (
    <div>
      <div>
      {user ? (
        <div>
          <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            {user.image && <img src={user.image} alt="Profile" />}
          </div>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={signInWithGoogle}>Sign In with Google</button>
      )}

    </div>
    <button onClick={() => router.push("/profile")}>Profile</button>
    </div>
  )
}

export default Login