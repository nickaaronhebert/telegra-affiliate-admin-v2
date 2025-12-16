# React Vite TypeScript Tailwind Shadcn/UI Project

This is a modern React application built with Vite, TypeScript, Tailwind CSS, and Shadcn/UI components.

## 🚀 Features

- ⚡️ **Vite** - Lightning fast build tool
- ⚛️ **React 19** - Latest React with modern features
- 📘 **TypeScript** - Type safety and better development experience
- 🎨 **Tailwind CSS** - Utility-first CSS framework (v4)
- 🧩 **Shadcn/UI** - Beautiful and accessible UI components
- 🔥 **Hot Module Replacement (HMR)** - Instant updates during development
- 📦 **Optimized Build** - Production-ready builds with automatic optimization

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Building for Production

Build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check for code issues:

```bash
npm run lint
```

## 📁 Project Structure

```
├── public/             # Static assets
├── src/
│   ├── components/
│   │   └── ui/         # Shadcn/UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── input.tsx
│   ├── lib/
│   │   └── utils.ts    # Utility functions
│   ├── assets/         # Project assets (images, etc.)
│   ├── App.tsx         # Main App component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles with Tailwind imports
├── index.html          # HTML template
├── components.json     # Shadcn/UI configuration
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## 🎨 Styling & Components

This project uses **Tailwind CSS v4** for styling and **Shadcn/UI** for pre-built components:

### Using Tailwind Classes
```tsx
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click me
</button>
```

### Using Shadcn/UI Components
```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>My Card</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Click me</Button>
  </CardContent>
</Card>
```

### Adding More Components
```bash
npx shadcn@latest add [component-name]
```

## 📚 Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
