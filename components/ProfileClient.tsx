"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { format } from "date-fns";
import Image from "next/image";
import ImageUploadModal from "./ImageUploadModal";
import AvatarUploadModal from "./AvatarUploadModal";
import EditNameModal from "./EditNameModal";

type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  documentPairs: Array<{
    id: string;
    frontImageUrl: string;
    backImageUrl: string;
    uploadedAt: Date;
  }>;
};

export default function ProfileClient({ user }: { user: User }) {
  const router = useRouter();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    router.refresh();
  };

  const handleAvatarSuccess = () => {
    setShowAvatarModal(false);
    router.refresh();
  };

  const handleNameSuccess = () => {
    setShowEditNameModal(false);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-blue to-primary-red text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Sign Out Button - Top Right */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-white text-primary-blue px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Centered Profile Section */}
          <div className="flex flex-col items-center text-center">
            {/* Profile Avatar - Centered */}
            <div className="relative group mb-4">
              <div
                className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg cursor-pointer"
                onClick={() => setShowAvatarModal(true)}
              >
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowAvatarModal(true)}
                className="absolute bottom-0 right-0 bg-white text-primary-blue rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                title="Change avatar"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Name - Centered with Edit Button */}
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <button
                onClick={() => setShowEditNameModal(true)}
                className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-colors"
                title="Edit name"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>

            {/* Email - Centered */}
            <p className="text-blue-100 text-lg">{user.email}</p>

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
        {/* Upload Button */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Shipping Forms ({user.documentPairs.length})
          </h2>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary flex items-center gap-2 text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6 w-full sm:w-auto justify-center"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="whitespace-nowrap">Upload New Form</span>
          </button>
        </div>

        {/* Document Gallery - Paired View */}
        {user.documentPairs.length === 0 ? (
          <div className="card text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No forms uploaded yet
            </h3>
            <p className="text-gray-500">
              Click "Upload New Form" to add your first shipping document
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {user.documentPairs.map((pair) => (
              <div key={pair.id} className="card">
                {/* Date Header */}
                <div className="mb-4 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-semibold">
                      {format(new Date(pair.uploadedAt), "MMMM d, yyyy")}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>{format(new Date(pair.uploadedAt), "h:mm a")}</span>
                  </div>
                </div>

                {/* Front & Back Side by Side - ALWAYS 2 columns */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {/* Front Image */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
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
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
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
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <ImageUploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <AvatarUploadModal
          onClose={() => setShowAvatarModal(false)}
          onSuccess={handleAvatarSuccess}
        />
      )}

      {/* Edit Name Modal */}
      {showEditNameModal && (
        <EditNameModal
          currentName={user.name}
          onClose={() => setShowEditNameModal(false)}
          onSuccess={handleNameSuccess}
        />
      )}
    </div>
  );
}
