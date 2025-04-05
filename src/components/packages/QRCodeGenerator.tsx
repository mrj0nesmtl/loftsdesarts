'use client';

import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download, Printer, Share2 } from 'lucide-react';

type QRCodeGeneratorProps = {
  value: string;
  packageId: string;
  size?: number;
  className?: string;
};

export default function QRCodeGenerator({
  value,
  packageId,
  size = 200,
  className = '',
}: QRCodeGeneratorProps) {
  const [mounted, setMounted] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if Web Share API is available 
    // Using explicit feature detection instead of checking the property existence
    setCanShare(typeof navigator !== 'undefined' && 
                'share' in navigator && 
                typeof navigator.share === 'function');
  }, []);

  // Function to download QR code as PNG
  const downloadQRCode = () => {
    const canvas = document.getElementById('package-qr-code') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `package-qr-${packageId}.png`;
      
      // Safer approach: use the click() method without DOM manipulation
      link.style.display = 'none';
      document.body.appendChild(link);
      
      try {
        link.click();
      } catch (error) {
        console.error('Error triggering download:', error);
      } finally {
        // Set a timeout before removing to ensure the click has time to process
        setTimeout(() => {
          if (link.parentNode === document.body) {
            document.body.removeChild(link);
          }
        }, 100);
      }
    }
  };

  // Function to print QR code
  const printQRCode = () => {
    const printWindow = window.open('', '', 'height=500,width=500');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Package QR Code</title>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<h1 style="text-align: center;">Code QR pour le colis</h1>');
      printWindow.document.write('<div style="text-align: center;">');
      printWindow.document.write(`<p>ID du colis: ${packageId}</p>`);
      
      // Get canvas data URL and create image
      const canvas = document.getElementById('package-qr-code') as HTMLCanvasElement;
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        printWindow.document.write(`<img src="${dataUrl}" />`);
      }
      
      printWindow.document.write('<p style="margin-top: 20px;">Présentez ce code lors de la récupération de votre colis.</p>');
      printWindow.document.write('</div>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  // Function to share QR code (if Web Share API is available)
  const shareQRCode = async () => {
    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
      alert('Votre navigateur ne prend pas en charge le partage.');
      return;
    }

    const canvas = document.getElementById('package-qr-code') as HTMLCanvasElement;
    if (canvas) {
      try {
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
          }, 'image/png');
        });

        const file = new File([blob], `package-qr-${packageId}.png`, { type: 'image/png' });

        await navigator.share({
          title: 'Code QR de votre colis',
          text: 'Voici le code QR à présenter pour récupérer votre colis.',
          files: [file],
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  // Only render on client-side to prevent hydration issues
  if (!mounted) return null;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="bg-white p-4 rounded-md shadow-sm mb-4">
        <QRCodeCanvas
          id="package-qr-code"
          value={value}
          size={size}
          level="H"
          includeMargin={true}
        />
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={downloadQRCode} 
          className="flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          Télécharger
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={printQRCode} 
          className="flex items-center"
        >
          <Printer className="mr-2 h-4 w-4" />
          Imprimer
        </Button>
        
        {canShare && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={shareQRCode} 
            className="flex items-center"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Partager
          </Button>
        )}
      </div>
    </div>
  );
} 