import { defineConfig } from 'vite';

export default defineConfig({
  // Define the root of your project (where your index.html file is)
  root: 'frontend',

  // Define the output directory for the build process
  build: {
    outDir: '../dist', // This outputs the build files up one directory from 'frontend'
  },

  // Define the base public path when serving or building the project
  // If you plan to deploy your site under a subdirectory, change this value
  base: '/',
});
