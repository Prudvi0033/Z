"use client"

import React, { useEffect, useState } from "react"
import { getUserProfile, UserProfile } from "../actions/profile.action"
import { Bitcount_Grid_Double } from "next/font/google"
import Image from "next/image"

const bit = Bitcount_Grid_Double({ subsets: ["latin"] })

export const Profile = () => {
  const [data, setData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const result = await getUserProfile()
      setData(result.profile)
      setLoading(false)
    }
    fetchProfile()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="w-[42rem] h-screen border-r border-l border-neutral-700 overflow-y-auto">
      
    </div>
  )
}

export default Profile
