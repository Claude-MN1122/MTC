# Stage 9 - QR ID Card System Demo Guide 🎓

## 🎬 Feature Demonstrations

This guide walks you through each feature of the QR ID Card system with step-by-step instructions.

---

## 1️⃣ Viewing Student QR Code

### Scenario
You need to view and download a student's QR code for verification purposes.

### Steps

1. **Navigate to Students Page**
   ```
   Dashboard → Students
   ```

2. **Find the Student**
   - Use search or filters to locate the student
   - Example: Search "Tinashe" or filter by "Active" status

3. **Open QR Code Modal**
   - Click the **Camera icon** (View QR Code) in the Actions column
   - Modal opens showing:
     ```
     ┌─────────────────────────────┐
     │  Student QR Code         ✕  │
     ├─────────────────────────────┤
     │                             │
     │    ████████  ████████      │
     │    ██  ██  ██  ██  ██      │
     │    ████████  ████████      │
     │    ██  ██  ██  ██  ██      │
     │    ████████  ████████      │
     │                             │
     │   Tinashe Moyo              │
     │   STU-2024-001              │
     │   Education                 │
     │                             │
     │  [Download QR Code]         │
     │                             │
     │  ℹ️ This QR code contains   │
     │  student information for    │
     │  quick verification.        │
     └─────────────────────────────┘
     ```

4. **Download QR Code**
   - Click "Download QR Code" button
   - File saves as: `qr_STU-2024-001.png`
   - Open to verify quality

5. **Close Modal**
   - Click X or press ESC
   - Returns to students list

### Expected Result
✅ High-quality QR code displays  
✅ Student information shown below QR  
✅ Download works correctly  
✅ QR code scans successfully  

---

## 2️⃣ Previewing ID Card

### Scenario
You want to preview and download a student's ID card before printing.

### Steps

1. **Navigate to Students Page**
   ```
   Dashboard → Students
   ```

2. **Select Student**
   - Find desired student in list
   - Click the second **Camera icon** (View ID Card)

3. **View Vertical ID Card**
   ```
   ┌──────────────────────────────────┐
   │  ID Card Preview             ✕  │
   ├──────────────────────────────────┤
   │                                  │
   │  Vertical ID Card                │
   │  ┌────────────────────┐          │
   │  │ MUTARE TEACHERS    │          │
   │  │ COLLEGE            │          │
   │  │ Student ID Card    │          │
   │  ├────────────────────┤          │
   │  │   ┌──────────┐     │          │
   │  │   │  PHOTO   │     │          │
   │  │   │          │     │          │
   │  │   └──────────┘     │          │
   │  │   Tinashe Moyo     │          │
   │  │   [STU-2024-001]   │          │
   │  │   EDU - Education  │          │
   │  │   Year 1           │          │
   │  │   [QR CODE]        │          │
   │  ├────────────────────┤          │
   │  │ Property of MTC •  │          │
   │  │ If found, return   │          │
   │  └────────────────────┘          │
   │                                  │
   │  [PNG] [PDF] [Print]            │
   └──────────────────────────────────┘
   ```

4. **Download as PNG**
   - Click "Download PNG" button
   - Wait for generation (1-2 seconds)
   - File saves as: `id_card_STU-2024-001.png`

5. **View Horizontal Layout**
   - Scroll down to see horizontal version
   - Same information, different layout
   - Landscape orientation

6. **Download as PDF**
   - Click "Download PDF" button
   - PDF generates in A4 format
   - File saves as: `id_card_STU-2024-001.pdf`

7. **Print ID Card**
   - Click "Print" button
   - Print dialog opens
   - Select printer and settings
   - Print on card stock or paper

### Expected Result
✅ Professional design with branding  
✅ Both layouts display correctly  
✅ PNG download works  
✅ PDF download works  
✅ Print function opens dialog  

---

## 3️⃣ Scanning QR Code

### Scenario
A student needs to be verified at the dining hall entrance.

### Steps

1. **Open QR Scanner**
   - Click "Scan QR Code" button (if available in header)
   - OR navigate to scanning page

2. **Scanner Modal Opens**
   ```
   ┌─────────────────────────────┐
   │  📷 QR Code Scanner     ✕  │
   ├─────────────────────────────┤
   │                             │
   │  ┌───────────────────┐      │
   │  │                   │      │
   │  │   [CAMERA FEED]   │      │
   │  │                   │      │
   │  │   ┌─────────┐     │      │
   │  │   │ FRAME   │     │      │
   │  │   │ HERE    │     │      │
   │  │   └─────────┘     │      │
   │  │                   │      │
   │  │  Position QR code │      │
   │  │  within the frame │      │
   │  │                   │      │
   │  └───────────────────┘      │
   │                             │
   │  [Start Scanning]           │
   └─────────────────────────────┘
   ```

3. **Grant Camera Permission**
   - Browser prompts for camera access
   - Click "Allow"
   - Camera feed appears

4. **Position QR Code**
   - Hold student's QR code (phone or printed)
   - Center within scanning frame
   - Keep steady

5. **Wait for Scan**
   - Scanning line animates up/down
   - After 3 seconds (simulated):
   ```
   ┌─────────────────────────────┐
   │  ✅ Scanned Successfully!   │
   │  12:34:56 PM                │
   ├─────────────────────────────┤
   │  Student Number:            │
   │  STU-2024-001               │
   │                             │
   │  Full Name:                 │
   │  Tinashe Moyo               │
   │                             │
   │  Department: [Education]    │
   │  Institution: Mutare...     │
   │                             │
   │  [Scan Another]             │
   └─────────────────────────────┘
   ```

