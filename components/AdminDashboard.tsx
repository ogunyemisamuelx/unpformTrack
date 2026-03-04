'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { format } from 'date-fns'
import Link from 'next/link'

type User = {
  id: string
  name: string
  email: string
  isActive: boolean
  avatarUrl: string | null
  createdAt: Date
  _count: {
    documentPairs: number
  }
}

export default function AdminDashboard({ users }: { users: User[] }) {
  const [showActiveOnly, setShowActiveOnly] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesActive = !showActiveOnly || user.isActive
    return matchesSearch && matchesActive
  })

  const activeCount = users.filter(u => u.isActive).length
  const inactiveCount = users.filter(u => !u.isActive).length
  const totalDocuments = users.reduce((sum, u) => sum + u._count.documentPairs, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-blue to-primary-red text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-100 mt-1 text-sm sm:text-base">Staff Management & Monitoring</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="bg-white text-primary-blue px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">Active Staff</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{activeCount}</p>
              </div>
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-blue-200 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <p className="text-red-100 text-xs sm:text-sm font-medium">Inactive Staff</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{inactiveCount}</p>
              </div>
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-red-200 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <p className="text-green-100 text-xs sm:text-sm font-medium">Total Staff</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{users.length}</p>
              </div>
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-green-200 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm font-medium">Total Documents</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{totalDocuments}</p>
              </div>
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-purple-200 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                showActiveOnly
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showActiveOnly ? 'Active Only' : 'Show All'}
            </button>
          </div>
        </div>

        {/* Staff List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`card hover:shadow-xl transition-all ${!user.isActive ? 'opacity-75' : ''}`}
            >
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 border-2 border-gray-200">
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-base sm:text-xl font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-xl font-bold text-gray-800 flex items-center gap-2 flex-wrap">
                      <span className="truncate">{user.name}</span>
                      {!user.isActive && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full flex-shrink-0">
                          Inactive
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm truncate">{user.email}</p>
                    <p className="text-gray-500 text-xs mt-1 hidden sm:block">
                      Joined: {format(new Date(user.createdAt), 'PPP')}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {user._count.documentPairs}
                  </div>
                  <div className="text-xs text-gray-500">Docs</div>
                </div>
              </div>

              <Link href={`/admin/staff/${user.id}`}>
                <button className="w-full btn-primary mt-3 sm:mt-4 text-sm sm:text-base py-2 sm:py-3">
                  View Profile
                </button>
              </Link>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No staff found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>
    </div>
  )
}
