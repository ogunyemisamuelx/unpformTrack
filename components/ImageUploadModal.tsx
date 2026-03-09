'use client'

import { useState, useRef } from 'react'

type Props = {
  onClose: () => void
  onSuccess: () => void
}

type CapturedImage = {
  blob: Blob
  preview: string
}

export default function ImageUploadModal({ onClose, onSuccess }: Props) {
  const [step, setStep] = useState<'method' | 'front' | 'back' | 'review'>('method')
  const [uploadMethod, setUploadMethod] = useState<'camera' | 'file' | null>(null)
  const [frontImage, setFrontImage] = useState<CapturedImage | null>(null)
  const [backImage, setBackImage] = useState<CapturedImage | null>(null)
  const [reference, setReference] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.')
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(video, 0, 0)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const preview = URL.createObjectURL(blob)
          
          if (step === 'front') {
            setFrontImage({ blob, preview })
            stopCamera()
            setStep('back')
            // Restart camera for back side capture
            setTimeout(startCamera, 100)
          } else if (step === 'back') {
            setBackImage({ blob, preview })
            stopCamera()
            setStep('review')
          }
        }
      }, 'image/jpeg', 0.9)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const preview = URL.createObjectURL(file)
      
      if (step === 'front') {
        setFrontImage({ blob: file, preview })
        setStep('back')
      } else if (step === 'back') {
        setBackImage({ blob: file, preview })
        setStep('review')
      }
    }
  }

  const handleMethodSelect = (method: 'camera' | 'file') => {
    setUploadMethod(method)
    setStep('front')
    if (method === 'camera') {
      setTimeout(startCamera, 100)
    }
  }

  const handleUpload = async () => {
    if (!frontImage || !backImage) return

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('frontImage', frontImage.blob)
      formData.append('backImage', backImage.blob)
      formData.append('reference', reference.trim())

      const response = await fetch('/api/upload-pair', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      onSuccess()
    } catch (err) {
      setError('Failed to upload images. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    stopCamera()
    if (frontImage) URL.revokeObjectURL(frontImage.preview)
    if (backImage) URL.revokeObjectURL(backImage.preview)
    onClose()
  }

  const handleRetake = (side: 'front' | 'back') => {
    if (side === 'front') {
      if (frontImage) URL.revokeObjectURL(frontImage.preview)
      setFrontImage(null)
      setStep('front')
      if (uploadMethod === 'camera') {
        setTimeout(startCamera, 100)
      }
    } else {
      if (backImage) URL.revokeObjectURL(backImage.preview)
      setBackImage(null)
      setStep('back')
      if (uploadMethod === 'camera') {
        setTimeout(startCamera, 100)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div className="flex-1 mr-2">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Upload Shipping Form</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {step === 'method' && 'Choose upload method'}
                {step === 'front' && 'Step 1: FRONT of form'}
                {step === 'back' && 'Step 2: BACK of form'}
                {step === 'review' && 'Review both sides'}
              </p>
            </div>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Indicator */}
          {step !== 'method' && (
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                frontImage ? 'bg-green-500 text-white' : step === 'front' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {frontImage ? '✓' : '1'}
              </div>
              <div className="w-8 sm:w-12 h-1 bg-gray-300"></div>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                backImage ? 'bg-green-500 text-white' : step === 'back' || step === 'review' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {backImage ? '✓' : '2'}
              </div>
            </div>
          )}

          {/* Method Selection */}
          {step === 'method' && (
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={() => handleMethodSelect('camera')}
                className="w-full btn-primary flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 text-sm sm:text-base"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Take Photos with Camera
              </button>

              <button
                onClick={() => handleMethodSelect('file')}
                className="w-full btn-secondary flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 text-sm sm:text-base"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload from Gallery
              </button>
            </div>
          )}

          {/* Camera View - Front */}
          {step === 'front' && uploadMethod === 'camera' && !frontImage && (
            <div>
              <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-semibold text-sm sm:text-base">
                  📄 Capture FRONT side
                </p>
              </div>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg mb-3 sm:mb-4"
              />
              <canvas ref={canvasRef} className="hidden" />
              <button onClick={capturePhoto} className="w-full btn-primary text-sm sm:text-base py-3">
                Capture Front
              </button>
            </div>
          )}

          {/* Camera View - Back */}
          {step === 'back' && uploadMethod === 'camera' && !backImage && (
            <div>
              <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-semibold text-sm sm:text-base">
                  📄 Capture BACK side
                </p>
              </div>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg mb-3 sm:mb-4"
              />
              <canvas ref={canvasRef} className="hidden" />
              <button onClick={capturePhoto} className="w-full btn-primary text-sm sm:text-base py-3">
                Capture Back
              </button>
            </div>
          )}

          {/* File Upload */}
          {(step === 'front' || step === 'back') && uploadMethod === 'file' && (
            <div>
              <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-semibold text-sm sm:text-base">
                  {step === 'front' ? '📄 Select FRONT side' : '📄 Select BACK side'}
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full btn-primary py-8 sm:py-12 border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100"
              >
                <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-blue-700 font-semibold text-sm sm:text-base">
                  Choose {step === 'front' ? 'Front' : 'Back'} Image
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Review Both Images */}
          {step === 'review' && frontImage && backImage && (
            <div className="space-y-3 sm:space-y-4">
              {/* Reference/Note Input */}
              <div>
                <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name or Reference <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  id="reference"
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g., John Doe, PKG-12345, USA Shipment"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add a note to easily find this document later
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {/* Front Preview */}
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-blue-600 text-xs sm:text-sm">Front</h3>
                    <button
                      onClick={() => handleRetake('front')}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-800"
                    >
                      Retake
                    </button>
                  </div>
                  <img src={frontImage.preview} alt="Front" className="w-full rounded-lg border-2 border-blue-500" />
                </div>

                {/* Back Preview */}
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-red-600 text-xs sm:text-sm">Back</h3>
                    <button
                      onClick={() => handleRetake('back')}
                      className="text-xs sm:text-sm text-red-600 hover:text-red-800"
                    >
                      Retake
                    </button>
                  </div>
                  <img src={backImage.preview} alt="Back" className="w-full rounded-lg border-2 border-red-500" />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base py-3"
              >
                {loading ? 'Uploading...' : 'Upload Document (Front & Back)'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
