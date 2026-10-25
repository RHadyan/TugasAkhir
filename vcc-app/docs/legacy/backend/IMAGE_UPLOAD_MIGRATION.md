# Image Upload Migration Documentation

## Overview

All image upload endpoints in the vccbe project have been migrated to use **FormData** with **ImageKit** integration, following the pattern from the besukma project.

## Changes Made

### 1. Countries API

#### POST `/api/countries`
- **Before**: Accepted JSON with `flagImage` as URL string
- **After**: Accepts FormData with `flagImage` as File object

**Example Usage:**
```javascript
const formData = new FormData();
formData.append('name', 'Japan');
formData.append('flagImage', fileObject); // File from input[type="file"]

const response = await fetch('/api/countries', {
  method: 'POST',
  body: formData, // Don't set Content-Type header, browser will set it automatically
});
```

#### PUT `/api/countries/[id]`
- **Before**: Accepted JSON with optional `flagImage` as URL string
- **After**: Accepts FormData with optional `flagImage` as File object

**Example Usage:**
```javascript
const formData = new FormData();
formData.append('name', 'Updated Japan');
// Only append flagImage if you want to update it
if (newFlagImageFile) {
  formData.append('flagImage', newFlagImageFile);
}

const response = await fetch('/api/countries/country-id', {
  method: 'PUT',
  body: formData,
});
```

### 2. Programs API

#### POST `/api/programs`
- **Before**: Accepted JSON with image URLs
- **After**: Accepts FormData with multiple image files

**Image Fields:**
- `thumbnail` - Single file (required)
- `objectiveLogos` - Multiple files (optional, for objectives array)
- `galleryImages` - Multiple files (optional, for gallery array)

**Example Usage:**
```javascript
const formData = new FormData();

// Basic fields
formData.append('title', 'Program Title');
formData.append('shortDescription', 'Short description');
formData.append('description', 'Full description');
formData.append('countryId', 'country-id-here');
formData.append('isPublished', 'true');

// Thumbnail image (required)
formData.append('thumbnail', thumbnailFile);

// JSON fields (must be stringified)
formData.append('eligibleStudyPrograms', JSON.stringify(['Program 1', 'Program 2']));

// Objectives with logos
const objectives = [
  { title: 'Objective 1', description: 'Description 1', logo: '' }, // logo will be filled by uploaded file
  { title: 'Objective 2', description: 'Description 2', logo: '' }
];
formData.append('objectives', JSON.stringify(objectives));

// Append objective logo files (in same order as objectives array)
formData.append('objectiveLogos', logoFile1);
formData.append('objectiveLogos', logoFile2);

// Schemes
const schemes = [
  { name: 'Scheme 1', description: 'Description 1' }
];
formData.append('schemes', JSON.stringify(schemes));

// Gallery with images
const gallery = [
  { title: 'Gallery 1', shortDescription: 'Desc 1', imageUrl: '' }, // imageUrl will be filled
  { title: 'Gallery 2', shortDescription: 'Desc 2', imageUrl: '' }
];
formData.append('gallery', JSON.stringify(gallery));

// Append gallery image files (in same order as gallery array)
formData.append('galleryImages', galleryImageFile1);
formData.append('galleryImages', galleryImageFile2);

// Additional section (optional)
formData.append('additionalSection', JSON.stringify({
  title: 'Additional Info',
  content: 'Content here'
}));

// Social media (optional)
formData.append('socialMedia', JSON.stringify({
  facebook: 'https://facebook.com/page',
  instagram: 'https://instagram.com/page'
}));

const response = await fetch('/api/programs', {
  method: 'POST',
  body: formData,
});
```

#### PUT `/api/programs/[id]`
- **Before**: Accepted JSON with image URLs
- **After**: Accepts FormData with optional image files

**Example Usage:**
```javascript
const formData = new FormData();

// Only append fields you want to update
formData.append('title', 'Updated Title');

// Only append new thumbnail if you want to change it
if (newThumbnailFile) {
  formData.append('thumbnail', newThumbnailFile);
}

// Update objectives with new logos
const objectives = [
  { title: 'Updated Objective 1', description: 'Updated Description 1', logo: 'existing-url' }
];
formData.append('objectives', JSON.stringify(objectives));

// Only append new logo files if you want to update them
if (newLogoFile) {
  formData.append('objectiveLogos', newLogoFile);
}

const response = await fetch('/api/programs/program-id', {
  method: 'PUT',
  body: formData,
});
```

