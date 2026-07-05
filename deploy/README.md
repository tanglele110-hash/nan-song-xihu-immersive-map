# Deployment Templates

This folder contains deployment templates for the Desktop Web MVP.

## Docker Compose

```powershell
docker compose up --build
```

Open:

```text
http://127.0.0.1:8080/
http://127.0.0.1:8080/app/index.html
http://127.0.0.1:8080/app/index.html?api=1
http://127.0.0.1:8080/api/v1/ready
```

## Services

- `api`: Node.js Fastify API from `deploy/docker/api.Dockerfile`
- `web`: Nginx static frontend and reverse proxy from `deploy/docker/web.Dockerfile`

## Reverse Proxy

`deploy/nginx/westlake.conf` serves static frontend files and proxies:

- `/api/*` to `api:4174`
- `/content-assets/*` to `api:4174`

The current recommended production shape is same-origin reverse proxy. Cross-origin deployment should add an explicit CORS policy first.

## Windows Build Note

On Windows, Docker Desktop may fail when the project path contains non-ASCII characters and Compose delegates the build to Buildx/Bake. The observed error is similar to:

```text
header key "x-docker-expose-session-sharedkey" contains value with non-printable ASCII characters
```

Use the classic builder for this local verification path:

```powershell
$env:DOCKER_BUILDKIT = "0"
$env:COMPOSE_DOCKER_CLI_BUILD = "0"
docker compose up --build -d
```

If the Docker CLI reports that `docker-credential-desktop` cannot be found, make sure Docker Desktop is running and that `C:\Program Files\Docker\Docker\resources\bin` is available on `PATH` for the current shell.

## E2E Against A Deployed URL

The default E2E command still starts the local API and Vite test server:

```powershell
npm run test:e2e
```

The managed local web server defaults to port `5478`. If that port is unavailable, set `E2E_WEB_PORT` before running the command.

To test an already deployed same-origin environment, set `E2E_BASE_URL`. The value should be the site root, and may include a subpath such as a GitHub Pages repository path.

Docker Compose example:

```powershell
$env:E2E_BASE_URL = "http://127.0.0.1:8080"
$env:E2E_API_BRIDGE = "required"
npm run test:e2e
```

Static-only host example:

```powershell
$env:E2E_BASE_URL = "https://owner.github.io/repository/"
$env:E2E_API_BRIDGE = "optional"
npm run test:e2e
```

Vercel static production example:

```powershell
$env:E2E_BASE_URL = "https://nan-song-xihu-immersive-map.vercel.app/"
$env:E2E_API_BRIDGE = "optional"
npm run test:e2e
```

`E2E_API_BRIDGE=required` verifies that `/app/index.html?api=1` is hydrated by the API. `optional` accepts either API hydration or the static fallback, which is useful for Vercel/GitHub Pages previews that only publish the static MVP.
