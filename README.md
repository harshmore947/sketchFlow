# SketchFlow 🎨

A modern drawing and sketching app built with Next.js and Excalidraw integration. Create beautiful diagrams, sketches, and visual notes with a seamless user experience.

![SketchFlow](https://img.shields.io/badge/SketchFlow-Draw%20•%20Create%20•%20Flow-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Excalidraw](https://img.shields.io/badge/Excalidraw-Integration-orange)

## 📸 Screenshots

### Dashboard & Note Management

![Dashboard](./screenshots/Screenshot%202025-06-18%20184000.png)

### Drawing Workspace with Excalidraw

![Drawing Workspace](./screenshots/Screenshot%202025-06-18%20184009.png)

### Authentication & Login

![Authentication](./screenshots/Screenshot%202025-06-18%20184031.png)

### Search & Filter Features

![Search Features](./screenshots/Screenshot%202025-06-18%20184218.png)

### Hover Actions & Note Cards

![Hover Actions](./screenshots/Screenshot%202025-06-18%20184248.png)

### Mobile Responsive Design

![Mobile View](./screenshots/Screenshot%202025-06-18%20184304.png)

### Homepage & Landing

![Homepage](./screenshots/Screenshot%202025-06-18%20183639.png)

## ✨ Features

### 🎯 Core Functionality

- **Professional Drawing Tools** - Full Excalidraw integration with shapes, text, and freehand drawing
- **Smart Note Management** - Organize drawings with starring, archiving, and search
- **Auto-Save System** - Automatic saving of your work as you draw
- **Export Functionality** - Download drawings as `.excalidraw` files
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### 🔐 Authentication & Security

- **Google OAuth** - Sign in with your Google account
- **GitHub OAuth** - Sign in with your GitHub account
- **Secure Sessions** - NextAuth.js powered authentication
- **User Isolation** - Each user's drawings are private and secure

### 📱 User Experience

- **Modern UI/UX** - Clean, intuitive interface with dark theme
- **Dashboard Management** - Easy organization and access to all your drawings
- **Search & Filter** - Find drawings by title and content
- **Grid/List Views** - Choose your preferred viewing mode
- **Hover Actions** - Quick access to star, archive, and delete options

### 🛠 Technical Features

- **Next.js 14** - Latest React framework with App Router
- **TypeScript** - Full type safety and better development experience
- **Prisma ORM** - Type-safe database operations
- **PostgreSQL** - Robust data storage
- **Tailwind CSS** - Modern styling with utility classes
- **Framer Motion** - Smooth animations and transitions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials
- GitHub OAuth credentials

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/harshmore947/sketchFlow.git
   cd sketchFlow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Usage

### Creating a New Drawing

1. Sign in with Google or GitHub
2. Click "New Note" on the dashboard
3. Start drawing with Excalidraw tools
4. Your work auto-saves as you draw

### Managing Your Drawings

- **Star** important drawings for quick access
- **Archive** drawings you want to keep but don't need regularly
- **Search** through your drawings by title or content
- **Export** drawings as `.excalidraw` files

### Drawing Tools

- **Shapes** - Rectangles, circles, arrows, and more
- **Text** - Add labels and annotations
- **Freehand** - Draw naturally with pen tool
- **Selection** - Move and edit elements
- **Undo/Redo** - Never lose your work

## 🔮 Upcoming Features

### 🚧 In Development

- **Real-time Collaboration** - Draw together with your team in real-time
- **Live Cursors** - See where team members are drawing
- **Comments & Annotations** - Add feedback and notes to drawings
- **Version History** - Track changes and revert to previous versions
- **Templates Library** - Pre-made templates for common diagrams

### 📋 Planned Features

- **Team Workspaces** - Organize drawings by projects and teams
- **Advanced Export** - Export as PNG, SVG, and PDF
- **Drawing Analytics** - Track usage and collaboration metrics
- **Mobile App** - Native iOS and Android applications
- **API Integration** - Connect with other tools and services

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Drawing Engine**: Excalidraw
- **Deployment**: Vercel (recommended)

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Excalidraw](https://excalidraw.com/) - For the amazing drawing engine
- [Next.js](https://nextjs.org/) - For the powerful React framework
- [Vercel](https://vercel.com/) - For seamless deployment
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact us.

---

**Made with ❤️ by Harsh**
