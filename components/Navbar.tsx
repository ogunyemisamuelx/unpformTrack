'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Navbar() {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-primary-blue">
              Logistics Platform
            </Link>
            
            <div className="hidden md:flex gap-4">
              {session.user.isAdmin ? (
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-primary-blue font-medium transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-primary-blue font-medium transition-colors"
                >
                  My Profile
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {session.user.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
