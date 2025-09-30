"use client"

import React, { useEffect, useState } from 'react'
import { getUserProfile, UserProfile } from '../actions/profile.action'

const Page = () => {
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
        <div>
            {JSON.stringify(data)}
        </div>
    )
}

export default Page