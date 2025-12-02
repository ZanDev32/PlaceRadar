# PlaceRadar

PlaceRadar is a hyper-specific workspace discovery platform for students and remote workers in Sleman, Yogyakarta. It highlights practical amenities such as Wi-Fi stability, outlet availability, and ambient noise so users can quickly choose the best “third place” for focus work.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Development Workflow](#development-workflow)
- [Seeding Sample Data](#seeding-sample-data)
- [Key Application Modules](#key-application-modules)
- [Monitoring & Networking](#monitoring--networking)
- [License](#license)

## Architecture Overview
The MVP runs as six Docker services defined in [docker-compose.yml](docker-compose.yml): React frontend, Node/Express API, MongoDB, Nginx reverse proxy, Nagios monitoring, and optional Dnsmasq/Ngrok utilities. Requests flow `Browser → Nginx → Node API → MongoDB`, while Nagios probes HTTP, MongoDB, and Node liveness from a dedicated container.

## Tech Stack
- **Frontend:** React + Vite ([`frontend/package.json`](frontend/package.json))
- **Backend:** Node.js + Express + Mongoose ([`backend/package.json`](backend/package.json))
- **Database:** MongoDB
- **Reverse Proxy:** Nginx ([`infrastructure/nginx/nginx.conf`](infrastructure/nginx/nginx.conf))
- **Monitoring:** Nagios ([`infrastructure/nagios/nagios.cfg`](infrastructure/nagios/nagios.cfg))
- **Local DNS & Tunnel (optional):** Dnsmasq, Ngrok

## Project Structure
```
placeradar/
├─ backend/          # REST API + MongoDB models
├─ frontend/         # React SPA built with Vite
├─ infrastructure/   # Nginx, Nagios, Dnsmasq, Ngrok configs
├─ scripts/seed/     # Seed data for MongoDB
├─ docker-compose.yml
└─ .env / .env.example
```

## Prerequisites
- Docker Desktop ≥ 24
- Docker Compose v2
- Node.js 18+ (only needed for local non-Docker runs)

## Getting Started
1. **Clone & enter repository**
   ```sh
   git clone https://github.com/ZanDev32/PlaceRadar.git
   cd PlaceRadar
   ```
2. **Copy env template**
   ```sh
   cp .env.example .env
   ```
3. **Launch full stack**
   ```sh
   docker compose up --build
   ```
4. **Access services**
   - Frontend: http://localhost:3000
   - API: http://localhost:5000/api/locations
   - Nginx gateway: http://localhost:80
   - Nagios UI: http://localhost:8080

## Environment Configuration
Edit [.env](.env) to override defaults consumed by [`backend/src/config/env.ts`](backend/src/config/env.ts) and the React app (values prefixed with `REACT_APP_`). When running via Compose, the backend uses `MONGO_URI=mongodb://mongo:27017/placeradar` from [docker-compose.yml](docker-compose.yml).

## Development Workflow
### Frontend
```sh
cd frontend
npm install
npm run dev
```
Vite serves on port 3000 with aliases defined in [`frontend/vite.config.ts`](frontend/vite.config.ts).

### Backend
```sh
cd backend
npm install
npm run dev
```
The API boots from [`backend/src/server.ts`](backend/src/server.ts) and exposes REST endpoints under `/api/locations`.

## Seeding Sample Data
Use the JSON fixtures in [scripts/seed/locations.json](scripts/seed/locations.json) to pre-populate MongoDB. After MongoDB is running:
```sh
mongoimport --uri "mongodb://localhost:27017/placeradar" \
  --collection locations \
  --file scripts/seed/locations.json --jsonArray
```

## Key Application Modules
- **Domain model:** [`Location`](backend/src/models/Location.ts) defines amenity fields such as Wi-Fi speed and outlet counts.
- **Business logic:** [`locations.service.ts`](backend/src/services/locations.service.ts) implements CRUD helpers (`getAllLocations`, `createLocation`, etc.).
- **Controller layer:** [`LocationsController`](backend/src/controllers/locations.controller.ts) handles HTTP responses and error codes.
- **Routing:** [`locations.routes.ts`](backend/src/routes/locations.routes.ts) maps REST endpoints to controller actions.
- **React context & hooks:** [`LocationContext`](frontend/src/context/LocationContext.tsx) and [`useApi`](frontend/src/hooks/useApi.ts) coordinate client-side data fetching.
- **UI pages:** [`Home`](frontend/src/pages/Home.tsx) lists cards, while [`LocationDetail`](frontend/src/pages/LocationDetail.tsx) renders per-location metadata.

## Monitoring & Networking
- **Nagios:** Monitors HTTP, Node, and Mongo via commands defined in [`infrastructure/nagios/nagios.cfg`](infrastructure/nagios/nagios.cfg). Access through `http://localhost:8080/monitor`.
- **Dnsmasq:** Resolves `placeradar.dev` to localhost when running the development DNS container. Configuration lives in [`infrastructure/dnsmasq/dnsmasq.conf`](infrastructure/dnsmasq/dnsmasq.conf).
- **Ngrok:** Publish the local Nginx endpoint externally using [`infrastructure/ngrok/ngrok.yml`](infrastructure/ngrok/ngrok.yml) (replace the auth token).

## License
This project is released under the MIT License. See [LICENSE](LICENSE) for details.