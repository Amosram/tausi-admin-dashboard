# Tausi Admin Dashboard

## Table of Contents
- [Tausi Admin Dashboard](#tausi-admin-dashboard)
  - [Table of Contents](#table-of-contents)
    - [Introduction](#introduction)
    - [Getting Started](#getting-started)
    - [Tools and Technologies](#tools-and-technologies)
    - [Folder Structure](#folder-structure)
    - [About the Template](#about-the-template)
      - [Expanding the ESLint configuration](#expanding-the-eslint-configuration)

### Introduction
- This is a dashboard for Tausi Admins to manage their data.

### Getting Started
- Clone the repository
- Install yarn if you don't have it installed using the following instructions [here](https://yarnpkg.com/getting-started/install)
- Run `yarn install` to install the dependencies.
- Run `yarn dev` to start the development server.

### Tools and Technologies

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tanstack Router](https://tanstack.com/router/latest/docs/framework/react/overview)
- [Shadcn UI](https://ui.shadcn.com/docs)
- [Vitest](https://vitest.dev/guide/)

### Folder Structure
```bash
tausi-admin-dashboard
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── robots.txt
├── src
│   ├── components
│   │   ├── layout
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   ├── ui (from shadcn ui)
│   │   ├── Input.tsx
│   ├── constants
│   │   ├── index.ts
│   │   ├── types.ts
│   ├── hooks
│   │   ├── useAuth.ts
│   │   ├── types.ts
│   ├── lib
│   ├── modules
│   │   ├── auth
│   │   │   ├── components
│   │   │   │   ├── LoginForm.tsx
│   │   │   ├── hooks
│   │   │   │   ├── useAuth.ts
│   │   │   ├── pages
│   │   │   │   ├── Login.tsx
│   │   │   ├── utils
│   │   │   │   ├── utils.tsx
│   │   ├── types.ts
│   ├── providers
│   │   ├── AuthProvider.tsx
│   ├── routes
│   │   ├── index.ts
│   ├── translations
│   ├── App.tsx
│   ├── index.tsx
```
- This is the general folder structure of the project. The project is divided into different modules to make it easier to manage the codebase.

### About the Template

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

#### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
