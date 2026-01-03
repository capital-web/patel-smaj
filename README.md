
# Custom Card Pro - cPanel Deployment Guide

Follow these steps to host your Custom Card Pro application on your cPanel server.

## 1. Local Build Process (Required)
Browsers cannot run TypeScript (.tsx) files directly. You must convert them to standard JavaScript first.

1.  **Download** all project files to a folder on your computer.
2.  **Install Node.js** from [nodejs.org](https://nodejs.org).
3.  Open your **Terminal** (or Command Prompt) in that folder and run:
    ```bash
    npm install
    npm run build
    ```
4.  This creates a folder named `dist` containing your ready-to-host website.

## 2. Uploading to cPanel
1.  Log in to your **cPanel**.
2.  Open **File Manager** and navigate to `public_html`.
3.  **Upload everything INSIDE the `dist` folder** to `public_html`.
    - Note: Upload the files/folders inside `dist`, not the `dist` folder itself.
4.  Ensure `index.html` is in the root of your domain.

## 3. Accessing Your Site
- **Public Site**: `https://yourdomain.com`
- **Admin Dashboard**: `https://yourdomain.com/#/secret-admin-portal/login`
  - *Note: Don't forget the '#' symbol!*
  - **Default Password**: `admin123` (Change this immediately in the Settings tab).

## 4. Technical Configuration
- **Router**: This app uses a `HashRouter`. It works on cPanel without any `.htaccess` configuration.
- **Data Saving**: Templates and settings are stored in the browser's `localStorage`. For production with many users, settings are specific to the browser used to set them up.
- **Logo Upload**: Use the "Site Settings" tab in the Admin panel to upload your brand logo; it will persist as a Base64 string in your browser storage.
