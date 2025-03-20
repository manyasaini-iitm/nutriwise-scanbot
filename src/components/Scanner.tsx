
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, ArrowRight, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { scanBarcode, extractIngredients, getProductInfo } from "@/utils/scanner";

interface ScannerProps {
  onScanComplete?: (productData: any) => void;
}

const Scanner = ({ onScanComplete }: ScannerProps) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<'barcode' | 'ingredient'>('barcode');
  const [isScanAnimating, setIsScanAnimating] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  
  // Start scan animation when camera is active
  useEffect(() => {
    if (isCameraActive) {
      setIsScanAnimating(true);
    } else {
      setIsScanAnimating(false);
    }
  }, [isCameraActive]);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast({
        title: "Camera Access Error",
        description: "Please make sure your camera is enabled and you've granted permission.",
        variant: "destructive",
      });
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };
  
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to data URL
    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
    
    // Stop the camera
    stopCamera();
    setIsCapturing(false);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCapturedImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const resetCapture = () => {
    setCapturedImage(null);
    setIsProcessing(false);
  };
  
  const processCapturedImage = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate processing time with buffer
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let productData;
      
      if (scanMode === 'barcode') {
        // Process barcode
        const barcode = await scanBarcode(capturedImage);
        productData = await getProductInfo(barcode);
      } else {
        // Process ingredients
        const ingredients = await extractIngredients(capturedImage);
        productData = {
          name: 'Unknown Product',
          brand: 'Unknown Brand',
          ingredients,
          nutritionalInfo: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            sugar: 0,
            sodium: 0
          }
        };
      }
      
      // Store product data in session storage
      sessionStorage.setItem('scannedProduct', JSON.stringify(productData));
      
      // Call callback if provided
      if (onScanComplete) {
        onScanComplete(productData);
      }
      
      // Navigate to results
      navigate('/results');
      
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="w-full max-w-md mx-auto glass-card p-6 animate-fade-in">
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-lg border border-border p-1">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              scanMode === 'barcode' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-foreground/60 hover:text-foreground'
            }`}
            onClick={() => setScanMode('barcode')}
          >
            Barcode Scan
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              scanMode === 'ingredient' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-foreground/60 hover:text-foreground'
            }`}
            onClick={() => setScanMode('ingredient')}
          >
            Ingredient Scan
          </button>
        </div>
      </div>
      
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-muted mb-4">
        {isCameraActive ? (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
            onLoadedMetadata={() => videoRef.current?.play()}
          />
        ) : capturedImage ? (
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Scan className="w-12 h-12 mb-4 text-muted-foreground opacity-70" />
            <h3 className="text-lg font-medium mb-2">
              {scanMode === 'barcode' ? 'Scan Product Barcode' : 'Scan Ingredient List'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {scanMode === 'barcode' 
                ? 'Position the barcode in the center of the viewfinder to scan' 
                : 'Capture a clear image of the ingredient list for analysis'}
            </p>
          </div>
        )}
        
        {/* Scan animation overlay */}
        {isCameraActive && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="relative w-full h-full">
              {/* Scanner frame corners */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary rounded-br-lg"></div>
              
              {/* Horizontal scan line */}
              {isScanAnimating && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-[2px] bg-primary/60 animate-[scan-line_2s_ease-in-out_infinite]"></div>
                </div>
              )}
              
              {/* Laser dots */}
              {isScanAnimating && (
                <>
                  <div className="absolute left-0 top-1/2 w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                  <div className="absolute right-0 top-1/2 w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Processing overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p className="text-sm font-medium animate-pulse">Processing...</p>
            </div>
          </div>
        )}
        
        {/* Hidden canvas for capturing image */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="space-y-3">
        {capturedImage ? (
          <div className="flex flex-col gap-3">
            <Button
              onClick={processCapturedImage}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Processing...
                </span>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
            <Button
              onClick={resetCapture}
              variant="outline"
              className="w-full"
              disabled={isProcessing}
            >
              Retake
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {isCameraActive ? (
              <Button
                onClick={captureImage}
                disabled={isCapturing}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
              >
                <Camera className="h-4 w-4" />
                <span>Capture</span>
              </Button>
            ) : (
              <Button
                onClick={startCamera}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
              >
                <Camera className="h-4 w-4" />
                <span>Open Camera</span>
              </Button>
            )}
            
            <div className="relative">
              <Button
                onClick={triggerFileInput}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Image</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            
            {isCameraActive && (
              <Button
                onClick={stopCamera}
                variant="ghost"
                className="w-full"
              >
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;
