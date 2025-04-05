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
  const scannerContainerId = 'barcode-scanner-container';

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        stopScanner();
      }
    };
  }, [isScanning]);

  const startScanner = async () => {
    setError(null);
    setIsScanning(true);
    
    try {
      // Ensure we have camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop stream after permission check
      setPermissionGranted(true);
      
      const html5QrCode = new Html5Qrcode(scannerContainerId);
      scannerRef.current = html5QrCode;
      
      const qrConfig = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };
      
      await html5QrCode.start(
        { facingMode: 'environment' }, 
        qrConfig,
        handleScanSuccess,
        handleScanError
      );
    } catch (err) {
      console.error('Error starting scanner:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
      setError(errorMessage);
      setIsScanning(false);
      if (onScanError) onScanError(errorMessage);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        // Check if the scanner is truly running before trying to stop it
        const isScanning = scannerRef.current.isScanning;
        
        if (isScanning) {
          await scannerRef.current.stop();
        }
        // Always update the UI state regardless of whether stop succeeded
        setIsScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
        // Force update the UI state even if the stop failed
        setIsScanning(false);
      }
    } else {
      // If scanner reference doesn't exist, just update UI state
      setIsScanning(false);
    }
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
        style={{ width: '100%', maxWidth: '400px', height: '300px' }}
      >
        {isScanning && !permissionGranted && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Camera className="h-12 w-12 text-gray-400 animate-pulse" />
            <p className="text-sm text-gray-500 mt-4">Demande d'accès à la caméra...</p>
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