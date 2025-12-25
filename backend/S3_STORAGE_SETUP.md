# Cloudflare R2 Storage Configuration

The application supports two storage backends:
1. **Local Storage** (default) - Files stored on the local filesystem
2. **Cloudflare R2 Storage** - Files stored in Cloudflare R2

## Current Configuration

By default, the application uses **Local Storage**. To enable R2 storage, you need to set environment variables.

## Enabling Cloudflare R2 Storage

### Step 1: Get R2 Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** > **Manage R2 API Tokens**
3. Click **Create API Token**
4. Give it a name and select **Admin Read & Write** permissions
5. Copy the **Access Key ID** and **Secret Access Key**
6. Note your **Account ID** (found in the dashboard URL or sidebar)

### Step 2: Create an R2 Bucket

1. In Cloudflare Dashboard, go to **R2** > **Create bucket**
2. Enter a bucket name (e.g., `my-ecommerce-images`)
3. Choose a location (optional)
4. Click **Create bucket**

### Step 3: Set Environment Variables

Add the following environment variables to your `.vars` file or environment:

```bash
# Storage Type
STORAGE_TYPE=r2

# Cloudflare R2 Credentials
R2_ACCESS_KEY_ID=your_r2_access_key_id_here
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key_here
R2_ACCOUNT_ID=your_cloudflare_account_id_here
R2_BUCKET_NAME=your_bucket_name_here

# Optional: Custom domain for public access
# If you have a custom domain configured in R2, set this:
# R2_PUBLIC_URL=https://cdn.example.com
```

### Step 4: Example Configuration

```bash
STORAGE_TYPE=r2
R2_ACCESS_KEY_ID=abc123def456ghi789
R2_SECRET_ACCESS_KEY=xyz789uvw456rst123
R2_ACCOUNT_ID=1a2b3c4d5e6f7g8h9i0j
R2_BUCKET_NAME=my-ecommerce-images
R2_PUBLIC_URL=https://cdn.example.com
```

### Step 5: Public Access (Optional)

If you want public access to your files:

1. **Option A: Use Custom Domain** (Recommended)
   - In R2 bucket settings, add a custom domain
   - Set `R2_PUBLIC_URL` to your custom domain (e.g., `https://cdn.example.com`)

2. **Option B: Use R2 Public URL**
   - Enable public access in bucket settings
   - Files will be accessible at: `https://<account-id>.r2.cloudflarestorage.com/<bucket-name>/<object-name>`
   - No need to set `R2_PUBLIC_URL` in this case

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
- **R2 Storage**: Files are stored in the configured R2 bucket under the `products/` folder (or folder specified in upload)

## Troubleshooting

### Images not uploading to R2

1. Check that `STORAGE_TYPE=r2` is set
2. Verify R2 credentials are correct (`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`)
3. Ensure the R2 bucket exists and is accessible
4. Verify `R2_ACCOUNT_ID` is correct
5. Verify `R2_BUCKET_NAME` matches your bucket name exactly
6. Check that your API token has the correct permissions

### Images showing as broken/not loading

1. Check that the returned URL is correct
2. For R2, ensure the bucket has public read access OR use presigned URLs
3. If using custom domain, verify `R2_PUBLIC_URL` is set correctly
4. For local storage, ensure the `/uploads` route is mounted in FastAPI (see `main.py`)
5. Check CORS settings if accessing from a different domain
6. Verify your R2 bucket allows public access (if not using presigned URLs)

### Multiple images not showing

This is a frontend React state closure issue that has been fixed. If you still see only one image:
- Clear browser cache
- Check browser console for errors
- Verify all uploads completed successfully (check network tab)

