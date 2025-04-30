# Bucket List Frontend

React-based frontend for the Bucket List application that allows users to create, manage, and track their bucket list items with an intuitive user interface.

## Tech Stack

- **React 19** with **TypeScript**
- **Vite** as the build tool
- **React Router** for navigation
- **React Hook Form** for form handling
- **Cloudinary** for image uploads
- **Axios** for API requests

## Features

- User authentication (login/register)
- Create, edit, delete bucket list entries
- Mark entries as completed/incomplete
- Upload images for bucket list entries
- AI chatbot for bucket list suggestions
- Progress tracking
- User profile management
- Responsive design with dark/light mode

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd bucket-list-frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file with the required environment variables
5. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://localhost:5000/api
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build locally

## Project Structure

```
bucket-list-frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # UI components
│   │   └── ui/          # Reusable UI components
│   ├── lib/             # Utilities and context
│   ├── pages/           # Page components
│   │   ├── HomePage.tsx     # Landing page
│   │   └── UserPage.tsx     # Dashboard page
│   ├── styles/          # CSS stylesheets
│   ├── App.tsx          # App component
│   └── main.tsx         # Entry point
├── .env                 # Environment variables (create this)
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Key Components

### Pages

- **HomePage**: Landing page with features showcase and authentication
- **UserPage**: Dashboard for authenticated users to manage bucket list items

### Components

- **Navbar**: Navigation bar with authentication status
- **ChatBot**: AI-powered assistant for bucket list suggestions
- **ProtectedRoute**: Route wrapper that requires authentication

### Context

- **AuthContext**: Manages authentication state and user data

## Connecting to Backend

The frontend communicates with the backend API using Axios. Ensure the backend server is running and the `VITE_API_URL` environment variable is correctly set.

## Styling

The application uses a combination of Tailwind CSS and custom styles. The theme can be toggled between light and dark modes.

## Authentication Flow

1. User registers or logs in
2. JWT token is stored in localStorage
3. Protected routes check for valid authentication
4. Authenticated API requests include the JWT token in headers
