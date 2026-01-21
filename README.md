# yevudo.dev

Personal portfolio website, built with Nuxt 4 and internationalization support (Ukrainian and English languages).

## 🚀 Technologies

- **Framework:** [Nuxt 4](https://nuxt.com/)
- **UI:** [@nuxt/ui](https://ui.nuxt.com/) + Tailwind CSS
- **Languages:** Vue 3, TypeScript
- **Internationalization:** @nuxtjs/i18n
- **Process Manager:** PM2
- **Containerization:** Docker + Docker Compose

## ✨ Features

- 🌐 Multi-language support (Ukrainian/English)
- 🎨 Modern UI with @nuxt/ui
- 🖼️ Image optimization (@nuxt/image)
- 🔤 Automatic font optimization (@nuxt/fonts)
- 📱 Responsive design
- 🔒 Secure HTTP headers
- 🚀 SSR with prerendering
- 📊 Integration with external database API
- 🐳 Docker-ready with healthcheck

## 📋 Requirements

- Node.js >= 22.19.0
- npm or pnpm
- Docker (optional)

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/yevudo.dev.git
cd yevudo.dev

# Install dependencies
npm install
```

## 🔧 Configuration

Create a `.env` file in the project root:

```env
DATABASE_API_HOST=localhost
DATABASE_API_PORT=8080
```

## 💻 Development

```bash
# Start dev server at http://localhost:3000
npm run dev

# TypeScript check
npm run check:ts

# ESLint check
npm run check:eslint

# Prettier check
npm run check:prettier
```

## 🏗️ Build

```bash
# Build for production (with all checks)
npm run build

# Start production server with PM2
npm start

# Stop PM2
npm stop
```

## 🐳 Docker

### Run with Docker Compose

```bash
# Build and start container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The application will be available at `http://localhost:9011`

### Build Docker Image

```bash
docker build -t yevudo-app .
```

## 📁 Project Structure

```
yevudo.dev/
├── app/
│   ├── components/       # Vue components
│   │   ├── app-header.vue
│   │   ├── app-footer.vue
│   │   ├── card-profile.vue
│   │   └── ...
│   ├── pages/           # Application pages
│   │   └── index.vue
│   ├── assets/          # Static assets
│   │   └── css/
│   ├── utils/           # Utilities
│   └── app.config.ts    # App configuration
├── server/
│   └── api/             # API endpoints
│       ├── profile.ts
│       ├── employments-records.ts
│       ├── educations-records.ts
│       └── pet-projects.ts
├── shared/
│   ├── types/           # TypeScript types
│   └── enums/           # Enums
├── i18n/
│   └── locales/         # Translation files
│       ├── en.json
│       └── uk.json
├── public/              # Public files
├── Dockerfile
├── docker-compose.yml
├── ecosystem.config.cjs # PM2 configuration
└── nuxt.config.ts       # Nuxt configuration
```

## 🌍 Routing

The site supports the following routes:

- `/uk` - Ukrainian version
- `/en` - English version
- `/` - Redirects to `/uk` (default)

## 🔌 API Endpoints

All endpoints support the `locale` query parameter (uk/en):

- `GET /api/profile` - Get profile information
- `GET /api/employments-records` - Employment history
- `GET /api/educations-records` - Education records
- `GET /api/pet-projects` - Personal projects

## 🔒 Security

The project is configured with secure HTTP headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production with checks |
| `npm start` | Start with PM2 |
| `npm stop` | Stop PM2 |
| `npm run check:ts` | TypeScript check |
| `npm run check:eslint` | ESLint check |
| `npm run check:prettier` | Code formatting check |

## 🏥 Health Check

The Docker container includes a health check that verifies application availability every 30 seconds:

```bash
wget --no-verbose --tries=1 --spider http://localhost:3000/
```

## 👤 Author

**Yevhen Udovychenko**

- Website: [yevudo.dev](https://yevudo.dev)
- GitHub: [@yevudo](https://github.com/yevudo)

## 📄 License

MIT
