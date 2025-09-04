# Interactive Globe - Application Build Instructions

## 🖥️ Desktop Application (Electron)

### Development Mode
```bash
npm run electron-dev
```
This will start both the Vite dev server and Electron app.

### Production Build
```bash
npm run electron-pack
```
This will create a distributable application in the `dist-electron` folder.

## 🌐 Web Application

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## 📱 Progressive Web App (PWA)

To make it a PWA, you can add:
- Service Worker
- Web App Manifest
- Offline capabilities

## 🚀 Deployment Options

### 1. Desktop App Distribution
- **Windows**: Creates `.exe` installer
- **macOS**: Creates `.dmg` file
- **Linux**: Creates `.AppImage`

### 2. Web Hosting
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Deploy from GitHub Actions

### 3. Cloud Platforms
- **Heroku**: Add a buildpack for static sites
- **AWS S3**: Upload to S3 bucket with static hosting
- **Firebase Hosting**: Deploy with Firebase CLI

## 📦 Package for Distribution

The built application will be in:
- `dist-electron/` - Desktop app installers
- `dist/` - Web application files

## 🎯 Features Included

✅ 3D Interactive Globe
✅ Country Information from REST Countries API
✅ Modern UI with Tailwind CSS
✅ Responsive Design
✅ Cross-platform Desktop App
✅ Professional Menu System
✅ Error Handling
✅ Loading States
