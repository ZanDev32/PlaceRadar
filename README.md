# PlaceRadar

PlaceRadar is a hyper-specific workspace discovery platform for students and remote workers in Sleman, Yogyakarta. It highlights practical amenities such as Wi-Fi stability, outlet availability, and ambient noise so users can quickly choose the best "third place" for focus work.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Accessing the Application](#accessing-the-application)
- [Environment Configuration](#environment-configuration)
- [Development Workflow](#development-workflow)
- [Seeding Sample Data](#seeding-sample-data)
- [Key Application Modules](#key-application-modules)
- [Infrastructure Services](#infrastructure-services)
- [TLS Certificate Setup](#tls-certificate-setup)
- [License](#license)

## Architecture Overview
The application runs as six Docker services defined in [`docker-compose.yml`](docker-compose.yml):

![Architecture](frontend/src/public/architecture.png)

| Service | Container | Description |
|---------|-----------|-------------|
| Frontend | ReactJS | React 19 + Vite SPA |
| Backend | ExpressJS | Node.js REST API |
| Database | PostgreSQL | Relational database |
| Reverse Proxy | nginx | TLS termination & routing |
| Monitoring | NagiOS | Service health checks |
| DNS | CoreDNS | Local domain resolution |

## Tech Stack
- **Frontend:** React 19 + Vite 7 ([`frontend/package.json`](frontend/package.json))
- **Backend:** Node.js + Express 5 + Sequelize ([`backend/package.json`](backend/package.json))
- **Database:** PostgreSQL (latest)
- **Reverse Proxy:** Nginx with TLS ([`infrastructure/nginx/nginx.conf`](infrastructure/nginx/nginx.conf))
- **DNS Server:** CoreDNS ([`infrastructure/coredns/Corefile`](infrastructure/coredns/Corefile))
- **Monitoring:** Nagios ([`infrastructure/nagios/placeradar.cfg`](infrastructure/nagios/placeradar.cfg))
- **Tunnel (optional):** Ngrok

## Project Structure
```
PlaceRadar/
├── backend/                 # Express.js REST API
│   ├── src/
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   ├── config/          # Database & environment config
│   │   └── middleware/      # Error handling
│   └── Dockerfile
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Route pages
│   │   └── styles/          # Global CSS
│   └── Dockerfile
├── infrastructure/
│   ├── nginx/               # Reverse proxy config + TLS certs
│   ├── coredns/             # DNS server config
│   ├── nagios/              # Monitoring config
│   └── ngrok/               # Tunnel config (optional)
├── scripts/seed/            # Sample data
├── docker-compose.yml
└── .env.example
```

## Prerequisites
- Docker Desktop ≥ 24
- Docker Compose v2
- Node.js 18+ (only for local development without Docker)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZanDev32/PlaceRadar.git
   cd PlaceRadar
   ```

2. **Copy environment template**
   ```bash
   cp .env.example .env
   ```

3. **Launch the full stack**
   ```bash
   docker compose up -d --build
   ```

4. **Verify all containers are running**
   ```bash
   docker ps
   ```

## Accessing the Application

The application uses `placeradar.lvh.me` as the development domain. This is a "magic" domain that automatically resolves to `127.0.0.1` on any OS without configuration.

| Service | URL | Notes |
|---------|-----|-------|
| **Frontend (HTTPS)** | https://placeradar.lvh.me | Accept self-signed cert warning |
| **Frontend (HTTP)** | http://placeradar.lvh.me | Redirects to HTTPS |
| **API** | https://placeradar.lvh.me/api/locations | REST endpoints |
| **Nagios** | http://localhost:8080 | Monitoring dashboard |

### Alternative Access Methods
- **localhost:** https://localhost (same self-signed cert)
- **Custom domain:** Configure your OS DNS to use `127.0.0.1` to resolve `placeradar.lvh.me` via CoreDNS

## Environment Configuration

Edit [`.env`](.env) to configure the application. Key variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgres://postgres:postgres@postgres:5432/placeradar` | PostgreSQL connection string |
| `NGROK_AUTH_TOKEN` | - | Ngrok authentication (optional) |

The backend reads configuration from [`backend/src/config/env.js`](backend/src/config/env.js).

## Development Workflow

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev      # Development server with HMR
npm run build    # Production build
npm run serve    # Preview production build
```

### Backend (Express.js)
```bash
cd backend
npm install
npm run dev      # Development with nodemon
npm start        # Production mode
npm test         # Run Jest tests
```

### Full Stack (Docker)
```bash
docker compose up -d --build    # Build and start all services
docker compose logs -f          # Follow logs
docker compose down             # Stop all services
docker compose down -v          # Stop and remove volumes
docker compose up -d --scale nagios=0 --scale ngrok=0 # Build and start all services except NagiOS and Ngrok
```

## Seeding Sample Data

Pre-populate PostgreSQL with sample locations. You can create a seed script or use a database tool to import `scripts/seed/locations.json`.

## Key Application Modules

### Backend
| Module | Path | Description |
|--------|------|-------------|
| Location Model | [`backend/src/models/Location.js`](backend/src/models/Location.js) | Sequelize model for workspace locations |
| Location Service | [`backend/src/services/locations.service.js`](backend/src/services/locations.service.js) | CRUD business logic |
| Location Controller | [`backend/src/controllers/locations.controller.js`](backend/src/controllers/locations.controller.js) | HTTP request handlers |
| Routes | [`backend/src/routes/locations.routes.js`](backend/src/routes/locations.routes.js) | API endpoint definitions |

### Frontend
| Module | Path | Description |
|--------|------|-------------|
| Location Context | [`frontend/src/context/LocationContext.jsx`](frontend/src/context/LocationContext.jsx) | Global state management |
| useApi Hook | [`frontend/src/hooks/useApi.js`](frontend/src/hooks/useApi.js) | API data fetching |
| Home Page | [`frontend/src/pages/Home.jsx`](frontend/src/pages/Home.jsx) | Location listing |

## Infrastructure Services

### Nginx (Reverse Proxy)
- Terminates TLS on port 443
- Serves React static files from `/`
- Proxies `/api` requests to the Express backend
- Redirects HTTP → HTTPS

### CoreDNS
Resolves local development domains. Configuration: [`infrastructure/coredns/Corefile`](infrastructure/coredns/Corefile)

```
placeradar.lvh.me     → 127.0.0.1
api.placeradar.lvh.me → 127.0.0.1
```

To use CoreDNS, set your OS DNS server to `127.0.0.1`.

### Nagios
Monitors service health. Access at http://localhost:8080

### Ngrok (Optional)
Expose local development externally. Uncomment the ngrok service in `docker-compose.yml` and set `NGROK_AUTH_TOKEN` in `.env`.

## TLS Certificate Setup

The project includes a self-signed certificate for HTTPS development. Browsers will show a warning which you can bypass.

**To regenerate the certificate:**
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout infrastructure/nginx/certs/placeradar.lvh.me.key \
  -out infrastructure/nginx/certs/placeradar.lvh.me.crt \
  -subj "/CN=placeradar.lvh.me" \
  -addext "subjectAltName=DNS:placeradar.lvh.me,DNS:localhost"
```

**To trust the certificate (optional):**
- **Firefox:** `about:preferences#privacy` → View Certificates → Authorities → Import
- **Chrome/System:** Add to OS trust store
- **Alternative:** Use [mkcert](https://github.com/FiloSottile/mkcert) for locally-trusted certificates

## License
© 2025 PlaceRadar. All rights reserved.