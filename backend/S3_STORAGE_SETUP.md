# S3 Storage Configuration

The application supports two storage backends:
1. **Local Storage** (default) - Files stored on the local filesystem
2. **S3 Storage** - Files stored in AWS S3 or S3-compatible services (e.g., DigitalOcean Spaces)

## Current Configuration

By default, the application uses **Local Storage**. To enable S3 storage, you need to set environment variables.

## Enabling S3 Storage

### Step 1: Set Environment Variables

Add the following environment variables to your `.vars` file or environment:

```bash
# Storage Type
STORAGE_TYPE=s3

# AWS S3 Credentials (for AWS S3)
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1  # Your S3 bucket region
STORAGE_BUCKET_NAME=your-bucket-name

# For DigitalOcean Spaces (S3-compatible), also add:
# AWS_ENDPOINT_URL=https://nyc3.digitaloceanspaces.com
```

### Step 2: Example for AWS S3

```bash
STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
STORAGE_BUCKET_NAME=my-ecommerce-images
```

### Step 3: Example for DigitalOcean Spaces

```bash
STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=your_spaces_key
AWS_SECRET_ACCESS_KEY=your_spaces_secret
AWS_REGION=nyc3
AWS_ENDPOINT_URL=https://nyc3.digitaloceanspaces.com
STORAGE_BUCKET_NAME=my-spaces-bucket
```

## Image Upload Flow

**Important**: Images are uploaded **BEFORE** product creation, which is the correct flow:

1. **Upload Images** → User selects and uploads images via the ImageGallery component
   - Images are uploaded to storage (S3 or local) immediately
   - Each upload returns a URL
   - All uploaded image URLs are stored in the frontend state

2. **Create Product** → User fills in product details and submits
   - Product is created in the database
   - Product ID is returned

3. **Link Images** → Product images are linked to the product
   - Image URLs from step 1 are saved in the `product_image` table
   - Each image is linked to the product with metadata (alt_text, sort_order, is_primary)

This flow ensures that:
- Images are stored permanently before product creation
- If product creation fails, images are still available
- No orphaned products without images

## Storage Locations

- **Local Storage**: Files are stored in `uploads/` directory (configured via `LOCAL_STORAGE_PATH`)
- **S3 Storage**: Files are stored in the configured S3 bucket under the `products/` folder (or folder specified in upload)

## Troubleshooting

### Images not uploading to S3

1. Check that `STORAGE_TYPE=s3` is set
2. Verify AWS credentials are correct
3. Ensure the S3 bucket exists and is accessible
4. Check bucket permissions (IAM policy must allow PutObject, GetObject, DeleteObject)
5. Verify the bucket name in `STORAGE_BUCKET_NAME`

### Images showing as broken/not loading

1. Check that the returned URL is correct
2. For S3, ensure the bucket has public read access OR use presigned URLs
3. For local storage, ensure the `/uploads` route is mounted in FastAPI (see `main.py`)
4. Check CORS settings if accessing from a different domain

### Multiple images not showing

This is a frontend React state closure issue that has been fixed. If you still see only one image:
- Clear browser cache
- Check browser console for errors
- Verify all uploads completed successfully (check network tab)

