'use client';

import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FiDownload, FiPrinter, FiUser } from 'react-icons/fi';

export interface StudentData {
  id?: number;
  student_number: string;
  full_name: string;
  department: string;
  year_of_study?: number | string;
  photo_url?: string | null;
  qr_code_url?: string | null;
  email?: string;
  phone_number?: string;
}

interface IDCardPreviewProps {
  student: StudentData;
  variant?: 'vertical' | 'horizontal';
  showActions?: boolean;
  className?: string;
}

export const IDCardPreview: React.FC<IDCardPreviewProps> = ({
  student,
  variant = 'vertical',
  showActions = true,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const getDepartmentShortName = (dept: string): string => {
    const deptMap: Record<string, string> = {
      EDUCATION: 'EDU',
      SCIENCE: 'SCI',
      ARTS: 'ARTS',
      COMMERCE: 'COMM',
    };
    return deptMap[dept.toUpperCase()] || dept.substring(0, 4).toUpperCase();
  };

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `id_card_${student.student_number}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    } catch (error) {
      console.error('Error generating PNG:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: variant === 'vertical' ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = variant === 'vertical' ? 60 : 100;
      const imgHeight = variant === 'vertical' ? 95 : 60;
      
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`id_card_${student.student_number}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !cardRef.current) return;

    const cardContent = cardRef.current.outerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ID Card - ${student.student_number}</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            @media print {
              body { 
                margin: 0; 
                padding: 0; 
              }
            }
          </style>
        </head>
        <body>
          ${cardContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ID Card Preview */}
      <div className="flex justify-center">
        <div
          ref={cardRef}
          className={`bg-white shadow-xl rounded-lg overflow-hidden border-2 border-primary-600 ${
            variant === 'vertical' ? 'w-[300px]' : 'w-[400px]'
          }`}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          {/* Header */}
          <div className="bg-white/95 px-4 py-3 text-center">
            <h1 className="text-sm font-bold text-primary-800">MUTARE TEACHERS COLLEGE</h1>
            <p className="text-xs text-text-muted mt-0.5">Student Identification Card</p>
          </div>

          {/* Card Body */}
          <div
            className={`${variant === 'vertical' ? 'p-4' : 'p-3'} ${
              variant === 'vertical' ? '' : 'flex gap-3'
            }`}
          >
            {variant === 'vertical' ? (
              // Vertical Layout
              <div className="space-y-3">
                {/* Photo */}
                <div className="flex justify-center">
                  <div className="relative w-28 h-32 bg-white rounded-lg shadow-md overflow-hidden border-2 border-primary-300">
                    {student.photo_url ? (
                      <img
                        src={student.photo_url}
                        alt={student.full_name}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <FiUser className="text-4xl opacity-50" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Student Info */}
                <div className="text-center space-y-1">
                  <h2 className="text-base font-bold text-white">{student.full_name}</h2>
                  <Badge variant="info" size="sm" className="bg-white/90">
                    {student.student_number}
                  </Badge>
                  <div className="text-xs text-white/90 space-y-0.5">
                    <p>{getDepartmentShortName(student.department)} - {student.department}</p>
                    <p>Year {student.year_of_study || 'N/A'}</p>
                  </div>
                </div>

                {/* QR Code */}
                {student.qr_code_url && (
                  <div className="flex justify-center pt-2">
                    <div className="bg-white p-2 rounded-lg">
                      <img
                        src={student.qr_code_url}
                        alt="QR Code"
                        className="w-20 h-20 object-contain"
                        crossOrigin="anonymous"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Horizontal Layout
              <>
                {/* Left Side - Photo */}
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-28 bg-white rounded-lg shadow-md overflow-hidden border-2 border-primary-300">
                    {student.photo_url ? (
                      <img
                        src={student.photo_url}
                        alt={student.full_name}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <FiUser className="text-3xl opacity-50" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Info */}
                <div className="flex-1 space-y-2">
                  <div>
                    <h2 className="text-sm font-bold text-white">{student.full_name}</h2>
                    <Badge variant="info" size="sm" className="bg-white/90 mt-1">
                      {student.student_number}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-white/90 space-y-1">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-sm" />
                      <span>{student.department}</span>
                    </div>
                    <p>Year {student.year_of_study || 'N/A'}</p>
                  </div>

                  {student.qr_code_url && (
                    <div className="pt-1">
                      <img
                        src={student.qr_code_url}
                        alt="QR Code"
                        className="w-16 h-16 object-contain bg-white p-1 rounded"
                        crossOrigin="anonymous"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-white/95 px-4 py-2 text-center">
            <p className="text-xs text-text-muted">
              This card is property of MTC • If found, please return
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex justify-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadPNG}
            leftIcon={<FiDownload />}
            disabled={isGenerating}
          >
            Download PNG
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadPDF}
            leftIcon={<FiPrinter />}
            disabled={isGenerating}
          >
            Download PDF
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrint}
            leftIcon={<FiPrinter />}
            disabled={isGenerating}
          >
            Print
          </Button>
        </div>
      )}
    </div>
  );
};

export default IDCardPreview;
