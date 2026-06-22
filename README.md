# InventoryOS - Warehouse Inventory Management Platform

[![Backend CI/CD](https://github.com/YOUR_GITHUB_USERNAME/inventory-management-system-java-monorepo/actions/workflows/backend.yml/badge.svg)](https://github.com/YOUR_GITHUB_USERNAME/inventory-management-system-java-monorepo/actions/workflows/backend.yml)
[![Frontend CI/CD](https://github.com/YOUR_GITHUB_USERNAME/inventory-management-system-java-monorepo/actions/workflows/frontend.yml/badge.svg)](https://github.com/YOUR_GITHUB_USERNAME/inventory-management-system-java-monorepo/actions/workflows/frontend.yml)

A **production-ready**, full-stack **Inventory Management System** built with a Monorepo architecture. Designed for warehouse operations with modern SaaS-style UI and enterprise-grade infrastructure.

---

## 📐 Architecture

```
inventory-platform/
├── frontend/                    # React + Vite + TypeScript + Material UI
│   ├── src/
│   │   ├── api/                 # Axios API service layer
│   │   ├── components/          # Shared UI components (Layout)
│   │   ├── pages/               # Dashboard, Products, Transactions, Categories
│   │   ├── types/               # TypeScript interfaces
│   │   ├── theme.ts             # MUI dark theme
│   │   └── main.tsx             # App entry point
│   ├── Dockerfile               # Node build → Nginx runtime
│   └── nginx.conf               # SPA routing + API proxy
│
├── backend/                     # Spring Boot 3 + Java 21
│   └── src/main/java/com/inventory/
│       ├── controller/          # REST controllers (Category, Product, Transaction, Dashboard)
│       ├── service/             # Business logic layer
│       ├── repository/          # JPA repositories
│       ├── entity/              # JPA entities
│       ├── dto/                 # Request/Response DTOs
│       ├── exception/           # Global error handling
│       └── config/              # OpenAPI/Swagger config
│   ├── Dockerfile               # Maven build → JRE runtime
│   └── pom.xml
│
├── k8s/                         # Kubernetes manifests
│   ├── namespace.yaml
│   ├── ingress.yaml
│   ├── backend/                 # Deployment, Service, HPA
│   ├── frontend/                # Deployment, Service, HPA
│   └── postgres/                # Deployment, Service, PVC, Secret
│
├── .github/workflows/
│   ├── backend.yml              # Backend CI/CD pipeline
│   └── frontend.yml             # Frontend CI/CD pipeline
│
└── docker-compose.yml           # Local development stack
```

---

## 🚀 Quick Start (Docker Compose)

### Prerequisites
- Docker & Docker Compose v2+

### 1. Clone & Start

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/inventory-management-system-java-monorepo.git
cd inventory-management-system-java-monorepo

docker compose up --build -d
```

### 2. Wait for services to be healthy (~2 minutes for backend)

```bash
docker compose ps
docker compose logs -f backend
```

### 3. Access the application

| Service     | URL                                        |
|-------------|--------------------------------------------|
| Frontend    | http://localhost:3000                      |
| Backend API | http://localhost:8080/api                  |
| Swagger UI  | http://localhost:8080/swagger-ui.html      |
| Prometheus  | http://localhost:8080/actuator/prometheus  |
| Health      | http://localhost:8080/actuator/health      |

---

## 🛠️ Local Development

### Backend (Spring Boot)

```bash
# Start only PostgreSQL
docker compose up postgres -d

# Run backend locally
cd backend
mvn spring-boot:run
```

### Frontend (Vite)

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
# API proxied to http://localhost:8080
```

---

## 📦 API Reference

### Products
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | /api/products         | List all products   |
| GET    | /api/products/{id}    | Get product by ID   |
| POST   | /api/products         | Create product      |
| PUT    | /api/products/{id}    | Update product      |
| DELETE | /api/products/{id}    | Delete product      |

### Categories
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | /api/categories       | List all categories  |
| POST   | /api/categories       | Create category      |

### Transactions
| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| GET    | /api/transactions     | List transactions (paged) |
| POST   | /api/transactions     | Record new transaction    |

### Dashboard
| Method | Endpoint        | Description          |
|--------|-----------------|----------------------|
| GET    | /api/dashboard  | Get dashboard metrics |

**Full Swagger docs:** http://localhost:8080/swagger-ui.html

---

## ☸️ Kubernetes Deployment

### Prerequisites
- kubectl configured for your cluster
- Kubernetes 1.25+
- NGINX Ingress Controller
- cert-manager (for TLS)

### 1. Update Secrets (⚠️ IMPORTANT)

```bash
# Edit with your actual passwords
vim k8s/postgres/secret.yaml
```

### 2. Update image names

Replace `YOUR_GITHUB_USERNAME` in:
- `k8s/backend/deployment.yaml`
- `k8s/frontend/deployment.yaml`

### 3. Apply manifests

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# PostgreSQL
kubectl apply -f k8s/postgres/

# Backend
kubectl apply -f k8s/backend/

# Frontend
kubectl apply -f k8s/frontend/

# Ingress
kubectl apply -f k8s/ingress.yaml
```

### 4. Verify deployment

```bash
kubectl get all -n inventory
kubectl get ingress -n inventory
kubectl logs -n inventory deployment/backend
```

---

## 🔄 CI/CD Pipelines

### Path-based triggering
The pipelines use `paths` filtering to only run when relevant files change:
- `backend/**` → triggers `backend.yml`
- `frontend/**` → triggers `frontend.yml`

### Pipeline Stages (each service)

```
Push to main
    │
    ├── 1. Build & Test (Maven / npm)
    ├── 2. SonarCloud Scan
    ├── 3. Docker Build & Push (GHCR)
    ├── 4. Trivy Security Scan
    └── 5. GitOps: Update K8s manifest with SHA tag → commit back
```

### Required GitHub Secrets

| Secret         | Description                            |
|----------------|----------------------------------------|
| `SONAR_TOKEN`  | SonarCloud authentication token        |
| `GITHUB_TOKEN` | Auto-provided by GitHub Actions        |

---

## 📊 Observability

- **Prometheus metrics:** `/actuator/prometheus`
- **Health endpoint:** `/actuator/health`
- **Liveness probe:** `/actuator/health/liveness`
- **Readiness probe:** `/actuator/health/readiness`
- Pods are annotated with `prometheus.io/scrape: "true"` for auto-discovery

---

## 🔐 Security Features

| Feature                  | Implementation                              |
|--------------------------|---------------------------------------------|
| Non-root containers      | UID 1000 (backend), UID 101 (nginx frontend) |
| Read-only root filesystem| Backend container                           |
| Resource limits          | All K8s deployments                         |
| Secret management        | Kubernetes Secrets                          |
| Image vulnerability scan | Trivy (CRITICAL+HIGH, with SARIF upload)    |
| Security headers         | Nginx (X-Frame-Options, CSP, etc.)          |
| Input validation         | Spring Boot @Valid + Bean Validation        |

---

## 🗄️ Database Schema

```sql
categories
├── id (BIGSERIAL PK)
├── name (VARCHAR 100, UNIQUE)
└── description (VARCHAR 500)

products
├── id (BIGSERIAL PK)
├── sku (VARCHAR 50, UNIQUE)
├── name (VARCHAR 200)
├── quantity (INTEGER)
├── minimum_stock (INTEGER)
├── price (NUMERIC 12,2)
└── category_id (FK → categories.id)

inventory_transactions
├── id (BIGSERIAL PK)
├── product_id (FK → products.id)
├── transaction_type (IN | OUT | ADJUSTMENT)
├── quantity (INTEGER)
├── notes (VARCHAR 500)
└── created_at (TIMESTAMP)
```

---

## 🌱 Seed Data

The application automatically seeds on first startup via Flyway migration (`V1__init_schema.sql`):

- **5 Categories:** Electronics, Office Supplies, Hardware Tools, Safety Equipment, Packaging Materials
- **20 Products** with realistic SKUs, prices, and stock levels (some intentionally low for demo)
- **15 Transactions** spanning the past 30 days

---

## 🏗️ Tech Stack

| Layer       | Technology                                  |
|-------------|---------------------------------------------|
| Frontend    | React 18, Vite 5, TypeScript 5, Material UI 5 |
| State Mgmt  | TanStack Query (React Query) v5             |
| Forms       | React Hook Form v7                          |
| Backend     | Spring Boot 3.2, Java 21                    |
| ORM         | Spring Data JPA, Hibernate 6                |
| Database    | PostgreSQL 16                               |
| Migrations  | Flyway                                      |
| API Docs    | SpringDoc OpenAPI 3 (Swagger UI)            |
| Metrics     | Micrometer + Prometheus                     |
| Container   | Docker, Docker Compose, Nginx               |
| Orchestration | Kubernetes, HPA, Ingress                 |
| CI/CD       | GitHub Actions                              |
| Security    | Trivy, SonarCloud                           |

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.
