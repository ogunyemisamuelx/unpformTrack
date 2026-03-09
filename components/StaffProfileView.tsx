'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import Image from 'next/image'

type Staff = {
  id: string
  name: string
  email: string
  isActive: boolean
  avatarUrl: string | null
  coverPhotoUrl: string | null
  createdAt: Date
  documentPairs: Array<{
    id: string
    frontImageUrl: string
    backImageUrl: string
    reference: string | null
    uploadedAt: Date
  }>
}

export default function StaffProfileView({ staff }: { staff: Staff }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter document pairs based on search term
  const filteredPairs = staff.documentPairs.filter((pair) => {
    if (!searchTerm) return true

    const search = searchTerm.toLowerCase()
    const reference = (pair.reference || '').toLowerCase()
    const date = format(new Date(pair.uploadedAt), 'PPP').toLowerCase()

    return reference.includes(search) || date.includes(search)
  })

  const handleDeleteClick = (docId: string) => {
    setDeletingDocId(docId)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingDocId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/delete-document?id=${deletingDocId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }

      // Close modal and refresh page
      setDeleteModalOpen(false)
      setDeletingDocId(null)
      router.refresh()
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Failed to delete document. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setDeletingDocId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="relative bg-white shadow-lg">
        {/* Cover Photo Section */}
        <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-primary-blue to-primary-red">
          {staff.coverPhotoUrl ? (
            <Image
              src={staff.coverPhotoUrl}
              alt="Cover photo"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
          )}
          
          {/* Back Button - Top Left inside cover */}
          <div className="absolute top-4 left-4">
            <button
              onClick={() => router.push('/admin')}
              className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-md transition-colors flex items-center gap-2 shadow-md font-medium text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Profile Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Avatar - Centered and overlapping cover photo */}
            <div className="flex justify-center">
              <div className="relative -mt-16 sm:-mt-20">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg flex-shrink-0">
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
              </div>
            </div>
          </div>

          {/* Profile Info - Centered below avatar */}
          <div className="flex flex-col items-center text-center pb-6 pt-4">
            {/* Name with status */}
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {staff.name}
              </h1>
              {!staff.isActive && (
                <span className="text-sm bg-red-500 text-white px-3 py-1 rounded-full">
                  Inactive
                </span>
              )}
            </div>

            {/* Email */}
            <p className="text-gray-600 text-base sm:text-lg mb-2">{staff.email}</p>
            
            {/* Join Date */}
            <p className="text-gray-500 text-sm mb-2">
              Joined {format(new Date(staff.createdAt), 'MMMM d, yyyy')}
            </p>

            {/* Staff Role Badge */}
            <div>
              <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium">
                Logistics Staff
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-6">
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

        {/* Search Bar */}
        {staff.documentPairs.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by customer name, tracking number, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-600">
                Found {filteredPairs.length} of {staff.documentPairs.length} document{filteredPairs.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

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
        ) : filteredPairs.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No matching documents</h3>
            <p className="text-gray-500">
              Try adjusting your search term to find what you're looking for.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPairs.map((pair) => (
              <div key={pair.id} className="card relative">
                {/* Delete Button - Top Right */}
                <button
                  onClick={() => handleDeleteClick(pair.id)}
                  className="absolute top-4 right-4 bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors group"
                  title="Delete this document"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                {/* Date Header */}
                <div className="mb-4 pb-3 border-b border-gray-200 pr-12">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold">{format(new Date(pair.uploadedAt), 'MMMM d, yyyy')}</span>
                      <span className="text-gray-400">•</span>
                      <span>{format(new Date(pair.uploadedAt), 'h:mm a')}</span>
                    </div>
                    {pair.reference && (
                      <div className="flex items-center gap-2 text-gray-700 sm:ml-auto">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                          {pair.reference}
                        </span>
                      </div>
                    )}
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Delete Document</h3>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this document? This action cannot be undone and will permanently remove both the front and back images.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
