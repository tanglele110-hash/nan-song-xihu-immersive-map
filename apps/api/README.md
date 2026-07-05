# @westlake/api

Fastify read-only content API for the Desktop Web MVP.

## Runtime

```powershell
npm run dev:api

npm run build
npm run start:api
```

Environment variables:

| Name | Default | Description |
| --- | --- | --- |
| `HOST` | `127.0.0.1` | Listen host |
| `PORT` | `4174` | Listen port |
| `LOG_LEVEL` | `info` | Fastify logger level |
| `CONTENT_CACHE_TTL_MS` | `1000` | In-memory content JSON cache TTL; set `0` to disable |
| `CONTENT_ROOT` | auto-detected | Project/content root; set this when running the API from a packaged directory |

## Key Endpoints

- `GET /api/v1/health`
- `GET /api/v1/ready`
- `GET /api/v1/app-content`
- `GET /api/v1/site`
- `GET /api/v1/assets/manifest`
- `GET /api/v1/map-points`
- `GET /api/v1/scroll/segments`
- `GET /api/v1/scroll/nodes`
- `GET /api/v1/cold-knowledge/sections`
- `GET /api/v1/notes`
- `GET /api/v1/inquiries`
- `GET /content-assets/:assetId`

`POST /api/v1/inquiries` intentionally returns `501` during the MVP.
