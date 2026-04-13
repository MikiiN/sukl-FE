<<<<<<< HEAD
# SÚKL API Web Interface 

A web interface developed as a Web Application course project to showcase the functionality of the SÚKL API.

## About The Project

This frontend application was built to provide a clean, user-friendly interface for the SÚKL (State Institute for Drug Control) API. It serves as a practical demonstration of integrating third-party/custom APIs into a modern web client, handling data fetching, and rendering dynamic content.

### Key Features
* **Search Functionality:** Easily search for medications and view detailed information.
* **Responsive Design:** Optimized for both desktop and mobile viewing.

## Built With

* **Framework:** React.js
* **Styling:** Bootstrap

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (version `[e.g., 16.x or higher]`)
* npm or yarn
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/MikiiN/sukl-FE.git
   ```
2. Navigate to the project directory:
   ```sh
   cd sukl-FE
   ```
3. Install NPM packages:
   ```sh
   npm install
   ```
4. Create a `.env` file in the root directory and configure your API endpoint (if applicable):
   ```env
   TODO
   ```
5. Start the development server:
   ```sh
   npm run dev
   ```

## 🔗 The SÚKL API

This application depends on the SÚKL API backend. 
* **Backend Repository:** [sukl-api](https://github.com/xpokhv00/sukl-api)

---
**Note:** *This project is for educational purposes and is not officially affiliated with SÚKL (Státní ústav pro kontrolu léčiv).*
=======
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
>>>>>>> 04a3f67 (project init)
