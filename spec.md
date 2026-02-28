# UpScale AI - Free Photo & Video Upscaler

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Photo upscaling: upload image, select scale factor (2x, 4x, 8x), apply browser-based upscaling using canvas bicubic interpolation + unsharp masking / sharpening filters
- Video upscaling: upload video, select scale factor, process frame-by-frame using canvas (Web Workers for performance), download result
- Before/after slider comparison for photos
- Download button for processed photo/video
- Processing progress bar for video
- File upload drag-and-drop zone supporting JPG, PNG, WEBP, MP4, MOV
- Settings panel: scale factor selector, sharpness slider, noise reduction toggle
- History of processed files stored in backend (file metadata only, blobs in blob-storage)
- Landing page with hero section explaining the tool

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: store upload/processing history records (filename, scale, timestamp, type photo/video)
2. Select blob-storage component for file uploads and processed output storage
3. Frontend: 
   - Landing/hero page with upload CTA
   - Drag-and-drop uploader (photo + video)
   - Photo processing: canvas bicubic + sharpen, before/after slider
   - Video processing: Web Worker frame-by-frame canvas processing with progress bar
   - Settings panel (scale factor 2x/4x/8x, sharpness, noise reduction)
   - Download processed file
   - Recent history list from backend
