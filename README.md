# Webscrapest - Chrome Extension

A Chrome extension for analyzing websites, including performance metrics, SEO elements, and technology stack detection.

## Developer

Developed by: nrk navin

## Features

- Analyze website performance metrics
- Detect technologies used on the website
- Extract SEO-related information
- Simple and intuitive UI with Tailwind CSS
- Tabbed interface for organized results

## Project Structure

```
webscrapest/
├── dist/               # Compiled files (generated)
├── public/             # Static assets
│   ├── index.html      # HTML template
│   └── icons/          # Extension icons
├── src/                # Source files
│   ├── components/     # React components
│   │   ├── App.tsx     # Main application component
│   │   ├── ResultTabs.tsx  # Tabs navigation component
│   │   ├── ResultContent.tsx  # Content display component
│   │   └── LoadingSpinner.tsx  # Loading indicator component
│   ├── background.ts   # Extension background script
│   ├── content.ts      # Content script injected into pages
│   ├── popup.tsx       # Popup entry point
│   ├── types.ts        # TypeScript type definitions
│   └── index.css       # Global styles with Tailwind
├── manifest.json       # Extension manifest
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
└── webpack.config.js   # Webpack configuration
```

## Technology Stack

- **TypeScript**: For type-safe code
- **React**: For building the UI
- **Tailwind CSS**: For utility-first styling
- **Webpack**: For bundling
- **Chrome Extension API**: For browser integration

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/web-pulse.git
   cd web-pulse
   ```

2. Install dependencies:
   ```bash
   npm install
   # or with pnpm
   pnpm install
   ```

### Development

For local development with hot reloading:

```bash
npm run start
# or
pnpm start
```

This will start a development server at http://localhost:9000 where you can test the extension UI.

To build the extension in development mode with watch mode (auto-rebuilds on file changes):

```bash
npm run dev
# or
pnpm dev
```

### Production Build

To create a production build:

```bash
npm run build
# or
pnpm build
```

The compiled files will be in the `dist` directory.

### Production Build with Source Maps

To create a production build that includes source maps for debugging:

```bash
npm run build:debug
# or
pnpm build:debug
```

This will generate `.map` files alongside the JavaScript files in the `dist` directory, which can be used for debugging in Chrome DevTools.

### Building Just the Content Script

If you need to rebuild just the content script (for example, after making changes to it):

```bash
npm run build:content
# or
pnpm build:content
```

This will generate `content.js` and `content.js.map` in the `dist` directory without rebuilding the entire extension.

## Tailwind CSS Usage

This project uses Tailwind CSS for styling. The main benefits include:

- **Utility-first approach**: Write styles directly in your markup
- **Component-based design**: Create reusable components with consistent styling
- **Responsive design**: Easily create responsive layouts
- **Customization**: Tailwind configuration can be extended in `tailwind.config.js`

Example of Tailwind usage in the project:

```tsx
// Button component with Tailwind classes
<button
  className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
  onClick={handleClick}
>
  Click Me
</button>
```

## Loading the Extension in Chrome

1. Build the extension using `npm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the `dist` directory from this project
5. The extension should now be installed and visible in your Chrome toolbar

## Creating Icons

Before loading the extension, make sure to create icon files in the following sizes:
- 16x16 pixels
- 32x32 pixels
- 48x48 pixels
- 128x128 pixels

Place these files in a `public/icons` directory with the following names:
- icon16.png
- icon32.png
- icon48.png
- icon128.png

## License

MIT