
# Custom Card Pro Installation Guide (cPanel Hosting)

This project is a React-based application designed for high performance and easy deployment. Follow these steps to install it on your cPanel hosting.

## Prerequisites
- Node.js installed on your local machine (to build the project).
- Access to your cPanel File Manager or FTP.

## Step 1: Build the Project Locally
1. Extract the project files to a folder on your computer.
2. Open your terminal/command prompt in that folder.
3. Run `npm install` to install dependencies.
4. Run `npm run build` to generate the production-ready files.
   - This creates a folder named `dist` (or `build`) containing all the static HTML/CSS/JS files.

## Step 2: Upload to cPanel
1. Log in to your cPanel.
2. Open **File Manager**.
3. Navigate to your website's root directory (usually `public_html`).
4. Upload all the contents *inside* the `dist` (or `build`) folder directly into `public_html`.
5. Ensure `index.html` is in the `public_html` root.

## Step 3: Admin Access
- Your main website will be at `https://yourdomain.com`.
- Your admin portal is hidden at: `https://yourdomain.com/#/secret-admin-portal/login`.
- **Default Password:** `admin123` (Change this immediately in the Settings tab).

## Important Notes
- **Persistence:** This version uses `localStorage` to save templates and settings. In a standard cPanel environment without a Node.js backend/Database, settings are stored in the user's browser. To share templates across different users, a PHP/MySQL backend integration would be required.
- **HD Quality:** The "Download HD" feature uses client-side rendering with a 4x scale factor to ensure high resolution regardless of the template's display size.
