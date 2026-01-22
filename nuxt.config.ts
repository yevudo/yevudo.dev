// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    databaseApiPort: process.env.DATABASE_API_PORT,
    databaseApiHost: process.env.DATABASE_API_HOST,
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Yevhen Udovychenko - Full-Stack Developer',
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#ffffff' },
        {
          name: 'google-site-verification',
          content: '6QaVq9IDp2VnENvIapJ0ao11fvqLaW78wRjgTv5x3dE',
        },
      ],
    },
  },

  modules: [
    '@nuxtjs/i18n',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@pinia/nuxt',
  ],

  colorMode: {
    preference: 'light',
  },

  css: ['~/assets/css/main.css'],

  i18n: {
    baseUrl: 'https://yevudo.dev',
    defaultLocale: 'uk',
    strategy: 'prefix',
    locales: [
      {
        code: 'uk',
        name: 'Українська',
        language: 'uk-UA',
        dir: 'ltr',
        file: 'uk.json',
      },
      {
        code: 'en',
        name: 'English',
        language: 'en-US',
        dir: 'ltr',
        file: 'en.json',
      },
    ],
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/uk', '/en', '/'],
      failOnError: false,
    },
  },
  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
  },
});