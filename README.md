# Holidaze - Venue Booking Platform

![Holidaze Banner](https://i.imgur.com/gNcWGjo.png)

Holidaze is a modern venue booking platform built with React, TypeScript, and Material-UI. It allows users to browse, book, and manage venues for their perfect stay.

## Features

- 🏠 Browse and search venues by name, city, or country
- 📅 Check venue availability and make bookings
- 👤 User authentication and profile management
- 🏢 Venue manager dashboard for hosts
- 🌙 Light/Dark mode support
- 📱 Fully responsive design

## Demo

Netlify link: https://holidaze-werner.netlify.app/

You can try out the application using the demo account:
- Email: demotest@stud.noroff.no
- Password: demo123456

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/whamre/Holidaze.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run TypeScript type checking

## Project Structure

```
holidaze/
├── src/
│   ├── api/          # API configuration and utilities
│   ├── components/   # Reusable React components
│   ├── contexts/     # React context providers
│   ├── pages/        # Application pages/routes
│   ├── services/     # API service functions
│   ├── theme/        # Material-UI theme configuration
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
└── package.json      # Project dependencies and scripts
```

## API Documentation

This project uses the Noroff API. Documentation can be found at:
- [API Documentation](https://v2.api.noroff.dev/docs)

## Built With

- [React](https://reactjs.org/) 
- [TypeScript](https://www.typescriptlang.org/) 
- [Material-UI](https://mui.com/) 

## Contact

Werner Hamre - hamre.dev@gmail.com
