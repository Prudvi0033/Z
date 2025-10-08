'use client'
import React, { useEffect, useState } from 'react'
import { getAllUsers, toggleFollow } from '../actions/follow.action'
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface Users {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  description: string | null;
  isFollowing: boolean;
  _count: {
    posts: number;
    following: number;
    followers: number;
  };
}

const Followers = () => {
    const [loading, setLoading] = useState(false)
    const [followLoading, setFollowLoading] = useState<string | null>(null)
    const [people, setPeople] = useState<Users[]>([])

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                setLoading(true)
                const res = await getAllUsers()
                if(res.success && res.users){
                    setPeople(res.users)
                }
                else {
                    console.log(res.error);
                }
            } catch (error) {
                console.log("Error in fetching people", error);
            }
            finally {
                setLoading(false)
            }
        }

        fetchAllUsers()
    }, [])

    const handleFollow = async (userId: string) => {
        try {
            setFollowLoading(userId)
            const res = await toggleFollow(userId)
            
            if (res.success) {
                setPeople(prevPeople => 
                    prevPeople.map(user => 
                        user.id === userId 
                            ? { 
                                ...user, 
                                isFollowing: res.action === 'followed'
                              }
                            : user
                    )
                )
            } else {
                console.error(res.error)
            }
        } catch (error) {
            console.error("Error toggling follow:", error)
        } finally {
            setFollowLoading(null)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-2 flex justify-center items-center min-h-[400px]">
                <p className="text-neutral-400">Loading users...</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {people.map((user) => (
                    <div 
                        key={user.id} 
                        className="bg-neutral-900/30 rounded-md shadow-[inset_0.0005px_0.005px_2px_#525252] p-6 border border-neutral-900"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full overflow-hidden mb-6 bg-gray-200">
                                {user.image ? (
                                    <Image 
                                        src={user.image} 
                                        alt={user.name || 'User'} 
                                        className="w-full h-full object-cover"
                                        width={100}
                                        height={100}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-600">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>

                            <h3 className="text-[16px] text-white font-semibold text-center mb-1">
                                {user.name || 'Anonymous'}
                            </h3>
                            <p className="text-[12px] text-neutral-600 mb-4">
                                @{user.email?.split("@")[0]}
                            </p>


                            <button
                                onClick={() => handleFollow(user.id)}
                                disabled={followLoading === user.id}
                                className={`w-full px-4 py-2 rounded-4xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.02)] border border-neutral-900 hover:scale-95 cursor-pointer`}
                            >
                                {followLoading === user.id 
                                    ? <div className='w-full flex items-center justify-center'><Loader2 size={20} className='animate-spin'/></div>
                                    : user.isFollowing 
                                        ? 'Following' 
                                        : 'Follow'
                                }
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Followers