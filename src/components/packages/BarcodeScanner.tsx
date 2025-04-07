'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScanLine, Camera, XCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

type BarcodeScannerProps = {
  onScanSuccess: (barcode: string) => void;
  onScanError?: (error: string) => void;
  className?: string;
};

export default function BarcodeScanner({ 
  onScanSuccess, 
  onScanError,
  className = '' 
}: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  // Use a unique ID for each scanner instance to prevent conflicts
  const scannerContainerId = useRef(`barcode-scanner-container-${Math.random().toString(36).substring(2, 11)}`).current;
  const isMountedRef = useRef(true);
  const hasCleanedUp = useRef(false);

  // Improved cleanup function that can be called directly
  const cleanupScanner = async () => {
    // If already cleaned up, do nothing
    if (hasCleanedUp.current) return;
    
    if (scannerRef.current) {
      try {
        // Check if scanner is running before attempting to stop
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        // Mark as cleaned up
        hasCleanedUp.current = true;
      } catch (error) {
        console.error('Error during scanner cleanup:', error);
      }
    }
  };

  // Clean up scanner on unmount
  useEffect(() => {
    // Set mounted ref
    isMountedRef.current = true;
    hasCleanedUp.current = false;
    
    return () => {
      // Mark component as unmounted
      isMountedRef.current = false;
      // Ensure scanner is properly cleaned up
      cleanupScanner();
    };
  }, []);

  const startScanner = async () => {
    if (!isMountedRef.current) return;
    
    setError(null);
    setIsScanning(true);
    hasCleanedUp.current = false;
    
    try {
      // Ensure we have camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop stream after permission check
      
      if (!isMountedRef.current) return;
      setPermissionGranted(true);
      
      // Make sure the container exists before initializing
      const container = document.getElementById(scannerContainerId);
      if (!container) {
        throw new Error('Scanner container not found');
      }
      
      const html5QrCode = new Html5Qrcode(scannerContainerId);
      scannerRef.current = html5QrCode;
      
      const qrConfig = { 
        fps: 10, 
        qrbox: { width: 200, height: 200 },
        aspectRatio: window.innerWidth < 768 ? 1.7 : 1.0, // Adjust aspect ratio for mobile
      };
      
      // Ensure the component is still mounted before continuing
      if (!isMountedRef.current) {
        await cleanupScanner();
        return;
      }
      
      await html5QrCode.start(
        { facingMode: 'environment' }, 
        qrConfig,
        (decodedText) => {
          // Only process scan if component is mounted
          if (isMountedRef.current) {
            handleScanSuccess(decodedText);
          }
        },
        (errorMessage) => {
          // Only process error if component is mounted
          if (isMountedRef.current) {
            handleScanError(errorMessage);
          }
        }
      );
    } catch (err) {
      console.error('Error starting scanner:', err);
      // Only update state if component is mounted
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
        setError(errorMessage);
        setIsScanning(false);
        if (onScanError) onScanError(errorMessage);
      }
    }
  };

  const stopScanner = async () => {
    if (!isMountedRef.current) return;
    
    // Always set scanning state to false to ensure UI is updated
    setIsScanning(false);
    
    // Then clean up the scanner
    await cleanupScanner();
  };

  const handleScanSuccess = (decodedText: string) => {
    // Stop scanning after successful scan
    stopScanner();
    
    // Call the onScanSuccess callback with the barcode
    onScanSuccess(decodedText);
  };

  const handleScanError = (errorMessage: string) => {
    // We don't set error here because these are typically non-fatal errors
    // that occur during scanning (nothing found in frame, etc)
    console.log('Scan error:', errorMessage);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-1">Please ensure camera permissions are granted and try again.</p>
        </div>
      )}
      
      {!isScanning ? (
        <Button onClick={startScanner} className="mb-4 flex items-center">
          <ScanLine className="mr-2 h-4 w-4" />
          Scanner un colis
        </Button>
      ) : (
        <Button 
          onClick={stopScanner} 
          variant="outline" 
          className="mb-4 flex items-center"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Arrêter le scan
        </Button>
      )}

      <div 
        id={scannerContainerId} 
        className={`relative rounded-lg overflow-hidden ${isScanning ? 'block' : 'hidden'}`} 
        style={{ 
          width: '100%', 
          maxWidth: '350px', 
          height: '220px',
          maxHeight: '40vh',
          margin: '0 auto'
        }}
      >
        {isScanning && !permissionGranted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
            <Camera className="h-12 w-12 text-gray-400 animate-pulse" />
            <p className="text-sm text-gray-500 mt-4 text-center px-4">Demande d'accès à la caméra...</p>
          </div>
        )}
      </div>
      
      {!isScanning && (
        <div className="text-center text-sm text-muted-foreground mt-2">
          <p>Utilisez la caméra pour scanner un code-barres ou un QR code.</p>
          <p className="mt-1">Assurez-vous que le code est bien éclairé et centré.</p>
        </div>
      )}
    </div>
  );
} 