# Railway Deployment Guide for XClips

This app is designed to be deployed on [Railway](https://railway.app) using Nixpacks.

## 1. Prerequisites
- A Railway account
- GitHub repository with this code

## 2. Environment Setup
The app uses `yt-dlp` and `ffmpeg` which are automatically installed via the `nixpacks.toml` file included in the project.

No mandatory environment variables are required for the basic MVP, but you can add:
- `NEXT_PUBLIC_UMAMI_ID`: For Umami analytics if you set it up.

## 3. Deployment Steps
1. Push your code to a GitHub repository.
2. Log in to Railway and click **"New Project"**.
3. Select **"Deploy from GitHub repo"** and choose your repository.
4. Railway will detect the `nixpacks.toml` and build the environment with Python, `yt-dlp`, and `ffmpeg`.
5. Once deployed, Railway will provide a URL (e.g., `xclips-production.up.railway.app`).

## 4. Local Development
To run this locally, you must have `yt-dlp` and `ffmpeg` installed on your machine.

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

## 5. Security Notes
- The app includes in-memory rate limiting.
- Files are automatically deleted from the server after 15 minutes to save disk space.
- Max file size is limited to 100MB to prevent abuse.
