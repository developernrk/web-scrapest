import { Technology, TechnologyCategory, TechnologyCategories } from '../types';

/**
 * Detects technologies used on a website
 * Enhanced version with more comprehensive technology detection
 */
export function detectTechnologies(): {
  technologies: Technology[];
  technologyCategories: TechnologyCategories;
} {
  const technologies: Technology[] = [];
  
  // Get all scripts and their content
  const scriptElements = Array.from(document.querySelectorAll('script'));
  const scriptSrcs = scriptElements.map(s => s.src || '').filter(Boolean);

  // Only sample a small portion of inline scripts to avoid performance issues
  const inlineScripts = scriptElements
    .filter(s => !s.src && s.innerHTML)
    .slice(0, 10)
    .map(s => s.innerHTML.substring(0, 500))
    .join(' ');

  const scripts = [...scriptSrcs, inlineScripts];
  const links = Array.from(document.querySelectorAll('link')).map(l => l.href || '');
  const metas = Array.from(document.querySelectorAll('meta')).map(m => m.getAttribute('content') || '');
  const htmlContent = document.documentElement.innerHTML.toLowerCase();
  const allClasses = Array.from(document.querySelectorAll('[class]')).map(el => el.className).join(' ');
  const headers = Array.from(document.querySelectorAll('meta[name], meta[http-equiv]'))
    .map(m => `${m.getAttribute('name') || m.getAttribute('http-equiv')}: ${m.getAttribute('content')}`)
    .join(' ');

  // ==========================================
  // JavaScript Frameworks and Libraries
  // ==========================================
  try {
    // React
    if (
      ((window as any).React) ||
      document.querySelector('[data-reactroot], [data-reactid]') ||
      htmlContent.includes('_reactrootcontainer') ||
      scripts.some(s => s.includes('react'))
    ) {
      technologies.push({
        name: 'React',
        category: 'javascript-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
      });

      // Check for React-based frameworks
      if ((window as any).__NEXT_DATA__ || scripts.some(s => s.includes('/_next/') || s.includes('next.js'))) {
        technologies.push({
          name: 'Next.js',
          category: 'javascript-framework',
          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg'
        });
      }

      if (document.querySelector('#__gatsby') || scripts.some(s => s.includes('gatsby'))) {
        technologies.push({
          name: 'Gatsby',
          category: 'javascript-framework',
          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gatsby/gatsby-plain.svg'
        });
      }

      // React Query
      if (scripts.some(s => s.includes('react-query') || s.includes('tanstack'))) {
        technologies.push({
          name: 'React Query',
          category: 'javascript-library',
          icon: 'https://react-query.tanstack.com/img/logo.svg'
        });
      }

      // React Router
      if (scripts.some(s => s.includes('react-router'))) {
        technologies.push({
          name: 'React Router',
          category: 'javascript-library',
          icon: 'https://reactrouter.com/favicon.ico'
        });
      }

      // React Hook Form
      if (scripts.some(s => s.includes('react-hook-form'))) {
        technologies.push({
          name: 'React Hook Form',
          category: 'javascript-library',
          icon: 'https://react-hook-form.com/images/logo/react-hook-form-logo.png'
        });
      }

      // Formik
      if (scripts.some(s => s.includes('formik'))) {
        technologies.push({
          name: 'Formik',
          category: 'javascript-library',
          icon: 'https://user-images.githubusercontent.com/4060187/61057426-4e5a4600-a3c3-11e9-9114-630743e05814.png'
        });
      }
    }

    // Angular
    if (
      ((window as any).angular) ||
      document.querySelector('[ng-app], [ng-controller], [ng-model], [data-ng-app], [x-ng-app], [ng-version]') ||
      scripts.some(s => s.includes('angular'))
    ) {
      technologies.push({
        name: 'Angular',
        category: 'javascript-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg'
      });

      // Angular Material
      if (document.querySelector('[class*="mat-"], [class*="cdk-"]') || scripts.some(s => s.includes('angular/material'))) {
        technologies.push({
          name: 'Angular Material',
          category: 'ui-framework',
          icon: 'https://material.angular.io/assets/img/angular-material-logo.svg'
        });
      }

      // NgRx
      if (scripts.some(s => s.includes('ngrx'))) {
        technologies.push({
          name: 'NgRx',
          category: 'javascript-library',
          icon: 'https://ngrx.io/assets/images/badge.svg'
        });
      }
    }

    // Vue
    if (
      ((window as any).Vue) ||
      document.querySelector('[v-app], [v-bind], [v-model], [v-if], [v-for], [v-cloak], [v-on]') ||
      scripts.some(s => s.includes('vue.js') || s.includes('vue.min.js'))
    ) {
      technologies.push({
        name: 'Vue.js',
        category: 'javascript-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg'
      });

      // Check for Nuxt.js
      if ((window as any).__NUXT__ || scripts.some(s => s.includes('nuxt'))) {
        technologies.push({
          name: 'Nuxt.js',
          category: 'javascript-framework',
          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg'
        });
      }

      // Vuex
      if (scripts.some(s => s.includes('vuex'))) {
        technologies.push({
          name: 'Vuex',
          category: 'javascript-library',
          icon: 'https://vuex.vuejs.org/logo.png'
        });
      }

      // Vue Router
      if (scripts.some(s => s.includes('vue-router'))) {
        technologies.push({
          name: 'Vue Router',
          category: 'javascript-library',
          icon: 'https://router.vuejs.org/logo.png'
        });
      }

      // Vuetify
      if (document.querySelector('[class*="v-"]') || scripts.some(s => s.includes('vuetify'))) {
        technologies.push({
          name: 'Vuetify',
          category: 'ui-framework',
          icon: 'https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png'
        });
      }

      // Quasar
      if (document.querySelector('[class*="q-"]') || scripts.some(s => s.includes('quasar'))) {
        technologies.push({
          name: 'Quasar',
          category: 'ui-framework',
          icon: 'https://cdn.quasar.dev/logo-v2/svg/logo.svg'
        });
      }
    }

    // jQuery
    if (
      ((window as any).jQuery) ||
      ((window as any).$) ||
      scripts.some(s => s.includes('jquery'))
    ) {
      technologies.push({
        name: 'jQuery',
        category: 'javascript-library',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg'
      });

      // jQuery UI
      if (scripts.some(s => s.includes('jquery-ui'))) {
        technologies.push({
          name: 'jQuery UI',
          category: 'ui-framework',
          icon: 'https://jqueryui.com/jquery-wp-content/themes/jqueryui.com/i/favicon.ico'
        });
      }
    }

    // Svelte
    if (
      document.querySelector('[data-svelte], [class*="svelte-"]') ||
      scripts.some(s => s.includes('svelte'))
    ) {
      technologies.push({
        name: 'Svelte',
        category: 'javascript-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg'
      });

      // SvelteKit
      if (scripts.some(s => s.includes('sveltekit') || s.includes('@sveltejs/kit'))) {
        technologies.push({
          name: 'SvelteKit',
          category: 'javascript-framework',
          icon: 'https://kit.svelte.dev/favicon.png'
        });
      }
    }

    // Preact
    if (
      scripts.some(s => s.includes('preact')) ||
      htmlContent.includes('preact')
    ) {
      technologies.push({
        name: 'Preact',
        category: 'javascript-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/preact/preact-original.svg'
      });
    }

    // Ember.js
    if (
      ((window as any).Ember) ||
      scripts.some(s => s.includes('ember')) ||
      document.querySelector('.ember-view')
    ) {
      technologies.push({
        name: 'Ember.js',
        category: 'javascript-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ember/ember-original-wordmark.svg'
      });
    }

    // Alpine.js
    if (
      scripts.some(s => s.includes('alpine.js') || s.includes('alpinejs')) ||
      document.querySelector('[x-data], [x-bind], [x-on]')
    ) {
      technologies.push({
        name: 'Alpine.js',
        category: 'javascript-library',
        icon: 'https://alpinejs.dev/favicon.png'
      });
    }

    // Solid.js
    if (scripts.some(s => s.includes('solid-js') || s.includes('solid.js'))) {
      technologies.push({
        name: 'Solid.js',
        category: 'javascript-framework',
        icon: 'https://www.solidjs.com/img/logo.svg'
      });
    }

    // Lit
    if (scripts.some(s => s.includes('lit-element') || s.includes('lit-html') || s.includes('@lit/'))) {
      technologies.push({
        name: 'Lit',
        category: 'javascript-library',
        icon: 'https://lit.dev/images/flame-favicon.svg'
      });
    }

    // Stencil
    if (scripts.some(s => s.includes('stencil'))) {
      technologies.push({
        name: 'Stencil',
        category: 'javascript-framework',
        icon: 'https://stenciljs.com/assets/img/icon.png'
      });
    }

    // Qwik
    if (scripts.some(s => s.includes('qwik'))) {
      technologies.push({
        name: 'Qwik',
        category: 'javascript-framework',
        icon: 'https://qwik.builder.io/favicon.ico'
      });
    }

    // Astro
    if (scripts.some(s => s.includes('astro'))) {
      technologies.push({
        name: 'Astro',
        category: 'javascript-framework',
        icon: 'https://astro.build/favicon.svg'
      });
    }

    // State Management Libraries
    // Redux
    if (scripts.some(s => s.includes('redux'))) {
      technologies.push({
        name: 'Redux',
        category: 'javascript-library',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg'
      });

      // Redux Toolkit
      if (scripts.some(s => s.includes('redux-toolkit') || s.includes('@reduxjs/toolkit'))) {
        technologies.push({
          name: 'Redux Toolkit',
          category: 'javascript-library',
          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg'
        });
      }
    }

    // MobX
    if (scripts.some(s => s.includes('mobx'))) {
      technologies.push({
        name: 'MobX',
        category: 'javascript-library',
        icon: 'https://mobx.js.org/assets/mobx.png'
      });
    }

    // Zustand
    if (scripts.some(s => s.includes('zustand'))) {
      technologies.push({
        name: 'Zustand',
        category: 'javascript-library',
        icon: 'https://raw.githubusercontent.com/pmndrs/zustand/main/bear.jpg'
      });
    }

    // Recoil
    if (scripts.some(s => s.includes('recoil'))) {
      technologies.push({
        name: 'Recoil',
        category: 'javascript-library',
        icon: 'https://recoiljs.org/img/favicon.png'
      });
    }

    // Jotai
    if (scripts.some(s => s.includes('jotai'))) {
      technologies.push({
        name: 'Jotai',
        category: 'javascript-library',
        icon: 'https://jotai.org/favicon.svg'
      });
    }

    // Utility Libraries
    // Lodash
    if (((window as any)._ && typeof (window as any)._ === 'function') || scripts.some(s => s.includes('lodash'))) {
      technologies.push({
        name: 'Lodash',
        category: 'javascript-library',
        icon: 'https://lodash.com/assets/img/lodash.svg'
      });
    }

    // Ramda
    if (scripts.some(s => s.includes('ramda'))) {
      technologies.push({
        name: 'Ramda',
        category: 'javascript-library',
        icon: 'https://ramdajs.com/favicon.ico'
      });
    }

    // Underscore
    if (((window as any)._ && !(window as any)._.chain) || scripts.some(s => s.includes('underscore'))) {
      technologies.push({
        name: 'Underscore.js',
        category: 'javascript-library',
        icon: 'https://underscorejs.org/favicon.ico'
      });
    }

    // Date Libraries
    // Moment.js
    if (((window as any).moment) || scripts.some(s => s.includes('moment.'))) {
      technologies.push({
        name: 'Moment.js',
        category: 'javascript-library',
        icon: 'https://momentjs.com/static/img/moment-favicon.png'
      });
    }

    // Day.js
    if (scripts.some(s => s.includes('dayjs'))) {
      technologies.push({
        name: 'Day.js',
        category: 'javascript-library',
        icon: 'https://day.js.org/img/favicon.png'
      });
    }

    // date-fns
    if (scripts.some(s => s.includes('date-fns'))) {
      technologies.push({
        name: 'date-fns',
        category: 'javascript-library',
        icon: 'https://date-fns.org/favicon.ico'
      });
    }

    // HTTP Libraries
    // Axios
    if (((window as any).axios) || scripts.some(s => s.includes('axios'))) {
      technologies.push({
        name: 'Axios',
        category: 'javascript-library',
        icon: 'https://axios-http.com/assets/favicon.ico'
      });
    }

    // SWR
    if (scripts.some(s => s.includes('swr'))) {
      technologies.push({
        name: 'SWR',
        category: 'javascript-library',
        icon: 'https://swr.vercel.app/favicon.png'
      });
    }

    // GraphQL
    if (scripts.some(s => s.includes('graphql'))) {
      technologies.push({
        name: 'GraphQL',
        category: 'backend',
        icon: 'https://graphql.org/img/logo.svg'
      });

      // Apollo Client
      if (scripts.some(s => s.includes('apollo'))) {
        technologies.push({
          name: 'Apollo Client',
          category: 'javascript-library',
          icon: 'https://www.apollographql.com/favicon.ico'
        });
      }

      // Relay
      if (scripts.some(s => s.includes('relay'))) {
        technologies.push({
          name: 'Relay',
          category: 'javascript-library',
          icon: 'https://relay.dev/img/favicon.ico'
        });
      }

      // URQL
      if (scripts.some(s => s.includes('urql'))) {
        technologies.push({
          name: 'URQL',
          category: 'javascript-library',
          icon: 'https://formidable.com/open-source/urql/favicon.ico'
        });
      }
    }

    // Testing Libraries
    // Jest
    if (scripts.some(s => s.includes('jest'))) {
      technologies.push({
        name: 'Jest',
        category: 'javascript-library',
        icon: 'https://jestjs.io/img/favicon/favicon.ico'
      });
    }

    // Testing Library
    if (scripts.some(s => s.includes('testing-library'))) {
      technologies.push({
        name: 'Testing Library',
        category: 'javascript-library',
        icon: 'https://testing-library.com/img/octopus-64x64.png'
      });
    }

    // Cypress
    if (scripts.some(s => s.includes('cypress'))) {
      technologies.push({
        name: 'Cypress',
        category: 'javascript-library',
        icon: 'https://www.cypress.io/icons/icon-48x48.png'
      });
    }

    // Playwright
    if (scripts.some(s => s.includes('playwright'))) {
      technologies.push({
        name: 'Playwright',
        category: 'javascript-library',
        icon: 'https://playwright.dev/img/playwright-logo.svg'
      });
    }

    // Animation Libraries
    // GSAP
    if (((window as any).gsap) || scripts.some(s => s.includes('gsap') || s.includes('TweenMax'))) {
      technologies.push({
        name: 'GSAP',
        category: 'javascript-library',
        icon: 'https://greensock.com/favicon.ico'
      });
    }

    // Framer Motion
    if (scripts.some(s => s.includes('framer-motion'))) {
      technologies.push({
        name: 'Framer Motion',
        category: 'javascript-library',
        icon: 'https://www.framer.com/images/favicon.png'
      });
    }

    // Three.js
    if (((window as any).THREE) || scripts.some(s => s.includes('three.js') || s.includes('three/build'))) {
      technologies.push({
        name: 'Three.js',
        category: 'javascript-library',
        icon: 'https://threejs.org/files/favicon.ico'
      });
    }

    // Anime.js
    if (((window as any).anime) || scripts.some(s => s.includes('anime.js') || s.includes('animejs'))) {
      technologies.push({
        name: 'Anime.js',
        category: 'javascript-library',
        icon: 'https://animejs.com/documentation/assets/img/favicon.png'
      });
    }

    // Lottie
    if (scripts.some(s => s.includes('lottie'))) {
      technologies.push({
        name: 'Lottie',
        category: 'javascript-library',
        icon: 'https://airbnb.design/wp-content/themes/airbnb-cereal/images/favicon.ico'
      });
    }

    // Data Visualization
    // D3.js
    if (((window as any).d3) || scripts.some(s => s.includes('d3.js') || s.includes('d3.min.js'))) {
      technologies.push({
        name: 'D3.js',
        category: 'javascript-library',
        icon: 'https://d3js.org/favicon.png'
      });
    }

    // Chart.js
    if (((window as any).Chart) || scripts.some(s => s.includes('chart.js'))) {
      technologies.push({
        name: 'Chart.js',
        category: 'javascript-library',
        icon: 'https://www.chartjs.org/favicon.ico'
      });
    }

    // Highcharts
    if (((window as any).Highcharts) || scripts.some(s => s.includes('highcharts'))) {
      technologies.push({
        name: 'Highcharts',
        category: 'javascript-library',
        icon: 'https://www.highcharts.com/favicon.ico'
      });
    }

    // ApexCharts
    if (((window as any).ApexCharts) || scripts.some(s => s.includes('apexcharts'))) {
      technologies.push({
        name: 'ApexCharts',
        category: 'javascript-library',
        icon: 'https://apexcharts.com/wp-content/themes/apexcharts/favicon.ico'
      });
    }

    // ECharts
    if (((window as any).echarts) || scripts.some(s => s.includes('echarts'))) {
      technologies.push({
        name: 'ECharts',
        category: 'javascript-library',
        icon: 'https://echarts.apache.org/en/images/favicon.png'
      });
    }

    // Recharts
    if (scripts.some(s => s.includes('recharts'))) {
      technologies.push({
        name: 'Recharts',
        category: 'javascript-library',
        icon: 'https://recharts.org/static/favicon.png'
      });
    }

    // Build Tools
    // Webpack
    if (scripts.some(s => s.includes('webpack'))) {
      technologies.push({
        name: 'Webpack',
        category: 'javascript-library',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg'
      });
    }

    // Vite
    if (scripts.some(s => s.includes('vite'))) {
      technologies.push({
        name: 'Vite',
        category: 'javascript-library',
        icon: 'https://vitejs.dev/logo.svg'
      });
    }

    // Parcel
    if (scripts.some(s => s.includes('parcel'))) {
      technologies.push({
        name: 'Parcel',
        category: 'javascript-library',
        icon: 'https://parceljs.org/favicon.ico'
      });
    }

    // Rollup
    if (scripts.some(s => s.includes('rollup'))) {
      technologies.push({
        name: 'Rollup',
        category: 'javascript-library',
        icon: 'https://rollupjs.org/favicon.png'
      });
    }

    // esbuild
    if (scripts.some(s => s.includes('esbuild'))) {
      technologies.push({
        name: 'esbuild',
        category: 'javascript-library',
        icon: 'https://esbuild.github.io/favicon.svg'
      });
    }

    // TypeScript
    if (scripts.some(s => s.includes('typescript') || s.includes('.ts'))) {
      technologies.push({
        name: 'TypeScript',
        category: 'javascript-library',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'
      });
    }

    // Babel
    if (scripts.some(s => s.includes('babel'))) {
      technologies.push({
        name: 'Babel',
        category: 'javascript-library',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/babel/babel-original.svg'
      });
    }
  } catch (e) {
    // Ignore errors in framework detection
  }

  // ==========================================
  // CSS Frameworks and UI Libraries
  // ==========================================
  try {
    // Bootstrap
    if (
      document.querySelector('[class*="navbar-"], [class*="btn-"], [class*="modal-"], .container, .row, .col') ||
      links.some(l => l.includes('bootstrap')) ||
      scripts.some(s => s.includes('bootstrap'))
    ) {
      technologies.push({
        name: 'Bootstrap',
        category: 'css-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg'
      });
    }

    // Tailwind
    if (
      allClasses.match(/\b(md|lg|xl):[\w-]+\b/) ||
      document.querySelector('[class*="text-"], [class*="bg-"], [class*="border-"], [class*="rounded-"], [class*="flex-"], [class*="grid-"], [class*="p-"], [class*="m-"]') ||
      links.some(l => l.includes('tailwind'))
    ) {
      technologies.push({
        name: 'Tailwind CSS',
        category: 'css-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg'
      });

      // Headless UI
      if (scripts.some(s => s.includes('headlessui'))) {
        technologies.push({
          name: 'Headless UI',
          category: 'ui-framework',
          icon: 'https://headlessui.dev/favicon.ico'
        });
      }

      // Tailwind UI
      if (document.querySelector('[class*="ui-"]') || scripts.some(s => s.includes('tailwindui'))) {
        technologies.push({
          name: 'Tailwind UI',
          category: 'ui-framework',
          icon: 'https://tailwindui.com/favicon-32x32.png'
        });
      }
    }

    // Material Design
    if (
      document.querySelector('.mat-button, .mat-card, .mat-dialog-container, .mdl-button, .mdl-card, .material-icons') ||
      links.some(l => l.includes('material')) ||
      scripts.some(s => s.includes('material'))
    ) {
      technologies.push({
        name: 'Material Design',
        category: 'ui-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg'
      });
    }

    // Material UI (MUI)
    if (
      document.querySelector('[class*="MuiButton-"], [class*="MuiAppBar-"], [class*="MuiDrawer-"]') ||
      scripts.some(s => s.includes('mui') || s.includes('material-ui'))
    ) {
      technologies.push({
        name: 'Material UI',
        category: 'ui-framework',
        icon: 'https://mui.com/static/favicon.ico'
      });
    }

    // Bulma
    if (
      document.querySelector('.columns, .column, .hero, .navbar, .button.is-') ||
      links.some(l => l.includes('bulma'))
    ) {
      technologies.push({
        name: 'Bulma',
        category: 'css-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bulma/bulma-plain.svg'
      });
    }

    // Foundation
    if (
      document.querySelector('.top-bar, .callout, .orbit, .reveal, .switch') ||
      links.some(l => l.includes('foundation'))
    ) {
      technologies.push({
        name: 'Foundation',
        category: 'css-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/foundation/foundation-original.svg'
      });
    }

    // Chakra UI
    if (
      document.querySelector('[class*="chakra-"]') ||
      scripts.some(s => s.includes('chakra'))
    ) {
      technologies.push({
        name: 'Chakra UI',
        category: 'ui-framework',
        icon: 'https://raw.githubusercontent.com/chakra-ui/chakra-ui/main/logo/logomark-colored.svg'
      });
    }

    // Ant Design
    if (
      document.querySelector('.ant-btn, .ant-input, .ant-select, .ant-layout') ||
      scripts.some(s => s.includes('antd'))
    ) {
      technologies.push({
        name: 'Ant Design',
        category: 'ui-framework',
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
      });
    }

    // Semantic UI
    if (
      document.querySelector('.ui.button, .ui.menu, .ui.grid, .ui.header') ||
      scripts.some(s => s.includes('semantic-ui'))
    ) {
      technologies.push({
        name: 'Semantic UI',
        category: 'ui-framework',
        icon: 'https://semantic-ui.com/images/logo.png'
      });
    }

    // Mantine
    if (
      document.querySelector('[class*="mantine-"]') ||
      scripts.some(s => s.includes('mantine'))
    ) {
      technologies.push({
        name: 'Mantine',
        category: 'ui-framework',
        icon: 'https://mantine.dev/favicon.svg'
      });
    }

    // Radix UI
    if (scripts.some(s => s.includes('radix-ui'))) {
      technologies.push({
        name: 'Radix UI',
        category: 'ui-framework',
        icon: 'https://www.radix-ui.com/favicon.ico'
      });
    }

    // Primer
    if (
      document.querySelector('[class*="primer-"]') ||
      scripts.some(s => s.includes('primer'))
    ) {
      technologies.push({
        name: 'Primer',
        category: 'ui-framework',
        icon: 'https://primer.style/favicon.ico'
      });
    }

    // Daisy UI
    if (
      document.querySelector('[class*="daisy-"]') ||
      scripts.some(s => s.includes('daisyui'))
    ) {
      technologies.push({
        name: 'Daisy UI',
        category: 'ui-framework',
        icon: 'https://daisyui.com/favicon.ico'
      });
    }

    // PrimeReact / PrimeVue / PrimeNG
    if (
      document.querySelector('[class*="p-"]') ||
      scripts.some(s => s.includes('primereact') || s.includes('primevue') || s.includes('primeng'))
    ) {
      if (scripts.some(s => s.includes('primereact'))) {
        technologies.push({
          name: 'PrimeReact',
          category: 'ui-framework',
          icon: 'https://primefaces.org/cdn/primereact/images/favicon.ico'
        });
      } else if (scripts.some(s => s.includes('primevue'))) {
        technologies.push({
          name: 'PrimeVue',
          category: 'ui-framework',
          icon: 'https://primefaces.org/cdn/primevue/images/favicon.ico'
        });
      } else if (scripts.some(s => s.includes('primeng'))) {
        technologies.push({
          name: 'PrimeNG',
          category: 'ui-framework',
          icon: 'https://primefaces.org/cdn/primeng/images/favicon.ico'
        });
      }
    }

    // Styled Components
    if (scripts.some(s => s.includes('styled-components'))) {
      technologies.push({
        name: 'Styled Components',
        category: 'css-framework',
        icon: 'https://www.styled-components.com/favicon.png'
      });
    }

    // Emotion
    if (scripts.some(s => s.includes('emotion'))) {
      technologies.push({
        name: 'Emotion',
        category: 'css-framework',
        icon: 'https://emotion.sh/favicon.ico'
      });
    }

    // CSS Modules
    if (document.querySelector('[class*="module_"]') || document.querySelector('[class*="module__"]')) {
      technologies.push({
        name: 'CSS Modules',
        category: 'css-framework',
        icon: 'https://github.com/css-modules/logos/raw/master/css-modules-logo.png'
      });
    }

    // SASS/SCSS
    if (links.some(l => l.includes('.scss') || l.includes('.sass'))) {
      technologies.push({
        name: 'SASS',
        category: 'css-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg'
      });
    }

    // LESS
    if (links.some(l => l.includes('.less'))) {
      technologies.push({
        name: 'LESS',
        category: 'css-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/less/less-plain-wordmark.svg'
      });
    }

    // PostCSS
    if (scripts.some(s => s.includes('postcss'))) {
      technologies.push({
        name: 'PostCSS',
        category: 'css-framework',
        icon: 'https://postcss.org/assets/logo-3e39b0aa.svg'
      });
    }
  } catch (e) {
    // Ignore errors in CSS framework detection
  }

  // ==========================================
  // Analytics and Marketing
  // ==========================================
  try {
    // Google Analytics
    if (
      ((window as any).ga) ||
      ((window as any).gtag) ||
      ((window as any).dataLayer) ||
      ((window as any).google_tag_manager) ||
      scripts.some(s => s.includes('google-analytics.com') || s.includes('googletagmanager'))
    ) {
      technologies.push({
        name: 'Google Analytics',
        category: 'analytics',
        icon: 'https://www.google.com/analytics/images/ga_icon_256.png'
      });
    }

    // Google Tag Manager
    if (
      ((window as any).dataLayer) ||
      scripts.some(s => s.includes('googletagmanager'))
    ) {
      technologies.push({
        name: 'Google Tag Manager',
        category: 'analytics',
        icon: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_tag_manager.svg'
      });
    }

    // Facebook Pixel
    if (
      ((window as any).fbq) ||
      scripts.some(s => s.includes('connect.facebook.net') || s.includes('facebook-pixel'))
    ) {
      technologies.push({
        name: 'Facebook Pixel',
        category: 'marketing',
        icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/R_1BAhxMP5I.png'
      });
    }

    // HubSpot
    if (
      ((window as any)._hsq) ||
      scripts.some(s => s.includes('js.hs-scripts.com') || s.includes('hubspot'))
    ) {
      technologies.push({
        name: 'HubSpot',
        category: 'marketing',
        icon: 'https://cdn.worldvectorlogo.com/logos/hubspot-1.svg'
      });
    }

    // Hotjar
    if (
      ((window as any).hj) ||
      scripts.some(s => s.includes('static.hotjar.com'))
    ) {
      technologies.push({
        name: 'Hotjar',
        category: 'analytics',
        icon: 'https://www.hotjar.com/images/hotjar-icon-180.png'
      });
    }

    // Mixpanel
    if (
      ((window as any).mixpanel) ||
      scripts.some(s => s.includes('mixpanel'))
    ) {
      technologies.push({
        name: 'Mixpanel',
        category: 'analytics',
        icon: 'https://cdn.worldvectorlogo.com/logos/mixpanel.svg'
      });
    }

    // Amplitude
    if (
      ((window as any).amplitude) ||
      scripts.some(s => s.includes('amplitude'))
    ) {
      technologies.push({
        name: 'Amplitude',
        category: 'analytics',
        icon: 'https://cdn.worldvectorlogo.com/logos/amplitude-1.svg'
      });
    }

    // Plausible
    if (
      scripts.some(s => s.includes('plausible.io'))
    ) {
      technologies.push({
        name: 'Plausible',
        category: 'analytics',
        icon: 'https://plausible.io/images/icon/favicon.svg'
      });
    }

    // Fathom
    if (
      scripts.some(s => s.includes('fathom.'))
    ) {
      technologies.push({
        name: 'Fathom',
        category: 'analytics',
        icon: 'https://usefathom.com/assets/favicon.svg'
      });
    }

    // Simple Analytics
    if (
      scripts.some(s => s.includes('simpleanalytics'))
    ) {
      technologies.push({
        name: 'Simple Analytics',
        category: 'analytics',
        icon: 'https://simpleanalytics.com/favicon.svg'
      });
    }

    // Matomo (Piwik)
    if (
      ((window as any)._paq) ||
      scripts.some(s => s.includes('matomo') || s.includes('piwik'))
    ) {
      technologies.push({
        name: 'Matomo',
        category: 'analytics',
        icon: 'https://matomo.org/wp-content/uploads/2018/11/matomo_favicon.png'
      });
    }

    // Segment
    if (
      ((window as any).analytics) ||
      scripts.some(s => s.includes('segment.com') || s.includes('segment.io'))
    ) {
      technologies.push({
        name: 'Segment',
        category: 'analytics',
        icon: 'https://segment.com/favicon.ico'
      });
    }

    // Heap
    if (
      ((window as any).heap) ||
      scripts.some(s => s.includes('heap.io'))
    ) {
      technologies.push({
        name: 'Heap',
        category: 'analytics',
        icon: 'https://heap.io/favicon.ico'
      });
    }

    // Fullstory
    if (
      ((window as any).FS) ||
      scripts.some(s => s.includes('fullstory.com'))
    ) {
      technologies.push({
        name: 'Fullstory',
        category: 'analytics',
        icon: 'https://www.fullstory.com/favicon.ico'
      });
    }

    // LogRocket
    if (
      ((window as any).LogRocket) ||
      scripts.some(s => s.includes('logrocket.com'))
    ) {
      technologies.push({
        name: 'LogRocket',
        category: 'analytics',
        icon: 'https://logrocket.com/favicon.ico'
      });
    }

    // Mouseflow
    if (
      ((window as any).mouseflow) ||
      scripts.some(s => s.includes('mouseflow.com'))
    ) {
      technologies.push({
        name: 'Mouseflow',
        category: 'analytics',
        icon: 'https://mouseflow.com/favicon.ico'
      });
    }

    // Crazy Egg
    if (
      scripts.some(s => s.includes('crazyegg.com'))
    ) {
      technologies.push({
        name: 'Crazy Egg',
        category: 'analytics',
        icon: 'https://www.crazyegg.com/favicon.ico'
      });
    }

    // Lucky Orange
    if (
      ((window as any).__lo_cs_added) ||
      scripts.some(s => s.includes('luckyorange.com'))
    ) {
      technologies.push({
        name: 'Lucky Orange',
        category: 'analytics',
        icon: 'https://www.luckyorange.com/favicon.ico'
      });
    }

    // Optimizely
    if (
      ((window as any).optimizely) ||
      scripts.some(s => s.includes('optimizely.com'))
    ) {
      technologies.push({
        name: 'Optimizely',
        category: 'marketing',
        icon: 'https://www.optimizely.com/favicon.ico'
      });
    }

    // VWO (Visual Website Optimizer)
    if (
      ((window as any)._vwo_code) ||
      scripts.some(s => s.includes('vwo.com'))
    ) {
      technologies.push({
        name: 'VWO',
        category: 'marketing',
        icon: 'https://vwo.com/favicon.ico'
      });
    }

    // AB Tasty
    if (
      ((window as any).ABTasty) ||
      scripts.some(s => s.includes('abtasty.com'))
    ) {
      technologies.push({
        name: 'AB Tasty',
        category: 'marketing',
        icon: 'https://www.abtasty.com/favicon.ico'
      });
    }

    // Convert
    if (
      scripts.some(s => s.includes('convert.com'))
    ) {
      technologies.push({
        name: 'Convert',
        category: 'marketing',
        icon: 'https://www.convert.com/favicon.ico'
      });
    }

    // Intercom
    if (
      ((window as any).Intercom) ||
      scripts.some(s => s.includes('intercom.io') || s.includes('intercom.com'))
    ) {
      technologies.push({
        name: 'Intercom',
        category: 'marketing',
        icon: 'https://www.intercom.com/favicon.ico'
      });
    }

    // Drift
    if (
      ((window as any).drift) ||
      scripts.some(s => s.includes('drift.com'))
    ) {
      technologies.push({
        name: 'Drift',
        category: 'marketing',
        icon: 'https://www.drift.com/favicon.ico'
      });
    }

    // Zendesk
    if (
      ((window as any).zE) ||
      scripts.some(s => s.includes('zendesk.com'))
    ) {
      technologies.push({
        name: 'Zendesk',
        category: 'marketing',
        icon: 'https://www.zendesk.com/favicon.ico'
      });
    }

    // Crisp
    if (
      ((window as any).$crisp) ||
      scripts.some(s => s.includes('crisp.chat'))
    ) {
      technologies.push({
        name: 'Crisp',
        category: 'marketing',
        icon: 'https://crisp.chat/favicon.ico'
      });
    }

    // Tawk.to
    if (
      ((window as any).Tawk_API) ||
      scripts.some(s => s.includes('tawk.to'))
    ) {
      technologies.push({
        name: 'Tawk.to',
        category: 'marketing',
        icon: 'https://tawk.to/favicon.ico'
      });
    }

    // LiveChat
    if (
      ((window as any).__lc) ||
      scripts.some(s => s.includes('livechatinc.com'))
    ) {
      technologies.push({
        name: 'LiveChat',
        category: 'marketing',
        icon: 'https://www.livechat.com/favicon.ico'
      });
    }

    // Olark
    if (
      ((window as any).olark) ||
      scripts.some(s => s.includes('olark.com'))
    ) {
      technologies.push({
        name: 'Olark',
        category: 'marketing',
        icon: 'https://www.olark.com/favicon.ico'
      });
    }

    // Freshchat
    if (
      scripts.some(s => s.includes('freshchat.com'))
    ) {
      technologies.push({
        name: 'Freshchat',
        category: 'marketing',
        icon: 'https://www.freshworks.com/favicon.ico'
      });
    }

    // Mailchimp
    if (
      scripts.some(s => s.includes('mailchimp.com') || s.includes('list-manage.com'))
    ) {
      technologies.push({
        name: 'Mailchimp',
        category: 'marketing',
        icon: 'https://mailchimp.com/favicon.ico'
      });
    }

    // Klaviyo
    if (
      ((window as any)._learnq) ||
      scripts.some(s => s.includes('klaviyo.com'))
    ) {
      technologies.push({
        name: 'Klaviyo',
        category: 'marketing',
        icon: 'https://www.klaviyo.com/favicon.ico'
      });
    }

    // Braze (Appboy)
    if (
      ((window as any).appboy) ||
      scripts.some(s => s.includes('braze.com') || s.includes('appboy.com'))
    ) {
      technologies.push({
        name: 'Braze',
        category: 'marketing',
        icon: 'https://www.braze.com/favicon.ico'
      });
    }

    // Customer.io
    if (
      scripts.some(s => s.includes('customer.io'))
    ) {
      technologies.push({
        name: 'Customer.io',
        category: 'marketing',
        icon: 'https://customer.io/favicon.ico'
      });
    }
  } catch (e) {
    // Ignore errors in analytics detection
  }

  // ==========================================
  // CMS and E-commerce
  // ==========================================
  try {
    // WordPress
    if (
      document.querySelector('link[href*="wp-content"], link[href*="wp-includes"], img[src*="wp-content"], [class*="wp-"]') ||
      metas.some(m => m && m.includes('WordPress')) ||
      scripts.some(s => s.includes('wp-content') || s.includes('wp-includes'))
    ) {
      technologies.push({
        name: 'WordPress',
        category: 'cms',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg'
      });

      // WooCommerce (WordPress e-commerce)
      if (
        document.querySelector('.woocommerce, [class*="woocommerce-"]') ||
        scripts.some(s => s.includes('woocommerce'))
      ) {
        technologies.push({
          name: 'WooCommerce',
          category: 'ecommerce',
          icon: 'https://cdn.worldvectorlogo.com/logos/woocommerce.svg'
        });
      }

      // Elementor
      if (
        document.querySelector('.elementor, [class*="elementor-"]') ||
        scripts.some(s => s.includes('elementor'))
      ) {
        technologies.push({
          name: 'Elementor',
          category: 'cms',
          icon: 'https://elementor.com/favicon.ico'
        });
      }

      // Divi
      if (
        document.querySelector('.et-db, [class*="et_"]') ||
        scripts.some(s => s.includes('divi'))
      ) {
        technologies.push({
          name: 'Divi',
          category: 'cms',
          icon: 'https://www.elegantthemes.com/favicon.ico'
        });
      }

      // Beaver Builder
      if (
        document.querySelector('.fl-builder, [class*="fl-"]') ||
        scripts.some(s => s.includes('beaver-builder'))
      ) {
        technologies.push({
          name: 'Beaver Builder',
          category: 'cms',
          icon: 'https://www.wpbeaverbuilder.com/favicon.ico'
        });
      }

      // Yoast SEO
      if (
        metas.some(m => m && m.includes('Yoast')) ||
        scripts.some(s => s.includes('yoast'))
      ) {
        technologies.push({
          name: 'Yoast SEO',
          category: 'cms',
          icon: 'https://yoast.com/favicon.ico'
        });
      }
    }

    // Drupal
    if (
      document.querySelector('[class*="drupal-"]') ||
      metas.some(m => m && m.includes('Drupal')) ||
      scripts.some(s => s.includes('drupal'))
    ) {
      technologies.push({
        name: 'Drupal',
        category: 'cms',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/drupal/drupal-original.svg'
      });
    }

    // Joomla
    if (
      metas.some(m => m && m.includes('Joomla')) ||
      scripts.some(s => s.includes('joomla'))
    ) {
      technologies.push({
        name: 'Joomla',
        category: 'cms',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/joomla/joomla-original.svg'
      });
    }

    // Shopify
    if (
      (window as any).Shopify ||
      metas.some(m => m && m.includes('Shopify')) ||
      scripts.some(s => s.includes('shopify'))
    ) {
      technologies.push({
        name: 'Shopify',
        category: 'ecommerce',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg'
      });
    }

    // Wix
    if (
      document.querySelector('html[style*="wix"], img[src*="wixstatic"]') ||
      metas.some(m => m && m.includes('Wix')) ||
      scripts.some(s => s.includes('static.wixstatic.com'))
    ) {
      technologies.push({
        name: 'Wix',
        category: 'cms',
        icon: 'https://www.wix.com/favicon.ico'
      });
    }

    // Squarespace
    if (
      document.querySelector('[data-block-type]') ||
      metas.some(m => m && m.includes('Squarespace')) ||
      scripts.some(s => s.includes('squarespace'))
    ) {
      technologies.push({
        name: 'Squarespace',
        category: 'cms',
        icon: 'https://static1.squarespace.com/static/ta/5134cbefe4b0c6fb04df8065/10515/assets/favicon.ico'
      });
    }

    // Ghost
    if (
      document.querySelector('[data-ghost], [class*="gh-"]') ||
      scripts.some(s => s.includes('ghost'))
    ) {
      technologies.push({
        name: 'Ghost',
        category: 'cms',
        icon: 'https://ghost.org/images/logos/ghost-logo-orb.png'
      });
    }

    // Contentful
    if (
      scripts.some(s => s.includes('contentful'))
    ) {
      technologies.push({
        name: 'Contentful',
        category: 'cms',
        icon: 'https://www.contentful.com/favicon.ico'
      });
    }

    // Strapi
    if (
      scripts.some(s => s.includes('strapi'))
    ) {
      technologies.push({
        name: 'Strapi',
        category: 'cms',
        icon: 'https://strapi.io/assets/favicon-32x32.png'
      });
    }

    // Sanity
    if (
      scripts.some(s => s.includes('sanity.io'))
    ) {
      technologies.push({
        name: 'Sanity',
        category: 'cms',
        icon: 'https://www.sanity.io/static/favicon.ico'
      });
    }

    // Prismic
    if (
      scripts.some(s => s.includes('prismic.io'))
    ) {
      technologies.push({
        name: 'Prismic',
        category: 'cms',
        icon: 'https://prismic.io/favicon.ico'
      });
    }

    // Webflow
    if (
      document.querySelector('html[data-wf-site], [class*="w-"]') ||
      scripts.some(s => s.includes('webflow'))
    ) {
      technologies.push({
        name: 'Webflow',
        category: 'cms',
        icon: 'https://webflow.com/favicon.ico'
      });
    }

    // Magento
    if (
      (window as any).Magento ||
      scripts.some(s => s.includes('magento')) ||
      metas.some(m => m && m.includes('Magento'))
    ) {
      technologies.push({
        name: 'Magento',
        category: 'ecommerce',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/magento/magento-original.svg'
      });
    }

    // PrestaShop
    if (
      scripts.some(s => s.includes('prestashop')) ||
      document.querySelector('[class*="prestashop-"]')
    ) {
      technologies.push({
        name: 'PrestaShop',
        category: 'ecommerce',
        icon: 'https://cdn.worldvectorlogo.com/logos/prestashop.svg'
      });
    }

    // BigCommerce
    if (
      scripts.some(s => s.includes('bigcommerce'))
    ) {
      technologies.push({
        name: 'BigCommerce',
        category: 'ecommerce',
        icon: 'https://cdn.worldvectorlogo.com/logos/bigcommerce.svg'
      });
    }

    // OpenCart
    if (
      scripts.some(s => s.includes('opencart'))
    ) {
      technologies.push({
        name: 'OpenCart',
        category: 'ecommerce',
        icon: 'https://cdn.worldvectorlogo.com/logos/opencart.svg'
      });
    }

    // Salesforce Commerce Cloud
    if (
      scripts.some(s => s.includes('demandware') || s.includes('commercecloud'))
    ) {
      technologies.push({
        name: 'Salesforce Commerce Cloud',
        category: 'ecommerce',
        icon: 'https://www.salesforce.com/favicon.ico'
      });
    }

    // Sitecore
    if (
      scripts.some(s => s.includes('sitecore'))
    ) {
      technologies.push({
        name: 'Sitecore',
        category: 'cms',
        icon: 'https://www.sitecore.com/favicon.ico'
      });
    }

    // Adobe Experience Manager
    if (
      scripts.some(s => s.includes('aem') || s.includes('adobe-experience-manager'))
    ) {
      technologies.push({
        name: 'Adobe Experience Manager',
        category: 'cms',
        icon: 'https://www.adobe.com/favicon.ico'
      });
    }
  } catch (e) {
    // Ignore errors in CMS detection
  }

  // ==========================================
  // Payment Systems
  // ==========================================
  try {
    // Stripe
    if (
      (window as any).Stripe ||
      scripts.some(s => s.includes('js.stripe.com'))
    ) {
      technologies.push({
        name: 'Stripe',
        category: 'payment',
        icon: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg'
      });
    }

    // PayPal
    if (
      (window as any).paypal ||
      scripts.some(s => s.includes('paypal.com'))
    ) {
      technologies.push({
        name: 'PayPal',
        category: 'payment',
        icon: 'https://cdn.worldvectorlogo.com/logos/paypal-2.svg'
      });
    }

    // Square
    if (
      scripts.some(s => s.includes('squareup.com'))
    ) {
      technologies.push({
        name: 'Square',
        category: 'payment',
        icon: 'https://cdn.worldvectorlogo.com/logos/square-2.svg'
      });
    }

    // Braintree
    if (
      scripts.some(s => s.includes('braintree'))
    ) {
      technologies.push({
        name: 'Braintree',
        category: 'payment',
        icon: 'https://cdn.worldvectorlogo.com/logos/braintree.svg'
      });
    }

    // Adyen
    if (
      scripts.some(s => s.includes('adyen'))
    ) {
      technologies.push({
        name: 'Adyen',
        category: 'payment',
        icon: 'https://www.adyen.com/favicon.ico'
      });
    }

    // Klarna
    if (
      scripts.some(s => s.includes('klarna'))
    ) {
      technologies.push({
        name: 'Klarna',
        category: 'payment',
        icon: 'https://www.klarna.com/favicon.ico'
      });
    }

    // Affirm
    if (
      scripts.some(s => s.includes('affirm'))
    ) {
      technologies.push({
        name: 'Affirm',
        category: 'payment',
        icon: 'https://www.affirm.com/favicon.ico'
      });
    }

    // Afterpay / Clearpay
    if (
      scripts.some(s => s.includes('afterpay') || s.includes('clearpay'))
    ) {
      technologies.push({
        name: 'Afterpay / Clearpay',
        category: 'payment',
        icon: 'https://www.afterpay.com/favicon.ico'
      });
    }

    // Sezzle
    if (
      scripts.some(s => s.includes('sezzle'))
    ) {
      technologies.push({
        name: 'Sezzle',
        category: 'payment',
        icon: 'https://www.sezzle.com/favicon.ico'
      });
    }

    // Amazon Pay
    if (
      scripts.some(s => s.includes('amazon-pay') || s.includes('amazonpay'))
    ) {
      technologies.push({
        name: 'Amazon Pay',
        category: 'payment',
        icon: 'https://pay.amazon.com/favicon.ico'
      });
    }

    // Google Pay
    if (
      scripts.some(s => s.includes('google-pay') || s.includes('googlepay'))
    ) {
      technologies.push({
        name: 'Google Pay',
        category: 'payment',
        icon: 'https://pay.google.com/about/static/images/favicon.ico'
      });
    }

    // Apple Pay
    if (
      scripts.some(s => s.includes('apple-pay') || s.includes('applepay'))
    ) {
      technologies.push({
        name: 'Apple Pay',
        category: 'payment',
        icon: 'https://www.apple.com/favicon.ico'
      });
    }
  } catch (e) {
    // Ignore errors in payment detection
  }

  // ==========================================
  // Security and Infrastructure
  // ==========================================
  try {
    // Cloudflare
    if (
      scripts.some(s => s.includes('cloudflare')) ||
      document.querySelector('script[src*="cloudflare"]') ||
      headers.includes('cf-ray')
    ) {
      technologies.push({
        name: 'Cloudflare',
        category: 'cdn',
        icon: 'https://cdn.worldvectorlogo.com/logos/cloudflare.svg'
      });
    }

    // reCAPTCHA
    if (
      document.querySelector('.g-recaptcha, .grecaptcha-badge') ||
      scripts.some(s => s.includes('recaptcha'))
    ) {
      technologies.push({
        name: 'reCAPTCHA',
        category: 'security',
        icon: 'https://www.gstatic.com/recaptcha/api2/logo_48.png'
      });
    }

    // hCaptcha
    if (
      document.querySelector('.h-captcha') ||
      scripts.some(s => s.includes('hcaptcha'))
    ) {
      technologies.push({
        name: 'hCaptcha',
        category: 'security',
        icon: 'https://www.hcaptcha.com/favicon.ico'
      });
    }

    // Netlify
    if (
      scripts.some(s => s.includes('netlify')) ||
      document.querySelector('[data-netlify]') ||
      headers.includes('x-nf-request-id')
    ) {
      technologies.push({
        name: 'Netlify',
        category: 'hosting',
        icon: 'https://cdn.worldvectorlogo.com/logos/netlify.svg'
      });
    }

    // Vercel
    if (
      scripts.some(s => s.includes('vercel')) ||
      document.querySelector('meta[name="vercel"]') ||
      headers.includes('x-vercel')
    ) {
      technologies.push({
        name: 'Vercel',
        category: 'hosting',
        icon: 'https://cdn.worldvectorlogo.com/logos/vercel.svg'
      });
    }

    // AWS
    if (
      scripts.some(s => s.includes('amazonaws.com'))
    ) {
      technologies.push({
        name: 'AWS',
        category: 'hosting',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg'
      });
    }

    // Firebase
    if (
      scripts.some(s => s.includes('firebase')) ||
      (window as any).firebase
    ) {
      technologies.push({
        name: 'Firebase',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg'
      });
    }

    // Heroku
    if (
      scripts.some(s => s.includes('heroku')) ||
      headers.includes('via: 1.1 vegur')
    ) {
      technologies.push({
        name: 'Heroku',
        category: 'hosting',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg'
      });
    }

    // DigitalOcean
    if (
      scripts.some(s => s.includes('digitalocean'))
    ) {
      technologies.push({
        name: 'DigitalOcean',
        category: 'hosting',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg'
      });
    }

    // Fastly
    if (
      headers.includes('x-fastly')
    ) {
      technologies.push({
        name: 'Fastly',
        category: 'cdn',
        icon: 'https://www.fastly.com/favicon.ico'
      });
    }

    // Akamai
    if (
      headers.includes('x-akamai')
    ) {
      technologies.push({
        name: 'Akamai',
        category: 'cdn',
        icon: 'https://www.akamai.com/favicon.ico'
      });
    }

    // Sentry
    if (
      (window as any).Sentry ||
      scripts.some(s => s.includes('sentry.io') || s.includes('sentry-cdn'))
    ) {
      technologies.push({
        name: 'Sentry',
        category: 'security',
        icon: 'https://sentry.io/favicon.ico'
      });
    }

    // Bugsnag
    if (
      (window as any).Bugsnag ||
      scripts.some(s => s.includes('bugsnag'))
    ) {
      technologies.push({
        name: 'Bugsnag',
        category: 'security',
        icon: 'https://www.bugsnag.com/favicon.ico'
      });
    }

    // Rollbar
    if (
      (window as any).Rollbar ||
      scripts.some(s => s.includes('rollbar'))
    ) {
      technologies.push({
        name: 'Rollbar',
        category: 'security',
        icon: 'https://rollbar.com/favicon.ico'
      });
    }

    // New Relic
    if (
      (window as any).newrelic ||
      scripts.some(s => s.includes('newrelic'))
    ) {
      technologies.push({
        name: 'New Relic',
        category: 'security',
        icon: 'https://newrelic.com/favicon.ico'
      });
    }

    // Datadog
    if (
      (window as any).DD_RUM ||
      scripts.some(s => s.includes('datadog'))
    ) {
      technologies.push({
        name: 'Datadog',
        category: 'security',
        icon: 'https://www.datadoghq.com/favicon.ico'
      });
    }

    // Auth0
    if (
      scripts.some(s => s.includes('auth0'))
    ) {
      technologies.push({
        name: 'Auth0',
        category: 'security',
        icon: 'https://cdn.auth0.com/website/new-homepage/dark-favicon.png'
      });
    }

    // Okta
    if (
      scripts.some(s => s.includes('okta'))
    ) {
      technologies.push({
        name: 'Okta',
        category: 'security',
        icon: 'https://www.okta.com/favicon.ico'
      });
    }

    // Cloudinary
    if (
      scripts.some(s => s.includes('cloudinary')) ||
      document.querySelector('img[src*="cloudinary"]')
    ) {
      technologies.push({
        name: 'Cloudinary',
        category: 'cdn',
        icon: 'https://cloudinary.com/favicon.ico'
      });
    }

    // Imgix
    if (
      document.querySelector('img[src*="imgix"]')
    ) {
      technologies.push({
        name: 'Imgix',
        category: 'cdn',
        icon: 'https://www.imgix.com/favicon.ico'
      });
    }
  } catch (e) {
    // Ignore errors in security detection
  }

  // ==========================================
  // UI and Design Elements
  // ==========================================
  try {
    // Font Awesome
    if (
      document.querySelector('.fa, .fas, .far, .fab, .fa-') ||
      links.some(l => l.includes('font-awesome'))
    ) {
      technologies.push({
        name: 'Font Awesome',
        category: 'ui-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fontawesome/fontawesome-original.svg'
      });
    }

    // Google Fonts
    if (
      links.some(l => l.includes('fonts.googleapis.com'))
    ) {
      technologies.push({
        name: 'Google Fonts',
        category: 'font',
        icon: 'https://www.gstatic.com/images/icons/material/apps/fonts/1x/catalog/v5/favicon.svg'
      });
    }

    // Adobe Fonts (Typekit)
    if (
      scripts.some(s => s.includes('typekit') || s.includes('adobe-fonts'))
    ) {
      technologies.push({
        name: 'Adobe Fonts',
        category: 'font',
        icon: 'https://www.adobe.com/favicon.ico'
      });
    }

    // Google Maps
    if (
      (window as any).google && (window as any).google.maps ||
      scripts.some(s => s.includes('maps.googleapis.com'))
    ) {
      technologies.push({
        name: 'Google Maps',
        category: 'map',
        icon: 'https://cdn.worldvectorlogo.com/logos/google-maps-2020-icon.svg'
      });
    }

    // Mapbox
    if (
      scripts.some(s => s.includes('mapbox')) ||
      document.querySelector('.mapboxgl-map')
    ) {
      technologies.push({
        name: 'Mapbox',
        category: 'map',
        icon: 'https://cdn.worldvectorlogo.com/logos/mapbox-1.svg'
      });
    }

    // Leaflet
    if (
      (window as any).L && (window as any).L.map ||
      document.querySelector('.leaflet-container') ||
      scripts.some(s => s.includes('leaflet'))
    ) {
      technologies.push({
        name: 'Leaflet',
        category: 'map',
        icon: 'https://leafletjs.com/favicon.ico'
      });
    }

    // OpenStreetMap
    if (
      scripts.some(s => s.includes('openstreetmap'))
    ) {
      technologies.push({
        name: 'OpenStreetMap',
        category: 'map',
        icon: 'https://www.openstreetmap.org/favicon.ico'
      });
    }

    // HERE Maps
    if (
      scripts.some(s => s.includes('here.com'))
    ) {
      technologies.push({
        name: 'HERE Maps',
        category: 'map',
        icon: 'https://www.here.com/favicon.ico'
      });
    }

    // Algolia
    if (
      (window as any).algoliasearch ||
      scripts.some(s => s.includes('algolia'))
    ) {
      technologies.push({
        name: 'Algolia',
        category: 'search',
        icon: 'https://www.algolia.com/favicon.ico'
      });
    }

    // Elasticsearch
    if (
      scripts.some(s => s.includes('elastic') || s.includes('elasticsearch'))
    ) {
      technologies.push({
        name: 'Elasticsearch',
        category: 'search',
        icon: 'https://www.elastic.co/favicon.ico'
      });
    }

    // Swiper
    if (
      (window as any).Swiper ||
      document.querySelector('.swiper-container, .swiper-wrapper') ||
      scripts.some(s => s.includes('swiper'))
    ) {
      technologies.push({
        name: 'Swiper',
        category: 'ui-framework',
        icon: 'https://swiperjs.com/images/favicon.png'
      });
    }

    // Slick Carousel
    if (
      document.querySelector('.slick-slider') ||
      scripts.some(s => s.includes('slick-carousel') || s.includes('slick.min.js'))
    ) {
      technologies.push({
        name: 'Slick Carousel',
        category: 'ui-framework',
        icon: 'https://kenwheeler.github.io/slick/favicon.ico'
      });
    }

    // Owl Carousel
    if (
      document.querySelector('.owl-carousel') ||
      scripts.some(s => s.includes('owl.carousel'))
    ) {
      technologies.push({
        name: 'Owl Carousel',
        category: 'ui-framework',
        icon: 'https://owlcarousel2.github.io/OwlCarousel2/favicon.png'
      });
    }

    // Flickity
    if (
      document.querySelector('.flickity-enabled') ||
      scripts.some(s => s.includes('flickity'))
    ) {
      technologies.push({
        name: 'Flickity',
        category: 'ui-framework',
        icon: 'https://flickity.metafizzy.co/favicon.ico'
      });
    }

    // Splide
    if (
      document.querySelector('.splide') ||
      scripts.some(s => s.includes('splide'))
    ) {
      technologies.push({
        name: 'Splide',
        category: 'ui-framework',
        icon: 'https://splidejs.com/favicon.ico'
      });
    }

    // Tiny Slider
    if (
      document.querySelector('.tns-outer') ||
      scripts.some(s => s.includes('tiny-slider'))
    ) {
      technologies.push({
        name: 'Tiny Slider',
        category: 'ui-framework',
        icon: 'https://github.com/ganlanyuan/tiny-slider/raw/master/demo/favicon.ico'
      });
    }

    // Glide.js
    if (
      document.querySelector('.glide') ||
      scripts.some(s => s.includes('glide.js') || s.includes('glidejs'))
    ) {
      technologies.push({
        name: 'Glide.js',
        category: 'ui-framework',
        icon: 'https://glidejs.com/favicon.ico'
      });
    }

    // Embla Carousel
    if (
      document.querySelector('.embla') ||
      scripts.some(s => s.includes('embla-carousel'))
    ) {
      technologies.push({
        name: 'Embla Carousel',
        category: 'ui-framework',
        icon: 'https://www.embla-carousel.com/favicon.ico'
      });
    }

    // Keen Slider
    if (
      document.querySelector('.keen-slider') ||
      scripts.some(s => s.includes('keen-slider'))
    ) {
      technologies.push({
        name: 'Keen Slider',
        category: 'ui-framework',
        icon: 'https://keen-slider.io/favicon.ico'
      });
    }
  } catch (e) {
    // Ignore errors in UI detection
  }

  // ==========================================
  // Backend Technologies
  // ==========================================
  try {
    // PHP
    if (
      document.querySelector('meta[name="generator"][content*="PHP"]') ||
      scripts.some(s => s.includes('.php'))
    ) {
      technologies.push({
        name: 'PHP',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg'
      });
    }

    // Node.js
    if (
      scripts.some(s => s.includes('node_modules')) ||
      document.querySelector('meta[name="generator"][content*="Node"]')
    ) {
      technologies.push({
        name: 'Node.js',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
      });
    }

    // Express.js
    if (
      headers.includes('x-powered-by: express') ||
      scripts.some(s => s.includes('express'))
    ) {
      technologies.push({
        name: 'Express.js',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg'
      });
    }

    // Ruby on Rails
    if (
      document.querySelector('meta[name="csrf-param"]') ||
      scripts.some(s => s.includes('rails'))
    ) {
      technologies.push({
        name: 'Ruby on Rails',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original-wordmark.svg'
      });
    }

    // Django
    if (
      document.querySelector('meta[name="generator"][content*="Django"]') ||
      scripts.some(s => s.includes('django'))
    ) {
      technologies.push({
        name: 'Django',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg'
      });
    }

    // Flask
    if (
      scripts.some(s => s.includes('flask'))
    ) {
      technologies.push({
        name: 'Flask',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg'
      });
    }

    // Laravel
    if (
      document.querySelector('meta[name="generator"][content*="Laravel"]') ||
      scripts.some(s => s.includes('laravel'))
    ) {
      technologies.push({
        name: 'Laravel',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg'
      });
    }

    // ASP.NET
    if (
      document.querySelector('meta[name="generator"][content*="ASP.NET"]') ||
      scripts.some(s => s.includes('asp.net'))
    ) {
      technologies.push({
        name: 'ASP.NET',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg'
      });
    }

    // Spring
    if (
      headers.includes('x-application-context') ||
      scripts.some(s => s.includes('spring'))
    ) {
      technologies.push({
        name: 'Spring',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg'
      });
    }

    // FastAPI
    if (
      scripts.some(s => s.includes('fastapi'))
    ) {
      technologies.push({
        name: 'FastAPI',
        category: 'backend',
        icon: 'https://fastapi.tiangolo.com/img/favicon.png'
      });
    }

    // NestJS
    if (
      scripts.some(s => s.includes('nestjs'))
    ) {
      technologies.push({
        name: 'NestJS',
        category: 'backend',
        icon: 'https://nestjs.com/favicon.ico'
      });
    }

    // Symfony
    if (
      document.querySelector('meta[name="generator"][content*="Symfony"]') ||
      scripts.some(s => s.includes('symfony'))
    ) {
      technologies.push({
        name: 'Symfony',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/symfony/symfony-original.svg'
      });
    }

    // CodeIgniter
    if (
      document.querySelector('meta[name="generator"][content*="CodeIgniter"]') ||
      scripts.some(s => s.includes('codeigniter'))
    ) {
      technologies.push({
        name: 'CodeIgniter',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/codeigniter/codeigniter-plain.svg'
      });
    }

    // CakePHP
    if (
      document.querySelector('meta[name="generator"][content*="CakePHP"]') ||
      scripts.some(s => s.includes('cakephp'))
    ) {
      technologies.push({
        name: 'CakePHP',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cakephp/cakephp-original.svg'
      });
    }
  } catch (e) {
    // Ignore errors in backend detection
  }

  // ==========================================
  // Database Technologies
  // ==========================================
  try {
    // MongoDB
    if (
      scripts.some(s => s.includes('mongodb'))
    ) {
      technologies.push({
        name: 'MongoDB',
        category: 'database',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg'
      });
    }

    // MySQL
    if (
      scripts.some(s => s.includes('mysql'))
    ) {
      technologies.push({
        name: 'MySQL',
        category: 'database',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg'
      });
    }

    // PostgreSQL
    if (
      scripts.some(s => s.includes('postgresql') || s.includes('postgres'))
    ) {
      technologies.push({
        name: 'PostgreSQL',
        category: 'database',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'
      });
    }

    // Redis
    if (
      scripts.some(s => s.includes('redis'))
    ) {
      technologies.push({
        name: 'Redis',
        category: 'database',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg'
      });
    }

    // SQLite
    if (
      scripts.some(s => s.includes('sqlite'))
    ) {
      technologies.push({
        name: 'SQLite',
        category: 'database',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg'
      });
    }

    // MariaDB
    if (
      scripts.some(s => s.includes('mariadb'))
    ) {
      technologies.push({
        name: 'MariaDB',
        category: 'database',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg'
      });
    }

    // Oracle
    if (
      scripts.some(s => s.includes('oracle'))
    ) {
      technologies.push({
        name: 'Oracle',
        category: 'database',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg'
      });
    }

    // Microsoft SQL Server
    if (
      scripts.some(s => s.includes('mssql') || s.includes('sqlserver'))
    ) {
      technologies.push({
        name: 'Microsoft SQL Server',
        category: 'database',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg'
      });
    }

    // Supabase
    if (
      scripts.some(s => s.includes('supabase'))
    ) {
      technologies.push({
        name: 'Supabase',
        category: 'database',
        icon: 'https://supabase.com/favicon.ico'
      });
    }

    // PlanetScale
    if (
      scripts.some(s => s.includes('planetscale'))
    ) {
      technologies.push({
        name: 'PlanetScale',
        category: 'database',
        icon: 'https://planetscale.com/favicon.ico'
      });
    }

    // Prisma
    if (
      scripts.some(s => s.includes('prisma'))
    ) {
      technologies.push({
        name: 'Prisma',
        category: 'database',
        icon: 'https://www.prisma.io/favicon.ico'
      });
    }

    // Sequelize
    if (
      scripts.some(s => s.includes('sequelize'))
    ) {
      technologies.push({
        name: 'Sequelize',
        category: 'database',
        icon: 'https://sequelize.org/favicon.ico'
      });
    }

    // TypeORM
    if (
      scripts.some(s => s.includes('typeorm'))
    ) {
      technologies.push({
        name: 'TypeORM',
        category: 'database',
        icon: 'https://typeorm.io/favicon.ico'
      });
    }

    // Mongoose
    if (
      scripts.some(s => s.includes('mongoose'))
    ) {
      technologies.push({
        name: 'Mongoose',
        category: 'database',
        icon: 'https://mongoosejs.com/favicon.ico'
      });
    }
  } catch (e) {
    // Ignore errors in database detection
  }

  // ==========================================
  // Accessibility Technologies
  // ==========================================
  try {
    // ARIA
    if (
      document.querySelector('[aria-label], [aria-labelledby], [aria-describedby], [role]')
    ) {
      technologies.push({
        name: 'ARIA',
        category: 'accessibility',
        icon: 'https://www.w3.org/favicon.ico'
      });
    }

    // axe
    if (
      (window as any).axe ||
      scripts.some(s => s.includes('axe-core'))
    ) {
      technologies.push({
        name: 'axe',
        category: 'accessibility',
        icon: 'https://deque.com/favicon.ico'
      });
    }

    // Pa11y
    if (
      scripts.some(s => s.includes('pa11y'))
    ) {
      technologies.push({
        name: 'Pa11y',
        category: 'accessibility',
        icon: 'https://pa11y.org/favicon.ico'
      });
    }

    // Lighthouse
    if (
      scripts.some(s => s.includes('lighthouse'))
    ) {
      technologies.push({
        name: 'Lighthouse',
        category: 'accessibility',
        icon: 'https://developers.google.com/web/tools/lighthouse/images/lighthouse-logo.svg'
      });
    }
  } catch (e) {
    // Ignore errors in accessibility detection
  }

  // ==========================================
  // Server Technologies
  // ==========================================
  try {
    // Nginx
    if (
      headers.includes('server: nginx')
    ) {
      technologies.push({
        name: 'Nginx',
        category: 'server',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg'
      });
    }

    // Apache
    if (
      headers.includes('server: apache')
    ) {
      technologies.push({
        name: 'Apache',
        category: 'server',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg'
      });
    }

    // IIS
    if (
      headers.includes('server: microsoft-iis')
    ) {
      technologies.push({
        name: 'IIS',
        category: 'server',
        icon: 'https://www.microsoft.com/favicon.ico'
      });
    }

    // Tomcat
    if (
      headers.includes('server: apache-coyote') ||
      headers.includes('server: tomcat')
    ) {
      technologies.push({
        name: 'Tomcat',
        category: 'server',
        icon: 'https://tomcat.apache.org/favicon.ico'
      });
    }

    // Caddy
    if (
      headers.includes('server: caddy')
    ) {
      technologies.push({
        name: 'Caddy',
        category: 'server',
        icon: 'https://caddyserver.com/favicon.ico'
      });
    }
  } catch (e) {
    // Ignore errors in server detection
  }

  // Check for common patterns in HTML content
  try {
    const lowerHtml = htmlContent.substring(0, 50000); // Limit to first 50K chars for performance

    // Common technology patterns with categories
    const patterns = [
      { name: "Elementor", pattern: "elementor", category: "cms" },
      { name: "Webflow", pattern: "webflow", category: "cms" },
      { name: "Intercom", pattern: "intercom", category: "marketing" },
      { name: "Zendesk", pattern: "zendesk", category: "marketing" },
      { name: "Crisp", pattern: "crisp", category: "marketing" },
      { name: "Drift", pattern: "drift", category: "marketing" },
      { name: "Tawk.to", pattern: "tawk.to", category: "marketing" },
      { name: "Sentry", pattern: "sentry", category: "security" },
      { name: "Segment", pattern: "segment", category: "analytics" },
      { name: "Algolia", pattern: "algolia", category: "search" },
      { name: "Lodash", pattern: "lodash", category: "javascript-library" },
      { name: "Moment.js", pattern: "moment.js", category: "javascript-library" },
      { name: "Axios", pattern: "axios", category: "javascript-library" },
      { name: "Redux", pattern: "redux", category: "javascript-library" },
      { name: "GraphQL", pattern: "graphql", category: "backend" },
      { name: "Apollo", pattern: "apollo", category: "javascript-library" },
      { name: "Express", pattern: "express", category: "backend" },
      { name: "Socket.io", pattern: "socket.io", category: "javascript-library" },
      { name: "D3.js", pattern: "d3.js", category: "javascript-library" },
      { name: "Three.js", pattern: "three.js", category: "javascript-library" },
      { name: "Webpack", pattern: "webpack", category: "javascript-library" },
      { name: "Babel", pattern: "babel", category: "javascript-library" },
      { name: "ESLint", pattern: "eslint", category: "javascript-library" },
      { name: "Prettier", pattern: "prettier", category: "javascript-library" },
      { name: "Jest", pattern: "jest", category: "javascript-library" },
      { name: "Mocha", pattern: "mocha", category: "javascript-library" },
      { name: "Chai", pattern: "chai", category: "javascript-library" },
      { name: "Cypress", pattern: "cypress", category: "javascript-library" },
      { name: "Puppeteer", pattern: "puppeteer", category: "javascript-library" },
      { name: "Playwright", pattern: "playwright", category: "javascript-library" },
      { name: "Storybook", pattern: "storybook", category: "ui-framework" },
      { name: "Vite", pattern: "vite", category: "javascript-library" },
      { name: "Parcel", pattern: "parcel", category: "javascript-library" },
      { name: "Rollup", pattern: "rollup", category: "javascript-library" },
      { name: "esbuild", pattern: "esbuild", category: "javascript-library" },
      { name: "Turbo", pattern: "turbo", category: "javascript-library" },
      { name: "Nx", pattern: "nx", category: "javascript-library" },
      { name: "Lerna", pattern: "lerna", category: "javascript-library" },
      { name: "pnpm", pattern: "pnpm", category: "javascript-library" },
      { name: "Yarn", pattern: "yarn", category: "javascript-library" },
      { name: "npm", pattern: "npm", category: "javascript-library" },
    ];

    for (const { name, pattern, category } of patterns) {
      if (lowerHtml.includes(pattern) || scripts.some(s => s.includes(pattern))) {
        technologies.push({
          name,
          category: category as TechnologyCategory,
          icon: `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name.toLowerCase().replace(/\./g, '')}/icon.svg`
        });
      }
    }
  } catch (e) {
    // Ignore errors in pattern detection
  }

  // Remove duplicates by name
  const uniqueTechMap = new Map<string, Technology>();
  technologies.forEach(tech => {
    uniqueTechMap.set(tech.name, tech);
  });

  const uniqueTechnologies = Array.from(uniqueTechMap.values());

  // Organize technologies by category
  const technologyCategories: TechnologyCategories = {
    'javascript-framework': [],
    'ui-framework': [],
    'javascript-library': [],
    'css-framework': [],
    'analytics': [],
    'marketing': [],
    'cms': [],
    'ecommerce': [],
    'payment': [],
    'hosting': [],
    'cdn': [],
    'search': [],
    'security': [],
    'database': [],
    'backend': [],
    'server': [],
    'font': [],
    'map': [],
    'accessibility': [],
    'other': []
  };

  uniqueTechnologies.forEach(tech => {
    if (technologyCategories[tech.category]) {
      technologyCategories[tech.category].push(tech);
    } else {
      technologyCategories['other'].push(tech);
    }
  });

  return {
    technologies: uniqueTechnologies.length ? uniqueTechnologies : [{ name: 'No common technologies detected', category: 'other' }],
    technologyCategories
  };
}