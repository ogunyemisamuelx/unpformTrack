'use client'

import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import Image from 'next/image'

type Staff = {
  id: string
  name: string
  email: string
  isActive: boolean
  avatarUrl: string | null
  createdAt: Date
  documentPairs: Array<{
    id: string
    frontImageUrl: string
    backImageUrl: string
    uploadedAt: Date
  }>
}

export default function StaffProfileView({ staff }: { staff: Staff }) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-blue to-primary-red text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button - Top Left */}
          <div className="flex justify-start mb-4">
            <button
              onClick={() => router.push('/admin')}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>

          {/* Centered Profile Section */}
          <div className="flex flex-col items-center text-center">
            {/* Avatar - Centered */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg flex-shrink-0 mb-4">
              {staff.avatarUrl ? (
                <Image
                  src={staff.avatarUrl}
                  alt={staff.name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">
                    {staff.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            {/* Name - Centered */}
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold">
                {staff.name}
              </h1>
              {!staff.isActive && (
                <span className="text-sm bg-red-500 px-3 py-1 rounded-full">
                  Inactive
                </span>
              )}
            </div>

            {/* Email - Centered */}
            <p className="text-blue-100 text-lg mb-1">{staff.email}</p>
            
            {/* Join Date */}
            <p className="text-blue-200 text-sm">
              Joined: {format(new Date(staff.createdAt), 'MMMM d, yyyy')}
            </p>

            {/* Staff Role Badge */}
            <div className="mt-2">
              <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-medium">
                Logistics Staff
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Shipping Forms ({staff.documentPairs.length})
          </h2>
          {staff.isActive ? (
            <p className="text-gray-600">
              All documents uploaded by {staff.name.split(' ')[0]}
            </p>
          ) : (
            <p className="text-red-600">
              This staff member is no longer active, but their documents are preserved.
            </p>
          )}
        </div>

        {/* Document Gallery - Paired View */}
        {staff.documentPairs.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No documents uploaded yet</h3>
            <p className="text-gray-500">
              {staff.isActive 
                ? `${staff.name.split(' ')[0]} hasn't uploaded any shipping forms yet.`
                : 'This staff member did not upload any documents.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {staff.documentPairs.map((pair) => (
              <div key={pair.id} className="card">
                {/* Date Header */}
                <div className="mb-4 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold">{format(new Date(pair.uploadedAt), 'MMMM d, yyyy')}</span>
                    <span className="text-gray-400">•</span>
                    <span>{format(new Date(pair.uploadedAt), 'h:mm a')}</span>
                  </div>
                </div>

                {/* Front & Back Side by Side - ALWAYS 2 columns */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {/* Front Image */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Front Side
                      </h4>
                    </div>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 border-2 border-blue-200 hover:border-blue-400 transition-colors group">
                      <Image
                        src={pair.frontImageUrl}
                        alt="Front of form"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Back Image */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-red-600 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Back Side
                      </h4>
                    </div>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 border-2 border-red-200 hover:border-red-400 transition-colors group">
                      <Image
                        src={pair.backImageUrl}
                        alt="Back of form"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Dashboard Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  )
}
