# Azure Deployment Guide

This guide provides step-by-step instructions for deploying your React/Vite project to Azure. You already have an Azure account and resource group set up.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Deployment Options](#deployment-options)
3. [Option 1: Azure Static Web Apps (Recommended)](#option-1-azure-static-web-apps-recommended)
4. [Option 2: Azure App Service](#option-2-azure-app-service)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ Azure account with active subscription
- ✅ Resource group created in Azure
- ✅ Azure CLI installed locally (optional, for CLI deployment)
- ✅ Node.js and npm installed (for building the project)
- ✅ Git installed (if using GitHub Actions)

---

## Deployment Options

### Option 1: Azure Static Web Apps (Recommended)
**Best for:** Static React applications
- **Pros:** Free tier available, automatic HTTPS, global CDN, easy CI/CD
- **Cons:** Limited to static content (no server-side rendering)

### Option 2: Azure App Service
**Best for:** Full-stack applications or if you need more control
- **Pros:** Supports Node.js runtime, more configuration options
- **Cons:** More expensive, requires more setup

---

## Option 1: Azure Static Web Apps (Recommended)

### Step 1: Build Your Project Locally

First, ensure your project builds successfully:

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

This creates a `dist` folder with your production-ready files.

### Step 2: Create Static Web App via Azure Portal

1. **Navigate to Azure Portal**
   - Go to [portal.azure.com](https://portal.azure.com)
   - Sign in with your Azure account

2. **Create Static Web App Resource**
   - Click **"Create a resource"** (or use the search bar)
   - Search for **"Static Web Apps"**
   - Click **"Create"**

3. **Configure Basic Settings**
   - **Subscription:** Select your subscription
   - **Resource Group:** Select your existing resource group
   - **Name:** Enter a unique name (e.g., `eventita-ui-app`)
   - **Plan type:** Choose **Free** (or Standard for production)
   - **Region:** Select the closest region to your users
   - **Deployment details:** Choose **"Other"** (we'll deploy manually)

4. **Review and Create**
   - Review your settings
   - Click **"Create"**
   - Wait for deployment to complete (2-3 minutes)

### Step 3: Deploy Using Azure CLI (Method A)

1. **Install Azure CLI** (if not already installed)
   ```bash
   # Windows (PowerShell)
   winget install -e --id Microsoft.AzureCLI
   
   # Or download from: https://aka.ms/installazurecliwindows
   ```

2. **Login to Azure**
   ```bash
   az login
   ```

3. **Get Static Web App Details**
   - Go to your Static Web App in Azure Portal
   - Navigate to **"Overview"** section
   - Note down:
     - **Resource Group Name**
     - **Static Web App Name**

4. **Get Deployment Token**
   - In Azure Portal, go to your Static Web App
   - Click on **"Manage deployment token"** in the left menu
   - Copy the deployment token

5. **Deploy Your Build**
   ```bash
   # Navigate to your project directory
   cd D:\Eventita_ui
   
   # Install Azure Static Web Apps CLI (one-time setup)
   npm install -g @azure/static-web-apps-cli
   
   # Deploy (replace with your values)
   swa deploy ./dist \
     --deployment-token YOUR_DEPLOYMENT_TOKEN \
     --app-name YOUR_STATIC_WEB_APP_NAME \
     --resource-group YOUR_RESOURCE_GROUP_NAME \
     --env production
   ```

### Step 3: Deploy Using Azure Portal (Method B)

1. **Build Your Project**
   ```bash
   npm run build
   ```

2. **Zip the dist Folder**
   - Navigate to your project root
   - Create a zip file of the `dist` folder contents (not the folder itself)
   - Name it `deploy.zip`

3. **Upload via Azure Portal**
   - Go to your Static Web App in Azure Portal
   - Click on **"Overview"**
   - Click **"Browse"** to view your site
   - Or go to **"Deployment"** → **"Deployment history"**
   - Click **"Browse"** to upload your zip file

### Step 4: Configure Build Settings (If Using GitHub Actions)

If you want automatic deployments from GitHub:

1. **In Azure Portal:**
   - Go to your Static Web App
   - Click **"Deployment"** → **"GitHub"**
   - Authorize Azure to access your GitHub account
   - Select your repository and branch
   - Configure build settings:
     - **App location:** `/`
     - **Api location:** (leave empty if no API)
     - **Output location:** `dist`

2. **GitHub Actions Workflow**
   - Azure will automatically create a `.github/workflows` file
   - Push your code to trigger automatic deployment

### Step 5: Access Your Deployed App

1. **Get Your URL**
   - In Azure Portal, go to your Static Web App
   - Click **"Overview"**
   - Find the **"URL"** field (format: `https://your-app-name.azurestaticapps.net`)

2. **Visit Your Site**
   - Open the URL in your browser
   - Your app should be live!

---

## Option 2: Azure App Service

### Step 1: Build Your Project

```bash
npm install
npm run build
```

### Step 2: Create App Service via Azure Portal

1. **Create Web App**
   - Go to Azure Portal
   - Click **"Create a resource"**
   - Search for **"Web App"**
   - Click **"Create"**

2. **Configure Basic Settings**
   - **Subscription:** Your subscription
   - **Resource Group:** Your existing resource group
   - **Name:** Unique name (e.g., `eventita-ui-webapp`)
   - **Publish:** Code
   - **Runtime stack:** Node.js 18 LTS or 20 LTS
   - **Operating System:** Linux (recommended) or Windows
   - **Region:** Select closest region
   - **App Service Plan:** Create new or use existing
     - **SKU and size:** Free F1 (for testing) or Basic B1 (for production)

3. **Review and Create**
   - Review settings
   - Click **"Create"**
   - Wait for deployment (2-5 minutes)

### Step 3: Configure Deployment

#### Method A: Using Azure CLI

1. **Install Azure CLI** (if not installed)
   ```bash
   az login
   ```

2. **Create Deployment Package**
   ```bash
   # Build your project
   npm run build
   
   # Create a zip file of the dist folder
   # Windows PowerShell:
   Compress-Archive -Path dist\* -DestinationPath deploy.zip
   
   # Or manually zip the contents of the dist folder
   ```

3. **Deploy Using Azure CLI**
   ```bash
   # Set variables
   $resourceGroup = "YOUR_RESOURCE_GROUP_NAME"
   $appName = "YOUR_WEB_APP_NAME"
   
   # Deploy
   az webapp deploy \
     --resource-group $resourceGroup \
     --name $appName \
     --src-path deploy.zip \
     --type zip
   ```

#### Method B: Using Azure Portal

1. **Go to Deployment Center**
   - Navigate to your Web App in Azure Portal
   - Click **"Deployment Center"** in the left menu

2. **Choose Deployment Method**
   - **Local Git:** For manual deployments
   - **GitHub:** For automatic deployments from GitHub
   - **Azure Repos:** For Azure DevOps

3. **Configure Local Git (Manual)**
   - Select **"Local Git"**
   - Go to **"Deployment Center"** → **"Local Git/FTPS credentials"**
   - Set username and password
   - Note the Git clone URL

4. **Deploy via Git**
   ```bash
   # Add Azure remote
   git remote add azure https://YOUR_APP_NAME.scm.azurewebsites.net/YOUR_APP_NAME.git
   
   # Push to deploy
   git push azure main
   ```

#### Method C: Using VS Code Extension

1. **Install Azure App Service Extension**
   - Install "Azure App Service" extension in VS Code
   - Sign in to Azure
   - Right-click on `dist` folder
   - Select **"Deploy to Web App"**
   - Choose your Web App

### Step 4: Configure App Settings

1. **Set Node.js Version**
   - Go to your Web App → **"Configuration"** → **"General settings"**
   - Set **"Stack"** to Node.js
   - Set **"Node version"** to 18 LTS or 20 LTS

2. **Configure Startup Command**
   - In **"General settings"**, add:
     - **Startup Command:** `npm run preview` (if you have a preview server)
     - Or use a simple HTTP server: `npx serve -s dist -l 8080`

3. **Add Application Settings** (if needed)
   - Go to **"Configuration"** → **"Application settings"**
   - Add any environment variables your app needs

### Step 5: Serve Static Files

Since this is a static React app, you need to serve the `dist` folder:

1. **Option A: Use a Simple Server**
   - Create a `server.js` file in your project root (you already have one)
   - Update it to serve the `dist` folder:
   ```javascript
   const express = require('express');
   const path = require('path');
   const app = express();
   
   // Serve static files from dist directory
   app.use(express.static(path.join(__dirname, 'dist')));
   
   // Handle React routing - return all requests to index.html
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
   });
   
   const port = process.env.PORT || 8080;
   app.listen(port, () => {
     console.log(`Server running on port ${port}`);
   });
   ```

2. **Update package.json** (temporary, for deployment only)
   - Add to `scripts`:
   ```json
   "start": "node server.js"
   ```

3. **Deploy with server.js**
   - Include `server.js` and `package.json` in your deployment
   - Azure will run `npm start` automatically

### Step 6: Access Your App

1. **Get Your URL**
   - Go to your Web App → **"Overview"**
   - Find the **"URL"** (format: `https://your-app-name.azurewebsites.net`)

2. **Visit Your Site**
   - Open the URL in your browser

---

## Post-Deployment Configuration

### Custom Domain (Optional)

1. **In Azure Portal:**
   - Go to your Static Web App or Web App
   - Click **"Custom domains"**
   - Click **"Add"**
   - Follow the instructions to verify your domain

### Environment Variables

If your app uses environment variables:

1. **For Static Web Apps:**
   - Go to **"Configuration"** → **"Application settings"**
   - Add your environment variables
   - Note: Access them in your app using `import.meta.env.VITE_YOUR_VAR`

2. **For App Service:**
   - Go to **"Configuration"** → **"Application settings"**
   - Add your environment variables
   - Restart the app after adding variables

### HTTPS/SSL

- **Static Web Apps:** HTTPS is enabled by default
- **App Service:** HTTPS is enabled by default, but you can configure custom certificates

---

## Troubleshooting

### Build Fails

**Issue:** Build fails during deployment
- **Solution:** Test build locally first with `npm run build`
- Check for TypeScript errors
- Ensure all dependencies are in `package.json`

### 404 Errors on Routes

**Issue:** Direct URL access returns 404
- **Solution:** Configure routing:
  - **Static Web Apps:** Add `routes.json` in `public` folder:
    ```json
    {
      "routes": [],
      "navigationFallback": {
        "rewrite": "/index.html"
      }
    }
    ```
  - **App Service:** Ensure your server.js handles all routes (see Step 5 above)

### Assets Not Loading

**Issue:** Images/CSS/JS files return 404
- **Solution:** 
  - Check that `dist` folder contains all assets
  - Verify base path in `vite.config.ts` (should be `/` for root)
  - Clear browser cache

### CORS Issues

**Issue:** API calls fail due to CORS
- **Solution:**
  - Configure CORS in your backend API
  - Or use Azure API Management if needed

### Deployment Token Issues

**Issue:** Cannot authenticate with deployment token
- **Solution:**
  - Regenerate deployment token in Azure Portal
  - Ensure token is copied correctly (no extra spaces)

### App Service Not Starting

**Issue:** Web App shows "Application Error"
- **Solution:**
  - Check **"Log stream"** in Azure Portal for errors
  - Verify `package.json` has a `start` script
  - Check Node.js version matches your local version
  - Review **"Diagnose and solve problems"** in Azure Portal

---

## Quick Reference Commands

### Build Project
```bash
npm install
npm run build
```

### Azure CLI Login
```bash
az login
```

### List Your Resources
```bash
az resource list --resource-group YOUR_RESOURCE_GROUP_NAME
```

### View Deployment Logs (App Service)
```bash
az webapp log tail --name YOUR_APP_NAME --resource-group YOUR_RESOURCE_GROUP_NAME
```

### Delete Resources (if needed)
```bash
az group delete --name YOUR_RESOURCE_GROUP_NAME --yes
```

---

## Cost Considerations

### Azure Static Web Apps
- **Free Tier:** 100 GB bandwidth/month, 2 GB storage
- **Standard Tier:** Starts at $9/month

### Azure App Service
- **Free Tier (F1):** Limited CPU, shared infrastructure
- **Basic Tier (B1):** ~$13/month, dedicated resources
- **Standard Tier:** ~$50/month, better performance

**Recommendation:** Start with Static Web Apps Free tier for static React apps.

---

## Next Steps

1. ✅ Deploy your app using one of the methods above
2. ✅ Test all functionality in production
3. ✅ Set up custom domain (optional)
4. ✅ Configure monitoring and alerts
5. ✅ Set up CI/CD for automatic deployments

---

## Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [Azure CLI Reference](https://docs.microsoft.com/cli/azure/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Note:** This guide assumes you have an existing Azure account and resource group. If you need help creating a resource group, you can do so in Azure Portal or using:
```bash
az group create --name YOUR_RESOURCE_GROUP_NAME --location eastus
```

Replace `eastus` with your preferred Azure region.


