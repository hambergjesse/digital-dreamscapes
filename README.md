# Abstract Art Generator

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

A full-stack web application that generates unique abstract art based on user-defined parameters. Users can customize colors, shapes, complexity, and randomness to create one-of-a-kind digital artwork that can be saved to a personal gallery.

## ✨ Features

- **Interactive Art Generation**: Create unique abstract art with real-time preview
- **Customizable Parameters**:
  - Color palettes (Ocean Breeze, Sunset Glow, etc.)
  - Shape selection (Circle, Rectangle, Triangle, Mixed)
  - Complexity and randomness controls
- **Art Gallery**: Save and organize generated artwork
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User Authentication**: Secure login and personal art collections

## 🛠️ Technology Stack

### Frontend

- Vue.js 3 with Composition API
- TypeScript for type safety
- HTML5 Canvas with p5.js for art generation
- CSS3 with responsive design principles

### Backend

- Node.js
- GraphQL API
- MongoDB for data persistence
- JWT for authentication

### Testing & Quality

- Jest for unit and integration testing
- ESLint for code quality
- Husky for pre-commit hooks
- Continuous Integration with automated testing

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/hambergjesse/abstract-art-gen.git
   cd abstract-art-gen
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

## 🔄 Workflow

This project uses Husky and lint-staged to ensure code quality:

- ESLint runs automatically on staged files before commit
- Related tests run before commit to prevent breaking changes
- Proper commit messages are enforced

## 📝 Documentation

### Project Structure

```
abstract-art-gen/
├── frontend/                   # Frontend Vue application
│   ├── src/                    # Source files
│   │   ├── components/         # Vue components (ArtGenerator.vue)
│   │   ├── assets/             # Static assets (images, fonts, etc.)
│   │   ├── utils/              # Utility functions
│   │   ├── App.vue             # Main Vue application
│   │   ├── main.ts             # Application entry point
│   │   └── shims-vue.d.ts      # TypeScript declarations for Vue
│   ├── tests/                  # Frontend tests
│   │   └── unit/               # Unit tests (ArtGenerator.spec.ts)
│   ├── jest.config.js          # Jest configuration for frontend
│   ├── tsconfig.json           # TypeScript configuration for frontend
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   └── .eslintrc.js            # ESLint configuration for frontend
├── backend/                    # Backend Node.js application
│   ├── src/                    # Source files
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   ├── schema.ts           # GraphQL schema
│   │   ├── resolvers.ts        # GraphQL resolvers
│   │   ├── server.ts           # Express server setup
│   │   └── database.ts         # Database connection
│   ├── tests/                  # Backend tests
│   └── tsconfig.json           # TypeScript configuration for backend
├── jest.config.js              # Root Jest configuration
├── tsconfig.json               # Root TypeScript configuration
├── .eslintrc.js                # Root ESLint configuration
├── .husky/                     # Git hooks for pre-commit checks
├── CONTRIBUTING.md             # Contributing guidelines
├── LICENSE                     # MIT license
└── package.json                # Project dependencies and scripts
```

### Key Components

#### ArtGenerator.vue

The main component for generating art, handling all user inputs, and managing the canvas.

#### Gallery.vue

Displays the user's saved artwork with options to view, delete, or share pieces.

#### Authentication Flow

Secure JWT-based authentication with refresh tokens and secure storage.

## 📈 Future Enhancements

- AI-assisted art generation
- Social sharing features
- Advanced filters and effects
- Animation capabilities
- Community galleries

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please check out the [Contributing Guide](CONTRIBUTING.md) for more details.

---

_This project was created as a portfolio piece demonstrating full-stack development skills including modern frontend frameworks, backend APIs, testing, and clean code practices._
