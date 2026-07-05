# 西湖繁胜全景图

一句话定位：围绕“西湖繁胜全景图”的长期资料整理、研究、执行与导出项目。

## 目录结构

- `AGENTS.md`：项目级 AI 协作规则、当前状态和边界条件。
- `PRD.md`：目标、范围、用户、成功指标和非目标。
- `TDD.md`：数据结构、工作流、自动化与质量闸门。
- `docs/`：稳定结论、报告、阶段文档和归档。
- `app/`：当前前端 demo 的唯一视觉与交互来源，版式、样式、hash 路由和交互以此为准。
- `apps/web/`：工程化 Web 承载壳，使用 Vite 原样服务 `app/index.html`、`app/styles.css`、`app/main.js`，并代理后端 API。
- `apps/api/`：只读内容 API，Fastify + TypeScript。
- `packages/schemas/`：前后端与内容校验共享的 Zod 数据契约。
- `content/`：结构化内容 JSON 与 Web 素材清单。
- `data/`：原始数据、清洗数据和稳定工作簿。
- `exports/`：PDF、图片等导出物。
- `tools/`：脚本、自动化工具和辅助程序。
- `tests/e2e/`：桌面 MVP 主路径 Playwright 测试。

## 工程化 MVP 运行

当前主体验入口仍然是已确认的 `app/` demo；`apps/web/` 只负责工程化承载、构建和 API 代理，不重写前端视觉与交互。本地开发需要 Node.js `20.19+` 或 `22.12+`。

```powershell
npm install
npm run dev:api
npm run dev:web
```

打开：`http://127.0.0.1:5173/app/index.html`

常用质量检查：

```powershell
npm run validate:content
npm run test
npm run build
npm run test:e2e
```

Playwright E2E 当前使用本机 Chrome channel，覆盖 `1440x900` 与 `1024x768` 两个桌面视口。

部署相关产物：

- 前端静态产物：`apps/web/dist/`，根 `index.html` 会跳转到 `/app/index.html`。
- API 生产入口：先运行 `npm run build`，再运行 `npm run start:api`，实际入口为 `apps/api/dist/apps/api/src/server.js`。
- 部署清单：`docs/02_execution/deploy-checklist.md`。
- CI：`.github/workflows/ci.yml`。
- Docker / Nginx：`docker-compose.yml`、`deploy/docker/`、`deploy/nginx/westlake.conf`。

素材优化辅助：

```powershell
npm run assets:report
npm run assets:report:write
npm run assets:tiles:plan
```

`assets:tiles:plan` 默认只输出规划；需要安装 `ffmpeg` 并显式追加 `-- --write` 才会生成 WebP 瓦片到 `data/processed/tiles/scroll/`。

后端联动模式默认关闭，页面优先使用 `app/content-data.js`，保证已确认 demo 不受 API 启停影响。需要验证前后端联动时，先启动 API 和 Web，再打开：

```text
http://127.0.0.1:5173/app/index.html?api=1
```

`?api=1` 会通过 Vite 代理读取 `GET /api/v1/app-content`；如 API 部署在其他域名，可追加 `apiBase`：

```text
http://127.0.0.1:5173/app/index.html?api=1&apiBase=http://127.0.0.1:4174
```

## 原型基准说明

- `app/` 不是参考图，也不是待替换的 legacy 页面；它就是当前 MVP 前端体验基准。
- `app/content-data.js` 是由 `content/` 结构化数据生成的 legacy 运行时数据桥，当前先承接游湖横卷分段；不要手写业务修改，先改 `content/` 后运行校验。
- `app/app-api.js` 是可选 API 桥；默认不请求后端，只有 `?api=1`、`apiBase` 或显式设置 `window.WEST_LAKE_API_BASE` 时才用 API 数据覆盖静态桥。
- `app/assets/` 是当前前端发布素材镜像，用于让开发服和生产构建摆脱对 `data/raw/`、`exports/` 的直接运行时依赖；原始资料仍保留在各自目录，不在这里编辑源文件。
- 后续工程化不得把 `app/` 的版式、样式、交互改写成“相似版本”。需要补后端、内容校验、构建、测试和部署能力时，应围绕原 demo 接入。
- `apps/web/` 作为 Vite 壳服务原 demo，并通过 `/api`、`/content-assets` 代理到 `apps/api`。如需未来迁移框架，必须先单独确认并做逐屏像素级验收。

## 维护规则

- 根目录只保留入口文件和一级目录，不堆散文件。
- 原始采集数据放入 `data/raw/`，默认不提交 Git。
- 清洗后的中间数据放入 `data/processed/`，默认不提交 Git。
- PDF 放入 `exports/pdf/`，图片放入 `exports/images/`，默认不提交 Git。
- 稳定结论优先写入 Markdown 源文档，再按需导出。

## MVP 素材入口

- `data/raw/西湖北岸/`：西湖繁胜全景图长卷的“西湖北岸”部分画卷，作为最小 MVP 的原始素材包。
