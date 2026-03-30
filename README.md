# BlogApp_Frontend

A modern, responsive blogging platform frontend built with **React 19**, **TypeScript**, and **Vite**. Featuring a comprehensive UI component library, real-time data synchronization, and seamless user authentication.

## Features

- **User Authentication** - JWT-based authentication with secure token management
- **Blog Post Management** - Create, edit, and delete blog posts with rich content support
- **Admin Dashboard** - Complete admin panel for managing posts and user interactions
- **Real-time Updates** - Optimized data fetching with React Query for efficient state management
- **Responsive Design** - Mobile-first approach with Tailwind CSS and Radix UI components
- **Dark Mode Support** - Theme switching with `next-themes` for enhanced UX
- **Form Validation** - Robust form handling with React Hook Form and Zod validation
- **Interactive Components** - 40+ accessible, customizable UI components from Radix UI primitives
- **Smooth Animations** - Delightful micro-interactions powered by Framer Motion
- **Toast Notifications** - User feedback system with Sonner toast notifications

## 🛠 Tech Stack

**Frontend Framework:**
- React 19.1.0 with TypeScript
- Vite 5.x (lightning-fast build tool)

**UI & Styling:**
- Tailwind CSS 4.x with Typography plugin
- Radix UI primitives (40+ accessible components)
- Lucide React icons
- Framer Motion for animations
- Embla Carousel for carousels

**State Management & Data:**
- React Query 5.x for server state management
- React Hook Form for form handling
- Zod for schema validation

**Development:**
- TypeScript 5.x for type safety
- Vite plugins for optimized builds
- pnpm for dependency management

## Prerequisites

- Node.js 18.x or higher
- pnpm 8.x or higher (recommended) or npm/yarn

## Development & Architecture

**Frontend Development Approach:**
- **Backend Foundation** - The custom backend API was designed and built from scratch by me, establishing the complete architecture, data models, and business logic
- **Frontend Scaffolding** - Initial frontend structure was generated using Replit AI, using my backend code and architecture as a reference template
- **Customization & Enhancement** - All frontend features, bug fixes, integrations, and refinements were implemented using GitHub Copilot with iterative development
- **Production Ready** - Extensive debugging, testing, and optimization to ensure seamless integration with the backend

This approach demonstrates:
- **Deep architectural understanding** - Ability to translate backend design into frontend requirements
- **AI/LLM tool proficiency** - Effective use of modern development tools for rapid prototyping
- **Problem-solving skills** - Debugging and refining AI-generated code to meet specific requirements
- **Full-stack competency** - Complete ownership of both backend and frontend development

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/BlogApp_Frontend.git
cd BlogApp_Frontend

# Install dependencies
pnpm install
# or
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
# Or for production
VITE_API_BASE_URL=https://your-api-domain.com
```

### Running Locally

```bash
# Start development server
pnpm dev

# The app will be available at http://localhost:5173
```

### Building for Production

```bash
# Build the project
pnpm build

# Preview the production build
pnpm preview
```

## Project Structure
```
src/
├── components/
│   ├── Navbar.tsx          # Navigation component
│   ├── PostCard.tsx        # Blog post card component
│   └── ui/                 # Radix UI component library (40+ components)
├── hooks/
│   ├── use-auth.ts         # Authentication logic
│   ├── use-admin.ts        # Admin functionality
│   ├── use-posts.ts        # Blog post management
│   └── use-interactions.ts # User interactions
├── pages/
│   ├── Home.tsx            # Home/feed page
│   ├── Auth.tsx            # Authentication pages
│   ├── Admin.tsx           # Admin dashboard
│   ├── CreatePost.tsx      # Blog post creation
│   └── not-found.tsx       # 404 page
├── lib/
│   ├── api.ts              # API client with JWT auth
│   ├── types.ts            # TypeScript type definitions
│   └── utils.ts            # Utility functions
├── App.tsx                 # Root component
├── main.tsx                # Entry point
└── index.css               # Global styles
```

## Backend Integration

**My Backend Repository** - https://github.com/Deepanshu-24/BlogApp_Backend

This frontend is designed to work with a custom backend API. The backend handles:
- User authentication and authorization
- Blog post CRUD operations
- Database management
- Business logic

API endpoints are configured via environment variables and authenticated using JWT tokens stored in localStorage.

## Authentication Flow

1. User logs in via the Auth page
2. Backend returns JWT access token
3. Token is stored in localStorage
4. All API requests include the token in `Authorization: Bearer <token>` header
5. Protected routes validate token presence and validity

## Responsive Design

The application is fully responsive and tested on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablets (iPad, Android tablets)
- Mobile devices (iOS, Android)

## Component Architecture

The UI is built using **Radix UI primitives** - unstyled, accessible components that are styled with Tailwind CSS. This approach provides:
- **Accessibility (a11y)** - WCAG compliant components
- **Customizability** - Easy to theme and modify with Tailwind
- **Type Safety** - Full TypeScript support
- **Performance** - Optimized rendering


## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest improvements
- Submit pull requests

## License

This project is open source and available under the MIT License.