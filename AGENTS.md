# AGENTS.md — AI Agent Guide for InventoryOS

This document describes the project structure, conventions, and explicit rules that AI coding
agents (Claude, Gemini, GPT, Copilot, etc.) **must follow** when reading or modifying this
repository. Read this file in full before touching any code.

---

## 🗺️ Repository Layout

```
inventory-management-system-java-monorepo/
├── AGENTS.md                            ← YOU ARE HERE
├── README.md                            ← Human setup guide
├── docker-compose.yml                   ← Local dev stack
├── .gitignore
├── .github/
│   └── workflows/
│       ├── backend.yml                  ← Backend CI/CD (path-gated)
│       └── frontend.yml                 ← Frontend CI/CD (path-gated)
├── backend/                             ← Spring Boot 3 / Java 21
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       ├── main/java/com/inventory/
│       │   ├── InventoryApplication.java
│       │   ├── config/                  ← OpenAPI config
│       │   ├── controller/              ← REST layer
│       │   ├── service/                 ← Business logic
│       │   ├── repository/              ← JPA repositories
│       │   ├── entity/                  ← JPA entities
│       │   ├── dto/                     ← Request/Response DTOs
│       │   └── exception/               ← Exception types + GlobalExceptionHandler
│       └── main/resources/
│           ├── application.yml
│           └── db/migration/            ← Flyway SQL scripts (V<N>__description.sql)
├── frontend/                            ← React 18 + Vite 5 + TypeScript 5 + MUI 5
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── api/                         ← Axios service functions per domain
│       ├── components/                  ← Shared UI (Layout)
│       ├── pages/                       ← One file per route
│       ├── types/index.ts               ← All TypeScript interfaces
│       ├── theme.ts                     ← MUI dark theme tokens
│       ├── App.tsx                      ← Route definitions
│       └── main.tsx                     ← App bootstrap (providers)
└── k8s/
    ├── namespace.yaml
    ├── ingress.yaml
    ├── backend/deployment.yaml          ← Deployment + Service + HPA
    ├── frontend/deployment.yaml         ← Deployment + Service + HPA
    └── postgres/
        ├── deployment.yaml              ← Deployment + Service + PVC + ConfigMap
        └── secret.yaml
```

---

## ⚙️ Technology Versions (PINNED — Do Not Change)

| Runtime / Tool     | Required Version | Where enforced                                          |
|--------------------|------------------|---------------------------------------------------------|
| **Java**           | **21 (LTS)**     | `pom.xml` `<java.version>`, both Dockerfiles, all workflows |
| **Maven**          | 3.9.x            | `maven:3.9-eclipse-temurin-21-alpine` Docker image      |
| **Spring Boot**    | 3.2.x            | `pom.xml` parent                                        |
| **Node.js**        | 20 LTS           | `frontend/Dockerfile`, `frontend.yml` workflow          |
| **PostgreSQL**     | 16               | `docker-compose.yml`, `k8s/postgres/deployment.yaml`    |
| **Nginx**          | 1.25-alpine      | `frontend/Dockerfile`                                   |
| **TypeScript**     | 5.x              | `package.json` devDependencies                          |
| **React**          | 18.x             | `package.json` dependencies                             |
| **Material UI**    | 5.x              | `package.json` dependencies                             |

> **Critical:** Java MUST be version 21. Do not change to 17, 11, or any other version.
> All three enforcement points must stay in sync:
> 1. `backend/pom.xml` → `<java.version>21</java.version>`
> 2. `backend/Dockerfile` → `FROM maven:3.9-eclipse-temurin-21-alpine` and `FROM eclipse-temurin:21-jre-alpine`
> 3. `.github/workflows/backend.yml` → `java-version: '21'` (appears in two jobs)

---

## 🔧 Backend Conventions

### Package Structure
All backend code lives under `com.inventory`. Sub-packages map exactly to layer names:

```
com.inventory
├── config          ← Spring @Configuration beans (OpenAPI, etc.)
├── controller      ← @RestController, @RequestMapping("/api/...")
├── service         ← @Service, business logic, no JPA calls directly
├── repository      ← @Repository, extends JpaRepository<Entity, Long>
├── entity          ← @Entity, @Table, Lombok @Getter/@Setter/@Builder
├── dto             ← Plain data objects, request/response separated
└── exception       ← Custom exceptions + GlobalExceptionHandler
```

