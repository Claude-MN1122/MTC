'use client';

import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { FiDownload, FiImage, FiAlertCircle } from 'react-icons/fi';

export interface QRCodeData {
  student_number: string;
  full_name: string;
  department: string;
  institution: string;
  qr_code_url?: string;
}

interface QRCodeDisplayProps {
  data?: QRCodeData;
  size?: number;
  includeDownload?: boolean;
  showBorder?: boolean;
  className?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  data,
  size = 256,
  includeDownload = false,
  showBorder = true,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    if (!data) return;

    const svgElement = document.getElementById('qr-code-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, size, size);

        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `qr_${data.student_number}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (!data) {
    return (
      <Card padding="md" className={`flex items-center justify-center ${className}`}>
        <div className="text-center text-text-muted">
          <FiAlertCircle className="text-4xl mx-auto mb-2 opacity-50" />
          <p className="text-body">No QR code data available</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card padding="md" className={className}>
        <Skeleton variant="rectangular" width={`${size}px`} height={`${size}px`} />
      </Card>
    );
  }

  // Generate QR code string
  const qrString = `${data.institution}|${data.student_number}|${data.full_name}|${data.department}`;

  return (
    <Card 
      padding="md" 
      className={`inline-block ${showBorder ? 'border-2 border-primary-200' : ''} ${className}`}
    >
      <div className="space-y-4">
        {/* QR Code */}
        <div className="flex justify-center">
          <QRCodeSVG
            id="qr-code-svg"
            value={qrString}
            size={size}
            level="H"
            includeMargin={true}
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
        </div>

        {/* Student Info */}
        <div className="text-center space-y-1">
          <p className="text-small font-semibold text-text-primary">{data.full_name}</p>
          <p className="text-xs text-text-secondary font-mono">{data.student_number}</p>
          <p className="text-xs text-text-muted">{data.department}</p>
        </div>

        {/* Download Button */}
        {includeDownload && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            leftIcon={<FiDownload />}
            fullWidth
          >
            Download QR Code
          </Button>
        )}
      </div>
    </Card>
  );
};

export default QRCodeDisplay;