## ImageKit Configuration

All uploaded images are:
1. Uploaded to ImageKit with organized folder structure:
   - Countries flags: `countries/flags/`
   - Program thumbnails: `programs/thumbnails/`
   - Program objectives: `programs/objectives/`
   - Program gallery: `programs/gallery/`

2. Optimized with transformations:
   - Quality: `auto` (automatic quality optimization)
   - Format: `webp` (modern image format)
   - Height: `1024px` (maximum height)

## Environment Variables Required

Make sure these are set in your `.env` file:

```env
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

## Important Notes

### For Frontend Developers:

1. **Content-Type Header**: Do NOT manually set `Content-Type` header when sending FormData. The browser will automatically set it to `multipart/form-data` with the correct boundary.

2. **JSON Fields**: All complex fields (arrays, objects) must be stringified using `JSON.stringify()` before appending to FormData.

3. **File Order**: When uploading multiple files (objectiveLogos, galleryImages), the order matters! Files are mapped to array items by index.

4. **Optional Images**: For PUT requests, only append image files if you want to update them. Existing URLs will be preserved if no new file is provided.

5. **File Input Example**:
```html
<input type="file" id="thumbnail" accept="image/*" />
<input type="file" id="logos" accept="image/*" multiple />

<script>
const thumbnailFile = document.getElementById('thumbnail').files[0];
const logoFiles = document.getElementById('logos').files;

const formData = new FormData();
formData.append('thumbnail', thumbnailFile);

// For multiple files
Array.from(logoFiles).forEach(file => {
  formData.append('objectiveLogos', file);
});
</script>
```

### For Backend Developers:

1. **File Validation**: Consider adding file size and type validation in the future.

2. **Error Handling**: ImageKit upload errors are caught and returned as 500 errors. Consider more specific error messages.

3. **Image Deletion**: When updating/deleting records, consider implementing cleanup of old images from ImageKit.

4. **Rate Limiting**: Consider implementing rate limiting for upload endpoints to prevent abuse.

## Migration Checklist

- [x] Update Countries POST endpoint
- [x] Update Countries PUT endpoint
- [x] Update Programs POST endpoint
- [x] Update Programs PUT endpoint
- [x] Add imageKit imports to all route files
- [x] Test environment variables are configured
- [ ] Update frontend forms to use FormData
- [ ] Test all upload endpoints
- [ ] Update API documentation
- [ ] Implement image cleanup on delete (future enhancement)

## Testing

### Test Countries Upload:
```bash
curl -X POST http://localhost:3000/api/countries \
  -F "name=Test Country" \
  -F "flagImage=@/path/to/flag.png"
```

### Test Programs Upload:
```bash
curl -X POST http://localhost:3000/api/programs \
  -F "title=Test Program" \
  -F "shortDescription=Short desc" \
  -F "description=Full description" \
  -F "countryId=country-id" \
  -F "thumbnail=@/path/to/thumbnail.jpg" \
  -F "objectives=[{\"title\":\"Obj1\",\"description\":\"Desc1\",\"logo\":\"\"}]" \
  -F "objectiveLogos=@/path/to/logo1.png"
```

## Troubleshooting

### Issue: "Cannot find name 'imageKit'"
**Solution**: Make sure `import imageKit from "@/configs/imageKit";` is added to the route file.

### Issue: "Invalid [field] format"
**Solution**: Ensure JSON fields are properly stringified before appending to FormData.

### Issue: Images not uploading
**Solution**: 
1. Check environment variables are set correctly
2. Verify ImageKit credentials are valid
3. Check file size limits (default Next.js limit is 4.5MB)
4. Ensure file input has correct `name` attribute

### Issue: Wrong images mapped to array items
**Solution**: Ensure files are appended to FormData in the same order as the array items in the JSON.

## Next Steps

1. Update frontend forms to use the new FormData approach
2. Test all endpoints thoroughly
3. Consider implementing image preview before upload
4. Add file size and type validation
5. Implement progress indicators for large uploads
6. Add image cleanup on record deletion
