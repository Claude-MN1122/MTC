'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { FiCamera, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';

interface ScannedData {
  student_number: string;
  full_name: string;
  department: string;
  institution: string;
  timestamp: Date;
}

interface QRScannerProps {
  onScan?: (data: ScannedData) => void;
  showPreview?: boolean;
  className?: string;
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  showPreview = true,
  className = '',
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Parse QR code data
  const parseQRCodeData = (qrString: string): ScannedData | null => {
    try {
      // Expected format: INSTITUTION|STUDENT_NUMBER|FULL_NAME|DEPARTMENT
      const parts = qrString.split('|');
      
      if (parts.length >= 4) {
        return {
          institution: parts[0],
          student_number: parts[1],
          full_name: parts[2],
          department: parts[3],
          timestamp: new Date(),
        };
      }
      
      // Try JSON format
      const jsonData = JSON.parse(qrString);
      if (jsonData.student_number && jsonData.full_name) {
        return {
          ...jsonData,
          timestamp: new Date(),
        };
      }
    } catch (e) {
      console.error('Error parsing QR code:', e);
    }
    
    return null;
  };

  const startScanning = async () => {
    setError(null);
    setScannedData(null);
    
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsScanning(true);
      setHasPermission(true);
      
      // Start scanning
      scanForQRCode();
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
      setError(
        err.name === 'NotAllowedError'
          ? 'Camera access denied. Please allow camera permissions.'
          : 'Unable to access camera. Please check your camera settings.'
      );
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    
    setIsScanning(false);
  };

  const scanForQRCode = () => {
    // This is a simplified version
    // In production, you would use a library like @ericblade/quagga2 or html5-qrcode
    // For now, we'll simulate a scan after 3 seconds
    
    setTimeout(() => {
      // Simulate successful scan
      const simulatedData = parseQRCodeData(
        'Mutare Teachers College|STU2024001|John Doe|EDUCATION'
      );
      
      if (simulatedData) {
        setScannedData(simulatedData);
        stopScanning();
        
        if (onScan) {
          onScan(simulatedData);
        }
      }
    }, 3000);
  };

  const resetScanner = () => {
    setScannedData(null);
    setError(null);
    startScanning();
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  if (!showPreview && !isScanning) {
    return (
      <Button
        variant="primary"
        onClick={startScanning}
        leftIcon={<FiCamera />}
        className={className}
      >
        Scan QR Code
      </Button>
    );
  }

  return (
    <Card padding="md" className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold text-text-primary flex items-center gap-2">
          <FiCamera className="text-xl" />
          QR Code Scanner
        </h3>
        {isScanning && (
          <Button variant="ghost" size="sm" onClick={stopScanning}>
            <FiX />
          </Button>
        )}
      </div>

      {/* Camera View */}
      {!scannedData && !error && (
        <div className="space-y-3">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {isScanning ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-primary-400 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary-500 -mt-0.5 -ml-0.5" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary-500 -mt-0.5 -mr-0.5" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary-500 -mb-0.5 -ml-0.5" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary-500 -mb-0.5 -mr-0.5" />
                    
                    {/* Scanning Line Animation */}
                    <div className="absolute left-0 right-0 h-0.5 bg-primary-500 animate-scan" />
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-white text-sm bg-black/50 px-4 py-2 rounded inline-block">
                    Position QR code within the frame
                  </p>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white">
                <FiCamera className="text-5xl mb-3 opacity-50" />
                <p className="text-body">Camera is off</p>
              </div>
            )}
          </div>

          {!isScanning && hasPermission !== false && (
            <Button
              variant="primary"
              onClick={startScanning}
              leftIcon={<FiCamera />}
              fullWidth
            >
              Start Scanning
            </Button>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiAlertCircle className="text-3xl text-error-500" />
          </div>
          <p className="text-body font-medium text-text-primary mb-2">
            {error}
          </p>
          <Button variant="primary" onClick={resetScanner}>
            Try Again
          </Button>
        </div>
      )}

      {/* Success State */}
      {scannedData && (
        <div className="space-y-4">
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiCheck className="text-3xl text-success-500" />
            </div>
            <h4 className="text-h4 font-bold text-text-primary mb-1">
              QR Code Scanned Successfully!
            </h4>
            <p className="text-small text-text-muted">
              {scannedData.timestamp.toLocaleTimeString()}
            </p>
          </div>

          {/* Student Info */}
          <Card padding="sm" variant="bordered" className="bg-surface">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-muted mb-1">Student Number</p>
                <p className="text-body font-mono font-medium text-text-primary">
                  {scannedData.student_number}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-text-muted mb-1">Full Name</p>
                <p className="text-body font-medium text-text-primary">
                  {scannedData.full_name}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-text-muted mb-1">Department</p>
                  <Badge variant="info" size="sm">
                    {scannedData.department}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-xs text-text-muted mb-1">Institution</p>
                  <p className="text-small text-text-primary truncate">
                    {scannedData.institution}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={resetScanner} fullWidth>
              Scan Another
            </Button>
          </div>
        </div>
      )}

      {/* Permission Denied */}
      {hasPermission === false && (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiAlertCircle className="text-3xl text-error-500" />
          </div>
          <p className="text-body font-medium text-text-primary mb-2">
            Camera access denied
          </p>
          <p className="text-small text-text-muted mb-4">
            Please enable camera permissions in your browser settings
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes scan {
          0%, 100% {
            transform: translateY(-120px);
          }
          50% {
            transform: translateY(120px);
          }
        }
        
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </Card>
  );
};

export default QRScanner;
