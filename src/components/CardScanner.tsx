import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Camera, 
  Scan, 
  X, 
  Check, 
  AlertCircle, 
  Loader2,
  RefreshCw,
  Upload
} from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useToast } from '../hooks/useToast'
import { supabase } from '../lib/supabase'

interface CardDetails {
  player_name: string
  year: number
  set_name: string
  card_number: string
  grade_company: string
  grade: number
  estimated_value: number
  confidence: number
}

interface ScanResult {
  success: boolean
  card_details?: CardDetails
  confidence?: number
  error?: string
}

export default function CardScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      })
      
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setIsScanning(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      })
    }
  }, [toast])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsScanning(false)
    setCapturedImage(null)
  }, [stream])

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageDataUrl)
    stopCamera()
  }, [stopCamera])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive"
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setCapturedImage(result)
    }
    reader.readAsDataURL(file)
  }, [toast])

  const processImage = useCallback(async () => {
    if (!capturedImage) return

    setIsProcessing(true)
    
    try {
      // Get the current session for authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        throw new Error('Authentication required. Please log in.')
      }

      // Convert data URL to blob
      const response = await fetch(capturedImage)
      const blob = await response.blob()

      // Create FormData
      const formData = new FormData()
      formData.append('image', blob, 'card.jpg')

      // Call our edge function with proper authentication
      const { data, error } = await supabase.functions.invoke('card-scan', {
        body: formData,
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      const result: ScanResult = data

      if (result.success && result.card_details) {
        if (result.confidence && result.confidence < 0.7) {
          toast({
            title: "Low Confidence Scan",
            description: `Scan confidence: ${(result.confidence * 100).toFixed(1)}%. Please verify the details.`,
            variant: "destructive"
          })
        }

        setScanResult(result)
        setCardDetails(result.card_details)
        setShowConfirmDialog(true)
      } else {
        throw new Error(result.error || 'Failed to identify card')
      }
    } catch (error) {
      console.error('Error processing image:', error)
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Failed to process image. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }, [capturedImage, toast])

  const saveToInventory = useCallback(async () => {
    if (!cardDetails) return

    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('inventory')
        .insert({
          user_id: user.id,
          card_name: `${cardDetails.year} ${cardDetails.set_name} ${cardDetails.player_name}`,
          player_name: cardDetails.player_name,
          year: cardDetails.year,
          set_name: cardDetails.set_name,
          card_number: cardDetails.card_number,
          grade_company: cardDetails.grade_company,
          grade: cardDetails.grade,
          purchase_price: 0, // Will be updated later
          current_value: cardDetails.estimated_value,
          purchase_date: new Date().toISOString().split('T')[0],
          platform: 'Scanned',
          status: 'owned'
        })

      if (error) {
        throw error
      }

      toast({
        title: "Card Added",
        description: "Card has been successfully added to your inventory.",
      })

      // Reset state
      setShowConfirmDialog(false)
      setCapturedImage(null)
      setCardDetails(null)
      setScanResult(null)

    } catch (error) {
      console.error('Error saving to inventory:', error)
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save card to inventory.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [cardDetails, toast])

  const retryCapture = useCallback(() => {
    setCapturedImage(null)
    setScanResult(null)
    setCardDetails(null)
    startCamera()
  }, [startCamera])

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Card Scanner</h2>
            <p className="text-slate-400 mt-1">Scan baseball cards to automatically add them to your inventory</p>
          </div>
          <div className="flex items-center space-x-2">
            <Scan className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </motion.div>

      {/* Scanner Interface */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
      >
        <div className="flex flex-col items-center space-y-6">
          {!isScanning && !capturedImage && (
            <div className="text-center space-y-4">
              <div className="w-32 h-32 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-16 h-16 text-slate-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Scan</h3>
                <p className="text-slate-400 mb-6">Position your baseball card in good lighting for best results</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={startCamera} className="bg-gradient-to-r from-green-500 to-blue-500">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isScanning && (
            <div className="w-full max-w-2xl space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-auto rounded-lg border-2 border-green-500/50"
                />
                <div className="absolute inset-0 border-2 border-dashed border-green-400/50 rounded-lg pointer-events-none">
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-green-400"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-green-400"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-green-400"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-green-400"></div>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button onClick={captureImage} size="lg" className="bg-gradient-to-r from-green-500 to-blue-500">
                  <Camera className="w-5 h-5 mr-2" />
                  Capture
                </Button>
                <Button onClick={stopCamera} variant="outline" size="lg" className="border-slate-600 text-slate-300">
                  <X className="w-5 h-5 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="w-full max-w-2xl space-y-4">
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured card"
                  className="w-full h-auto rounded-lg border-2 border-slate-600"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p>Processing image...</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-center space-x-4">
                {!isProcessing && (
                  <>
                    <Button onClick={processImage} size="lg" className="bg-gradient-to-r from-green-500 to-blue-500">
                      <Scan className="w-5 h-5 mr-2" />
                      Scan Card
                    </Button>
                    <Button onClick={retryCapture} variant="outline" size="lg" className="border-slate-600 text-slate-300">
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Retake
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Card Identified</span>
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Please verify the card details before adding to inventory.
            </DialogDescription>
          </DialogHeader>

          {cardDetails && (
            <div className="space-y-4">
              {scanResult?.confidence && scanResult.confidence < 0.8 && (
                <div className="flex items-center space-x-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-orange-400">
                    Low confidence: {(scanResult.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="player_name" className="text-slate-300">Player Name</Label>
                  <Input
                    id="player_name"
                    value={cardDetails.player_name}
                    onChange={(e) => setCardDetails({...cardDetails, player_name: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="year" className="text-slate-300">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={cardDetails.year}
                    onChange={(e) => setCardDetails({...cardDetails, year: parseInt(e.target.value)})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="set_name" className="text-slate-300">Set Name</Label>
                  <Input
                    id="set_name"
                    value={cardDetails.set_name}
                    onChange={(e) => setCardDetails({...cardDetails, set_name: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="card_number" className="text-slate-300">Card Number</Label>
                  <Input
                    id="card_number"
                    value={cardDetails.card_number}
                    onChange={(e) => setCardDetails({...cardDetails, card_number: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="grade_company" className="text-slate-300">Grade Company</Label>
                  <Input
                    id="grade_company"
                    value={cardDetails.grade_company}
                    onChange={(e) => setCardDetails({...cardDetails, grade_company: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="grade" className="text-slate-300">Grade</Label>
                  <Input
                    id="grade"
                    type="number"
                    step="0.5"
                    value={cardDetails.grade}
                    onChange={(e) => setCardDetails({...cardDetails, grade: parseFloat(e.target.value)})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="estimated_value" className="text-slate-300">Estimated Value</Label>
                <Input
                  id="estimated_value"
                  type="number"
                  step="0.01"
                  value={cardDetails.estimated_value}
                  onChange={(e) => setCardDetails({...cardDetails, estimated_value: parseFloat(e.target.value)})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={saveToInventory}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-500 to-blue-500"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Add to Inventory
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}