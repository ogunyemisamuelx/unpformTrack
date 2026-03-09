"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { format } from "date-fns";
import Image from "next/image";
import ImageUploadModal from "./ImageUploadModal";
import AvatarUploadModal from "./AvatarUploadModal";
import CoverPhotoUploadModal from "./CoverPhotoUploadModal";
import EditNameModal from "./EditNameModal";

type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  coverPhotoUrl: string | null;
  documentPairs: Array<{
    id: string;
    frontImageUrl: string;
    backImageUrl: string;
    reference: string | null;
    uploadedAt: Date;
  }>;
};

export default function ProfileClient({ user }: { user: User }) {
  const router = useRouter();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showCoverPhotoModal, setShowCoverPhotoModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    router.refresh();
  };

  const handleAvatarSuccess = () => {
    setShowAvatarModal(false);
    router.refresh();
  };

  const handleCoverPhotoSuccess = () => {
    setShowCoverPhotoModal(false);
    router.refresh();
  };

  const handleNameSuccess = () => {
    setShowEditNameModal(false);
    router.refresh();
  };

  // Filter documents based on search term
  const filteredDocuments = user.documentPairs.filter((pair) => {
    if (!searchTerm) return true;

    const search = searchTerm.toLowerCase();
    const reference = pair.reference?.toLowerCase() || "";
    const date = format(
      new Date(pair.uploadedAt),
      "MMMM d, yyyy",
    ).toLowerCase();

    return reference.includes(search) || date.includes(search);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="relative bg-white shadow-lg">
        {/* Cover Photo Section */}
        <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-primary-blue to-primary-red">
          {user.coverPhotoUrl ? (
            <Image
              src={user.coverPhotoUrl}
              alt="Cover photo"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
          )}
          
          {/* Edit Cover Button - Inside cover photo area, bottom right */}
          <button
            onClick={() => setShowCoverPhotoModal(true)}
            className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-2 shadow-md text-sm"
            title="Change cover photo"
          >
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
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="hidden sm:inline">Edit cover photo</span>
            <span className="sm:hidden">Edit</span>
          </button>
        </div>

        {/* Profile Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Avatar - Centered and overlapping cover photo */}
            <div className="flex justify-center">
              <div className="relative -mt-16 sm:-mt-20">
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
                  className="absolute bottom-0 right-0 bg-white text-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
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
            </div>

            {/* Sign Out Button - Top Right Corner */}
            <div className="absolute top-0 right-0 -mt-16 sm:-mt-20">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="bg-white text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-md text-sm border border-gray-200"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Profile Info - Centered below avatar */}
          <div className="flex flex-col items-center text-center pb-6 pt-4">
            {/* Name with Edit Button */}
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user.name}</h1>
              <button
                onClick={() => setShowEditNameModal(true)}
                className="text-gray-600 hover:text-gray-800 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
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

            {/* Email */}
            <p className="text-gray-600 text-base sm:text-lg mb-2">{user.email}</p>

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
        {/* Header with Upload Button */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
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

        {/* Search Bar */}
        {user.documentPairs.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by customer name, reference, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                  title="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-600 mt-2">
                Found {filteredDocuments.length}{" "}
                {filteredDocuments.length === 1 ? "document" : "documents"}
              </p>
            )}
          </div>
        )}

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
        ) : filteredDocuments.length === 0 ? (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No documents found
            </h3>
            <p className="text-gray-500">Try a different search term</p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 text-blue-600 hover:text-blue-800 font-semibold"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDocuments.map((pair) => (
              <div key={pair.id} className="card">
                {/* Date Header */}
                <div className="mb-4 pb-3 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
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

      {/* Cover Photo Upload Modal */}
      {showCoverPhotoModal && (
        <CoverPhotoUploadModal
          onClose={() => setShowCoverPhotoModal(false)}
          onSuccess={handleCoverPhotoSuccess}
        />
      )}
    </div>
  );
}