### Rules
1. **Never put business logic in controllers.** Controllers only validate, call a service, and return.
2. **Never put JPA queries in services.** All DB access goes through Repository interfaces.
3. **DTOs are mandatory.** Never expose JPA entities directly in API responses.
4. **All new entities** must have corresponding `RequestDto` and `ResponseDto` classes.
5. **Validation** belongs in `RequestDto` via `jakarta.validation` annotations (`@NotBlank`, `@NotNull`, `@Min`, etc.), not in the service.
6. **New exceptions** must extend `RuntimeException` and be handled in `GlobalExceptionHandler`.
7. **Database changes** must use a new Flyway migration file: `V<N>__<description>.sql`. Never alter existing migration files.
8. **All new repositories** go under `com.inventory.repository` and extend `JpaRepository`.
9. **Lombok** is available: use `@Getter`, `@Setter`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@RequiredArgsConstructor`, `@Slf4j`.
10. **Transactions**: Mark service methods `@Transactional`. Read-only operations use `@Transactional(readOnly = true)`.

### API Conventions
- Base path: `/api`
- All controllers annotated with `@CrossOrigin(origins = "*")`
- All controllers must have a `@Tag(name = ..., description = ...)` for Swagger grouping
- All endpoint methods must have `@Operation(summary = "...")`
- HTTP status codes: `200 OK`, `201 Created`, `204 No Content`, `400`, `404`, `409`

### Adding a New Entity (Step-by-Step)
```
1. Create Entity in entity/
2. Create RequestDto + ResponseDto in dto/
3. Create Repository in repository/
4. Create Service in service/ (inject repository via @RequiredArgsConstructor)
5. Create Controller in controller/
6. Write Flyway migration SQL in src/main/resources/db/migration/V<N>__....sql
7. Add a @SpringBootTest unit test
```

---

## 🎨 Frontend Conventions

### File Naming
- **Pages**: `PascalCase` ending in `Page` → `ProductsPage.tsx`
- **Components**: `PascalCase` → `Layout.tsx`, `StatCard.tsx`
- **API modules**: `camelCase` matching domain → `products.ts`, `categories.ts`
- **Types**: all in `src/types/index.ts` — no scattered per-file interfaces

### State Management
- **Server state** (API data): use `@tanstack/react-query` — `useQuery` for reads, `useMutation` for writes.
- **Local UI state**: `useState` / `useReducer` — no global state library needed.
- **Never** call `axios` / `api` directly from a page component. Always go through `src/api/*.ts`.

### Form Handling
- Use `react-hook-form` with `Controller` for all forms.
- Field-level validation rules live in the `rules` prop of `Controller`, not inside the submit handler.
- On success/error, use `notistack`'s `enqueueSnackbar` — never `alert()` or `console.log`.

### Styling
- Use the **MUI theme** in `src/theme.ts` for all color/spacing decisions.
- Never hardcode hex colors directly in components — reference theme tokens: `primary.main`, `text.secondary`, `background.paper`, etc.
- Exceptions: one-off gradient/glow effects that aren't theme-level tokens may use `rgba(...)` inline.
- All interactive cards must include hover `transform: translateY(-4px)` transition.

### Adding a New Page (Step-by-Step)
```
1. Create src/pages/MyNewPage.tsx
2. Add route in src/App.tsx inside the <Route path="/" element={<Layout />}> block
3. Add nav item in src/components/Layout.tsx navItems array
4. Create src/api/myDomain.ts with typed service functions
5. Add TypeScript interfaces to src/types/index.ts
```

### TypeScript Rules
- **Strict mode is on** (`"strict": true` in `tsconfig.json`). No `any` types.
- **No unused imports.** TypeScript errors must be zero before committing. Run: `npx tsc --noEmit`
- All API response shapes must match the corresponding backend `ResponseDto` exactly.

---

## 🐳 Docker Conventions

### Backend Dockerfile (must stay as multi-stage)
```
Stage 1 (builder): maven:3.9-eclipse-temurin-21-alpine
Stage 2 (runtime): eclipse-temurin:21-jre-alpine
```
- Non-root user: `appuser`
- `HEALTHCHECK` must target `/actuator/health`
- JVM flags required: `-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0`

### Frontend Dockerfile (must stay as multi-stage)
```
Stage 1 (builder): node:20-alpine
Stage 2 (runtime): nginx:1.25-alpine
```
- Non-root user: `nginxuser`
- `nginx.conf` must keep API proxy block (`location /api/`) pointing to `backend:8080`

### Docker Compose
- Services: `postgres`, `backend`, `frontend`
- `backend` depends on `postgres` via `service_healthy`
- `frontend` depends on `backend` via `service_healthy`
- Do not add new top-level services without also adding K8s manifests

---

## ☸️ Kubernetes Conventions

- **Namespace**: `inventory` — all resources must specify `namespace: inventory`
- **Labels**: every resource must have at minimum `app: <service-name>`
- **Security Context**: all pods must set `runAsNonRoot: true`
- **Resource limits**: every container must define `resources.requests` AND `resources.limits`
- **Probes**: all backend pods need `livenessProbe` + `readinessProbe` targeting Spring Actuator
- **Deployment strategy**: `RollingUpdate` with `maxUnavailable: 0` — never use `Recreate`
- **HPA**: all stateless services (backend, frontend) must have an HPA with CPU target ≤ 70%
- **Secrets**: sensitive values in `Secret` resources — never in `ConfigMap`

---

## 🔄 CI/CD Rules

### Path Gating
The pipelines use `paths:` filters — only changes in the relevant directory trigger that pipeline:
- `backend/**` → `backend.yml`
- `frontend/**` → `frontend.yml`
- Do not remove or widen these filters.

### GitOps
After a successful Docker push, the pipeline automatically:
1. Updates the image tag in the K8s manifest (`sha-<GIT_SHA>`)
2. Commits with message `chore(gitops): update <service> image to sha-<SHA> [skip ci]`
3. The `[skip ci]` tag **must** be kept to prevent infinite pipeline loops.

### Required GitHub Secrets
| Secret        | Usage                        |
|---------------|------------------------------|
| `SONAR_TOKEN` | SonarCloud authentication    |
| `GITHUB_TOKEN`| Auto-provided — do not add   |

---

## 🔍 How to Run Checks Locally

### Backend
```bash
cd backend

# Compile only
mvn compile -q

# Run tests
mvn test

# Full build
mvn clean package -DskipTests
```

### Frontend
```bash
cd frontend

# Install deps
npm install

# TypeScript check (must pass with 0 errors)
npx tsc --noEmit

# Build
npm run build

# Dev server (proxies /api to localhost:8080)
npm run dev
```

### Full Stack (Docker Compose)
```bash
# From repo root
docker compose up --build -d

# Tail logs
docker compose logs -f backend

# Stop
docker compose down
```

---

## 🚫 What Agents Must NOT Do

1. ❌ Change Java version from 21 in any file.
2. ❌ Expose JPA entities in API responses — use DTOs.
3. ❌ Add business logic to controllers.
4. ❌ Hardcode database credentials anywhere except `k8s/postgres/secret.yaml` (placeholder values only).
5. ❌ Remove Flyway — do not switch to `ddl-auto: create` or `ddl-auto: update` for production config.
6. ❌ Commit secrets, `.env` files, or credentials to the repository.
7. ❌ Use `any` type in TypeScript.
8. ❌ Call API endpoints directly from components — always use the `src/api/` layer.
9. ❌ Remove the `[skip ci]` suffix from GitOps commits.
10. ❌ Run containers as root in production (Kubernetes) environments.
11. ❌ Modify existing Flyway migration files — always create a new `V<N+1>__....sql`.
12. ❌ Remove resource `requests`/`limits` from any K8s container spec.

---

## ✅ What Agents Should Always Do

1. ✅ Verify `npx tsc --noEmit` returns exit code 0 after frontend changes.
2. ✅ Add Swagger `@Operation` annotation to every new controller method.
3. ✅ Add `@Transactional` to every new service method (readOnly where appropriate).
4. ✅ Create a new Flyway migration for every schema change.
5. ✅ Add all new TypeScript interfaces to `src/types/index.ts`.
6. ✅ Use `enqueueSnackbar` from `notistack` for user-facing feedback.
7. ✅ Invalidate relevant React Query caches after mutations.
8. ✅ Keep K8s manifests and docker-compose in sync when adding/removing services.
9. ✅ Use `@RequiredArgsConstructor` with `final` fields for dependency injection (avoid `@Autowired`).
10. ✅ Follow the naming convention: entity → repository → service → controller.