6. **Verify Student**
   - Check name matches student
   - Verify department if needed
   - Grant access or process meal

7. **Scan Next Student**
   - Click "Scan Another"
   - Repeat from step 4

### Expected Result
✅ Camera activates  
✅ Scanning frame visible  
✅ Animation works smoothly  
✅ Scan result displays  
✅ Information accurate  

---

## 4️⃣ Bulk ID Card Generation

### Scenario
You need to generate ID cards for all first-year students.

### Steps

1. **Filter Students**
   - Go to Students page
   - Filter by Year: "1"
   - All first-years display

2. **Select Multiple Students** (Future Feature)
   - Check boxes next to names
   - OR use "Select All" checkbox

3. **Bulk Action** (When Implemented)
   - Click "Generate ID Cards" button
   - System processes all selected students
   - Progress indicator shows status

4. **Download PDF**
   - Single PDF with all ID cards
   - Each card on separate section
   - Ready for printing and cutting

### Expected Result
✅ All selected students included  
✅ Consistent formatting  
✅ Printable layout  
✅ Reasonable file size  

---

## 5️⃣ Photo Upload Integration

### Scenario
A new student has submitted their passport photo.

### Steps

1. **Navigate to Student Detail**
   - Find student in list
   - Click "View Details" (eye icon)
   - Student detail modal opens

2. **Upload Photo** (Backend Integration Required)
   - Click "Upload Photo" button
   - Select image file
   - Confirm upload

3. **Preview ID Card**
   - Open ID Card Preview
   - Photo now appears on card
   - QR code auto-generated

4. **Generate Final ID Card**
   - Download as PDF
   - Print on card stock
   - Distribute to student

### Expected Result
✅ Photo uploads successfully  
✅ Displays on ID card  
✅ QR code present  
✅ Professional appearance  

---

## 🎨 Design Specifications

### ID Card Dimensions

**Vertical Layout:**
```
Width: 300px (85.6mm - credit card width)
Height: 475px (credit card height scaled)
Aspect Ratio: 0.635
```

**Horizontal Layout:**
```
Width: 400px
Height: 250px
Aspect Ratio: 1.6
```

### Color Scheme

```css
Primary Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Header Background: rgba(255, 255, 255, 0.95)
Text Primary: #1a202c
Text Secondary: #4a5568
Text Muted: #718096
Border: #e2e8f0
```

### Typography

```
Institution: Bold, 14px (Vertical), 16px (Horizontal)
Student Name: Bold, 16px
Student ID: Medium, 12px, Monospace
Department: Regular, 11px
Footer: Regular, 9px
```

---

## 📸 Photo Requirements

### Technical Specifications

**Format:** JPG or PNG  
**Size:** Maximum 2MB  
**Dimensions:** 300x400 pixels recommended  
**Background:** White or light colored  
**Quality:** High resolution, clear face  

### Composition Guidelines

✅ **DO:**
- Face directly at camera
- Neutral expression or slight smile
- Eyes open and visible
- Good lighting, even exposure
- Professional attire

❌ **DON'T:**
- Wear hats or head coverings (unless religious)
- Use filters or heavy editing
- Include other people
- Poor lighting or shadows
- Casual selfies

---

## 🔍 Quality Assurance Checklist

### Before Printing ID Cards

- [ ] Photo is clear and professional
- [ ] Student name spelled correctly
- [ ] Student number accurate
- [ ] Department correct
- [ ] Year of study current
- [ ] QR code scans successfully
- [ ] Colors print correctly
- [ ] Card stock loaded
- [ ] Print settings correct

### After Printing

- [ ] Cut along guidelines
- [ ] Edges are clean
- [ ] Lamination applied (if using)
- [ ] Hole punch aligned (if needed)
- [ ] Lanyard attached securely

---

## 🚀 Performance Benchmarks

### Expected Load Times

| Action | Target | Acceptable |
|--------|--------|------------|
| QR Code Display | < 1s | < 2s |
| ID Card Preview | < 2s | < 3s |
| PNG Download | < 3s | < 5s |
| PDF Download | < 5s | < 10s |
| QR Scanner Start | < 2s | < 3s |
| Scan Processing | < 1s | < 2s |

### File Sizes

| Output | Typical Size |
|--------|--------------|
| QR Code PNG | 5-15 KB |
| ID Card PNG | 200-500 KB |
| ID Card PDF | 100-300 KB |
| Batch PDF (10) | 1-3 MB |

---

## 💡 Pro Tips

### For Best Results

1. **Photos**: Use professional passport photo service
2. **Printing**: Print on PVC card stock for durability
3. **Lamination**: Laminate cards for extended use
4. **QR Codes**: Test scan before mass production
5. **Backup**: Save digital copies of all ID cards

### Common Issues & Solutions

**Issue**: QR code won't scan  
**Solution**: Increase QR code size, ensure high contrast

**Issue**: Photo looks pixelated  
**Solution**: Use higher resolution source image

**Issue**: PDF too large  
**Solution**: Reduce image quality in settings

**Issue**: Colors look washed out  
**Solution**: Use CMYK color mode for printing

---

## 📞 Support & Training

### Staff Training Topics

1. How to view QR codes
2. How to generate ID cards
3. How to use QR scanner
4. Photo requirements
5. Printing procedures
6. Troubleshooting common issues

### Student Orientation

1. Where to find their QR code
2. How to use digital ID card
3. Where to get photos taken
4. Replacement card process
5. Lost card procedure

---

**Demo Version**: 1.0  
**Last Updated**: 2026-03-06  
**Stage**: 9 Complete ✅  
**Ready for Production**: Yes (with backend integration)
