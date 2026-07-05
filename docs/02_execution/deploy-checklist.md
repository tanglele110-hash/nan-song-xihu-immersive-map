# 部署清单

更新时间：2026-07-05

## 当前结论

项目已具备本地、内网演示、静态前端部署、前端 + API 同源部署的基础条件。CI、Docker 和 Nginx 反向代理模板已经补齐；Vercel 静态生产预览已跑通，当前生产地址为 `https://nan-song-xihu-immersive-map.vercel.app/`。正式公网长期发布前仍建议继续评估国内访问速度、缓存策略和长卷瓦片化。

## 部署形态

### 1. 纯静态前端

适用场景：作品展示、内部预览、无需实时 API 的页面验收。

构建：

```powershell
npm run validate:content
npm run test
npm run build
```

部署目录：

```text
apps/web/dist/
```

入口：

```text
/
/app/index.html
```

说明：

- `/` 会通过根 `index.html` 跳转到 `/app/index.html`。
- 页面默认使用 `app/content-data.js`，不依赖 API。
- 当前 `app/assets` 包含原始发布素材和 WebP 展示派生图；浏览器展示优先加载 `app/assets/optimized/**/*.webp`，原始 PNG/JPG 与 ZIP 下载包仍保留。
- Vercel 静态部署已验证；`?api=1` 在无同源 API 时会走静态 fallback。

### 2. 前端 + API 同源部署

适用场景：验证前后端联动、未来接入动态内容、统一域名部署。

构建：

```powershell
npm run validate:content
npm run test
npm run build
npm run test:e2e
```

前端静态目录：

```text
apps/web/dist/
```

API 启动：

```powershell
npm run start:api
```

API 生产入口：

```text
apps/api/dist/apps/api/src/server.js
```

推荐路由：

```text
/app/*                  -> apps/web/dist/app/*
/assets/*               -> apps/web/dist/assets/*
/api/*                  -> API 127.0.0.1:4174
/content-assets/*       -> API 127.0.0.1:4174
/                       -> apps/web/dist/index.html
```

前端联动入口：

```text
/app/index.html?api=1
```

## API 环境变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `HOST` | `127.0.0.1` | API 监听地址 |
| `PORT` | `4174` | API 监听端口 |
| `LOG_LEVEL` | `info` | Fastify 日志等级 |
| `CONTENT_CACHE_TTL_MS` | `1000` | 内容 JSON 内存缓存时间，设为 `0` 可关闭 |
| `CONTENT_ROOT` | 自动查找 | 内容根目录；打包部署时建议显式指向项目根或内容挂载目录 |

## 健康检查

```text
GET /api/v1/health
GET /api/v1/ready
```

`ready` 会读取并校验内容文件数量，适合作为部署就绪检查。

## 发布前质量闸门

必须通过：

```powershell
npm run validate:content
npm run test
npm run build
npm run test:e2e
```

人工验收：

- 打开 `/app/index.html`，确认静态默认入口视觉和交互不变。
- 打开 `/app/index.html?api=1`，确认 API 联动入口可用。
- 打开 `/api/v1/ready`，确认 `ok: true`。
- 检查根路径 `/` 是否跳转到 `/app/index.html`。

## CI/CD

当前已有 GitHub Actions 工作流：

```text
.github/workflows/ci.yml
```

CI 会执行：

```powershell
npm ci
npx playwright install --with-deps chromium
npm run validate:content
npm run assets:report
npm run test
npm run build
npm run test:e2e
```

本地 Playwright 默认使用 Chrome channel；CI 环境会自动改用 Playwright Chromium，避免 CI 机器没有安装 Chrome 时失败。

## Docker / Nginx

模板文件：

```text
deploy/docker/api.Dockerfile
deploy/docker/web.Dockerfile
deploy/nginx/westlake.conf
docker-compose.yml
.dockerignore
```

本地容器演示：

```powershell
docker compose up --build
```

打开：

```text
http://127.0.0.1:8080/
http://127.0.0.1:8080/app/index.html
http://127.0.0.1:8080/app/index.html?api=1
http://127.0.0.1:8080/api/v1/ready
```

Nginx 路由：

```text
/app/*                  -> static web
/assets/*               -> static web
/api/*                  -> api:4174
/content-assets/*       -> api:4174
/                       -> static root index.html
```

## 素材优化

当前已有报告和瓦片规划脚本：

```powershell
npm run assets:report
npm run assets:report:write
npm run assets:optimize:display
npm run assets:tiles:plan
```

`assets:optimize:display` 会生成 `app/assets/optimized/**/*.webp` 展示副本。2026-07-05 已生成 51 张 WebP 展示派生图，展示输入约 170.61 MiB，输出约 26.46 MiB，浏览器展示侧预计减少约 144.16 MiB 下载量。

可选生成 WebP 瓦片：

```powershell
npm run assets:tiles:plan -- --write
```

默认输出目录：

```text
data/processed/tiles/scroll/
```

该目录默认不进入 Git。当前脚本只生成瓦片资源，不会自动改动 `app/index.html`、`app/styles.css` 或 `app/main.js` 的呈现逻辑。

## 暂未完成的生产项

- GitHub 集成到 Vercel 的静态生产部署已跑通；当前未配置自定义域名。
- 跨域部署未启用 CORS；当前推荐同源反向代理。
- 素材展示层已切换到 WebP 派生图；页面尚未切换到长卷瓦片渲染。
- 真实问湖提交、数据库、审核后台仍不属于当前 MVP。
