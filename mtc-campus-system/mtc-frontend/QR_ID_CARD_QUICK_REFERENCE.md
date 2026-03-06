# QR ID Card System - Quick Reference Guide

## 🎯 Quick Start

### 1. View Student QR Code
- Navigate to **Students** page
- Click the **Camera** icon (View QR Code) in any student row
- QR code modal opens showing:
  - Student's QR code
  - Student number
  - Full name
  - Department
  - Download button

### 2. Preview ID Card
- Click the **Camera** icon (View ID Card) in any student row
- ID card preview modal shows:
  - Vertical ID card layout
  - Horizontal ID card layout
  - Download as PNG button
  - Download as PDF button
  - Print button

### 3. Scan QR Code
- Click the **Scan QR Code** button (if available)
- Allow camera access when prompted
- Position QR code within the scanning frame
- Wait for successful scan (3 seconds simulation)
- View scanned student information

## 📱 Component Usage

### QRCodeDisplay Component
```tsx
import { QRCodeDisplay } from '@/components/qr-codes';

<QRCodeDisplay 
  data={{
    student_number: 'STU2024001',
    full_name: 'John Doe',
    department: 'EDUCATION',
    institution: 'Mutare Teachers College',
  }}
  size={256}
  includeDownload
/>
```

### IDCardPreview Component
```tsx
import { IDCardPreview } from '@/components/qr-codes';

<IDCardPreview 
  student={{
    student_number: 'STU2024001',
    full_name: 'John Doe',
    department: 'EDUCATION',
    year_of_study: 2,
    photo_url: null,
    qr_code_url: null,
  }}
  variant="vertical"
  showActions
/>
```

### QRScanner Component
```tsx
import { QRScanner } from '@/components/qr-codes';

const handleScan = (data) => {
  console.log('Scanned:', data);
  // Process: data.student_number, data.full_name, etc.
};

<QRScanner 
  onScan={handleScan}
  showPreview
/>
```

## 🔧 API Integration

### Fetch Student QR Code
```typescript
import { getStudentQRCode } from '@/services/studentApi';

const qrData = await getStudentQRCode(studentId);
// Returns: { student_number, full_name, department, qr_code_url, qr_data }
```

### Download QR Code
```typescript
import { downloadStudentQRCode } from '@/services/studentApi';

await downloadStudentQRCode(studentId);
// Downloads: qr_{student_number}.png
```

### Upload Student Photo
```typescript
import { uploadStudentPhoto } from '@/services/studentApi';

const fileInput = document.querySelector('input[type="file"]');
const photoFile = fileInput.files[0];

await uploadStudentPhoto(studentId, photoFile);
// Returns: { message, photo_url, id_card_ready }
```

### Generate ID Card PDF
```typescript
import { downloadStudentIDCard } from '@/services/studentApi';

await downloadStudentIDCard(studentId);
// Downloads: id_card_{student_number}.pdf
```

### Generate Multiple ID Cards
```typescript
import { downloadMultipleIDCards } from '@/services/studentApi';

await downloadMultipleIDCards([1, 2, 3]);
// Downloads: student_id_cards.pdf
```

## 📋 Features Checklist

### QR Code Features
- ✅ Auto-generation on student creation
- ✅ Contains: Institution | Student Number | Name | Department
- ✅ High error correction (Level H)
- ✅ SVG format for quality
- ✅ Downloadable as PNG
- ✅ Displays with student info

### ID Card Features
- ✅ Professional MTC branding
- ✅ Gradient purple background
- ✅ Student photo integration
- ✅ QR code embedding
- ✅ Vertical & horizontal layouts
- ✅ Export as PNG
- ✅ Export as PDF
- ✅ Print functionality
- ✅ Responsive design

### QR Scanner Features
- ✅ Camera access
- ✅ Back camera preference
- ✅ Scanning frame overlay
- ✅ Animation effect
- ✅ Success/error states
- ✅ Permission handling
- ✅ Data parsing
- ✅ Timestamp tracking

## 🎨 Customization

### QR Code Size
```tsx
<QRCodeDisplay size={128} />   {/* Small */}
<QRCodeDisplay size={256} />   {/* Medium */}
<QRCodeDisplay size={512} />   {/* Large */}
```

### ID Card Variant
```tsx
<IDCardPreview variant="vertical" />    {/* Portrait */}
<IDCardPreview variant="horizontal" />  {/* Landscape */}
```

### Show/Hide Actions
```tsx
<IDCardPreview showActions={true} />   {/* Show download/print buttons */}
<IDCardPreview showActions={false} />  {/* Preview only */}
```

## ⚠️ Important Notes

### Photo Requirements
- Passport-style photograph
- White or light background
- Clear face visibility
- JPG or PNG format
- Recommended size: 300x400 pixels

### QR Code Data Format
```
INSTITUTION|STUDENT_NUMBER|FULL_NAME|DEPARTMENT
```
Example:
```
Mutare Teachers College|STU2024001|John Doe|EDUCATION
```

### Browser Permissions
- Camera access required for scanning
- HTTPS required in production
- User consent mandatory

### File Downloads
- QR codes save as PNG
- ID cards save as PDF or PNG
- Browser download location depends on settings

## 🐛 Troubleshooting

### QR Code Not Showing
- Check if student has been created
- Verify backend generated QR code
- Check network connectivity
- Refresh page

### ID Card Photo Not Loading
- Ensure photo is uploaded
- Check CORS settings
- Verify photo URL accessibility
- Clear browser cache

### Camera Not Working
- Grant camera permissions
- Check browser settings
- Ensure HTTPS connection
- Try different browser

### Download Fails
- Check popup blocker
- Verify API endpoint availability
- Check storage space
- Try different browser

## 📊 Testing Steps

1. **Test QR Code Display**
   ```
   - Open Students page
   - Click View QR Code on any student
   - Verify QR code displays
   - Click Download QR Code
   - Verify PNG downloads
   ```

2. **Test ID Card Preview**
   ```
   - Open Students page
   - Click View ID Card on any student
   - Verify both layouts display
   - Test Download PNG
   - Test Download PDF
   - Test Print function
   ```

3. **Test QR Scanner**
   ```
   - Open QR Scanner modal
   - Allow camera access
   - Verify camera feed shows
   - Wait for simulated scan
   - Verify scan result displays
   ```

4. **Test API Integration**
   ```
   - Create new student in backend
   - Verify QR code auto-generates
   - Upload student photo
   - Generate ID card PDF
   - Download and verify outputs
   ```

## 🚀 Performance Tips

1. **Lazy Load Libraries**
   - QR code libraries load on demand
   - PDF generation loads when needed
   - Reduces initial bundle size

2. **Image Optimization**
   - Compress photos before upload
   - Use appropriate image sizes
   - Implement caching strategies

3. **Batch Operations**
   - Use bulk ID card generation for multiple students
   - Process downloads sequentially
   - Show progress indicators

## 📞 Support

For issues or questions:
1. Check this reference guide
2. Review component documentation
3. Check browser console for errors
4. Verify backend API status
5. Contact system administrator

---

**Last Updated**: 2026-03-06  
**Version**: 1.0  
**Stage**: 9 Complete ✅
