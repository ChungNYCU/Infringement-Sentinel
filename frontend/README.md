# Frontend README

Next.js application for Patent Infringement Checker UI, built with Tailwind CSS and shadcn/ui components.

## 🛠 Prerequisites

- Node.js 18 (LTS)
- npm (v8+) or Yarn

## 📦 Installation

1. **Clone and Navigate**
   ```bash
   git clone https://github.com/ChungNYCU/Infringement-Sentinel.git
   cd Infringement-Sentinel/frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or yarn install
   ```

3. **Configure Environment**
   Create a `.env.local` file at the root of the `frontend` folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
   - This variable tells the app where to send API requests (backend service).

## 🚀 Development

Run the Next.js development server with hot‑reload:
```bash
npm run dev
# or yarn dev
```
- App URL: http://localhost:3000

## ⚙️ Production Build & Start

1. **Build**  
   ```bash
   npm run build
   # or yarn build
   ```
2. **Start**  
   ```bash
   npm run start
   # or yarn start
   ```
- This runs the optimized production server.

## 📁 Project Structure

```
frontend/
├── components/         # Reusable UI components (ReportCard, Dropdown)
├── app/                # Next.js app directory (page.tsx, layout.tsx)
├── public/             # Static assets
├── styles/             # Global CSS (Tailwind config)
├── next.config.js      # Next.js configuration (rewrites, ESLint settings)
├── tailwind.config.js  # Tailwind CSS configuration
├── package.json
└── tsconfig.json       # TypeScript configuration
```

## 🔄 API Proxy

Configured in `next.config.js` to forward `/api/*` calls to the backend:
```js
module.exports = {
  rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
  eslint: { ignoreDuringBuilds: true },
};
```

## 🐳 Docker

This service is included in the root Docker Compose setup. To build and run the frontend container:
```bash
docker compose up --build frontend
```

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for accessible component primitives
- **lucide-react** for icons

## 📖 License

MIT

