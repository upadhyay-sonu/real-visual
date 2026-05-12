# AWS Deployment Architecture & Guide

This guide explains how to deploy **Real Visual** securely on AWS, leveraging EC2, S3, and Nginx.

## Architecture Overview
- **Storage:** AWS S3 for saving `.glb` model files securely. The application uses pre-signed URLs to fetch the assets securely without exposing the bucket.
- **Compute:** AWS EC2 instance running Ubuntu.
- **Process Manager:** PM2 to daemonize the Node.js backend.
- **Reverse Proxy:** Nginx to route traffic, handle SSL termination, and serve the frontend build (or route frontend requests).
- **Database:** MongoDB Atlas (fully managed cloud DB).

## Step 1: AWS S3 Setup
1. Create a new S3 bucket (e.g., `3d-object-viewer-assets`).
2. **Block Public Access:** Keep "Block all public access" turned ON. The backend uses IAM credentials to generate temporary Signed URLs, so objects do not need to be public.
3. Configure **CORS** on the S3 bucket so the frontend can load the `.glb` files via Three.js:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

## Step 2: AWS IAM Policy
Create an IAM User for the backend server and attach this inline policy to restrict access specifically to the newly created bucket:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```
*Save the generated `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.*

## Step 3: EC2 Setup (Backend)
1. Launch an EC2 instance (Ubuntu 22.04).
2. SSH into the instance and install Node.js and NPM.
3. Clone the repository and navigate to the `server/` directory.
4. Run `npm install`.
5. Create a `.env` file and input the secrets (including `USE_S3=true` and your IAM keys).
6. Install PM2: `sudo npm install -g pm2`.
7. Start the server: `pm2 start index.js --name "3d-backend"`.
8. Save PM2 state to restart on boot: `pm2 startup` and `pm2 save`.

## Step 4: Nginx Reverse Proxy
1. Install Nginx: `sudo apt install nginx`.
2. Create a new site config in `/etc/nginx/sites-available/3d-app`:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
3. Enable the site: `sudo ln -s /etc/nginx/sites-available/3d-app /etc/nginx/sites-enabled/`.
4. Restart Nginx: `sudo systemctl restart nginx`.
5. *Optional but recommended: Set up Let's Encrypt / Certbot for HTTPS.*

## Step 5: Frontend Deployment (Vercel/CloudFront)
- **Vercel (Recommended):** Connect the repository to Vercel, set the root directory to `client/`, and configure the environment variable `VITE_API_URL` to point to your Nginx-backed EC2 domain (`https://api.yourdomain.com`).
- **CloudFront:** If you prefer serving the frontend via AWS, you can build the React app (`npm run build`), push the `dist/` folder to an S3 bucket configured for Static Website Hosting, and place CloudFront in front of it for global caching.
