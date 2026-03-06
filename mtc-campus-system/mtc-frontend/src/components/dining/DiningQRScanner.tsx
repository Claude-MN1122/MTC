'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import { FiCamera, FiX, FiCheck, FiAlertCircle, FiRefreshCw, FiWifi, FiWifiOff } from 'react-icons/fi';
import type { ScanResult, MealEligibility } from '@/services/diningApi';

interface DiningQRScannerProps {
  onScanComplete?: (result: ScanResult) => void;
  showPreview?: boolean;
  className?: string;
}

export const DiningQRScanner: React.FC<DiningQRScannerProps> = ({
  onScanComplete,
  showPreview = true,
  className = '',
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [mealType, setMealType] = useState<'BREAKFAST' | 'LUNCH' | 'DINNER'>('LUNCH');
  const [scannerDevice, setScannerDevice] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const startScanning = async () => {
    setError(null);
    setScannedData(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsScanning(true);
      setHasPermission(true);
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
    // Simulated scan - In production, integrate real QR library
    setTimeout(() => {
      const simulatedData: ScanResult = {
        success: true,
        message: 'Breakfast attendance recorded successfully',
        student: {
          id: 1,
          full_name: 'Tinashe Moyo',
          student_number: 'STU-2024-001',
        },
        meal_type: mealType,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        attendance_id: 123,
        eligibility: {
          student_number: 'STU-2024-001',
          full_name: 'Tinashe Moyo',
          is_eligible: true,
          has_accommodation: true,
          meals_consumed: {
            breakfast: false,
            lunch: false,
            dinner: false,
          },
          can_scan_breakfast: true,
          can_scan_lunch: true,
          can_scan_dinner: true,
        },
      };
      
      setScannedData(simulatedData);
      stopScanning();
      
      if (onScanComplete) {
        onScanComplete(simulatedData);
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

  return (
    <Card padding="md" className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold text-text-primary flex items-center gap-2">
          <FiCamera className="text-xl" />
          Dining Hall Scanner
        </h3>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge variant="success" size="sm">
              <FiWifi className="text-sm mr-1" />
              Online
            </Badge>
          ) : (
            <Badge variant="error" size="sm">
              <FiWifiOff className="text-sm mr-1" />
              Offline
            </Badge>
          )}
        </div>
      </div>

      {/* Meal Type Selection */}
      <div className="grid grid-cols-3 gap-2">
        {(['BREAKFAST', 'LUNCH', 'DINNER'] as const).map((meal) => (
          <button
            key={meal}
            onClick={() => setMealType(meal)}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              mealType === meal
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-surface text-text-secondary hover:bg-surface/80'
            }`}
          >
            {meal.charAt(0) + meal.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Scanner Device Input */}
      <Input
        type="text"
        placeholder="Scanner Device ID (optional)"
        value={scannerDevice}
        onChange={(e) => setScannerDevice(e.target.value)}
        label="Device Identifier"
      />

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
          <div className="flex gap-2 max-w-sm mx-auto">
            <Button variant="secondary" onClick={resetScanner} fullWidth>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Success State */}
      {scannedData && (
        <div className="space-y-4">
          <div className="text-center py-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
              scannedData.success ? 'bg-success-50' : 'bg-error-50'
            }`}>
              {scannedData.success ? (
                <FiCheck className="text-3xl text-success-500" />
              ) : (
                <FiAlertCircle className="text-3xl text-error-500" />
              )}
            </div>
            <h4 className={`text-h4 font-bold mb-1 ${
              scannedData.success ? 'text-text-primary' : 'text-text-primary'
            }`}>
              {scannedData.success ? 'Scan Successful!' : 'Scan Failed'}
            </h4>
            <p className="text-small text-text-muted">
              {new Date(scannedData.timestamp).toLocaleTimeString()}
            </p>
          </div>

          {/* Student Info */}
          {scannedData.student && (
            <Card padding="sm" variant="bordered" className="bg-surface">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-text-muted mb-1">Student Name</p>
                    <p className="text-body font-medium text-text-primary">
                      {scannedData.student.full_name}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Student Number</p>
                    <p className="text-body font-mono font-medium text-text-primary">
                      {scannedData.student.student_number}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-text-muted mb-1">Meal Type</p>
                    <Badge variant="info" size="sm">
                      {scannedData.meal_type}
                    </Badge>
                  </div>
                </div>

                {scannedData.eligibility && (
                  <div className="pt-3 border-t border-border-light">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant={scannedData.eligibility.is_eligible ? 'success' : 'error'} 
                        size="sm"
                      >
                        {scannedData.eligibility.is_eligible ? 'Eligible' : 'Not Eligible'}
                      </Badge>
                      {scannedData.eligibility.has_accommodation && (
                        <Badge variant="info" size="sm">Has Accommodation</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <Badge 
                        variant={scannedData.eligibility.meals_consumed.breakfast ? 'default' : 'success'} 
                        size="sm"
                      >
                        Breakfast
                      </Badge>
                      <Badge 
                        variant={scannedData.eligibility.meals_consumed.lunch ? 'default' : 'success'} 
                        size="sm"
                      >
                        Lunch
                      </Badge>
                      <Badge 
                        variant={scannedData.eligibility.meals_consumed.dinner ? 'default' : 'success'} 
                        size="sm"
                      >
                        Dinner
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

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

export default DiningQRScanner;
