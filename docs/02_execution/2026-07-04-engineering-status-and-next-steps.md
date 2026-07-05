# 工程化状态与后续执行清单

更新时间：2026-07-04

## 0. 当前结论

本项目当前状态不是“成熟生产级工程化项目”，而是“已具备工程化骨架、质量闸门和后端雏形的桌面 Web MVP 工程”。

最重要的执行约束：

- `app/index.html`、`app/styles.css`、`app/main.js` 是当前已确认 demo，也是 MVP 前端体验的唯一基准。
- 后续工程化必须保证最终网页呈现与 demo 一致，不允许默认用 React 或其他框架重写一个“相似版本”。
- `apps/web` 的当前职责是 Vite 承载壳、构建入口和 API 代理，不是重新实现前端体验。
- 移动端不纳入当前 MVP 验收。
- 原始数据、截图、导出 PDF、临时文件未经确认不提交 Git。

## 1. 已经做到位的内容

### 1.1 工程骨架

- 已建立 npm workspace monorepo：
  - `apps/web`
  - `apps/api`
  - `packages/schemas`
- 根目录已具备：
  - `package.json`
  - `package-lock.json`
  - `tsconfig.base.json`
  - `playwright.config.ts`
  - `.gitignore`
- 根目录脚本已覆盖：
  - `npm run dev:web`
  - `npm run dev:api`
  - `npm run validate:content`
  - `npm run test`
  - `npm run build`
  - `npm run test:e2e`

### 1.2 前端 demo 保真承载

- `app/` 已保留为前端体验基准：
  - `app/index.html`
  - `app/styles.css`
  - `app/main.js`
- `apps/web/vite.config.ts` 已改为以项目根目录为 Vite root，直接服务 `/app/index.html`。
- `apps/web/package.json` 的 dev 命令已锁定：
  - `vite --config vite.config.ts --host 127.0.0.1 --port 5173 --strictPort`
- 根目录 `index.html` 会跳转到 `/app/index.html`。
- 构建阶段已复制原 demo 脚本到：
  - `apps/web/dist/app/main.js`
- 已验证 `http://127.0.0.1:5173/app/index.html` 加载的是原 demo：
  - 有 `.landing-entry`
  - 有 `./styles.css`
  - 有 `./main.js`
  - 没有 React `#root`

### 1.3 后端 API

- `apps/api` 已建立 Fastify 服务。
- 已有只读内容接口：
  - `GET /api/v1/health`
  - `GET /api/v1/site`
  - `GET /api/v1/assets/manifest`
  - `GET /api/v1/map-points`
  - `GET /api/v1/scroll/segments`
  - `GET /api/v1/scroll/nodes`
  - `GET /api/v1/cold-knowledge/sections`
  - `GET /api/v1/notes`
  - `GET /content-assets/:assetId`
- `POST /api/v1/inquiries` 已按 MVP 边界返回 501：
  - `INQUIRY_SUBMISSION_NOT_ENABLED`
- `contentRepository` 已做路径限制，避免素材路径逃逸 workspace root。

### 1.4 数据契约和内容层

- `packages/schemas` 已有 Zod schemas：
  - API envelope
  - assets
  - site
  - map
  - scroll
  - notes
  - inquiry / cold knowledge
- `content/` 已有结构化数据：
  - `site.json`
  - `assets-manifest.json`
  - `map-points.json`
  - `scroll-segments.json`
  - `scroll-nodes.json`
  - `notes.json`
  - `cold-knowledge.json`
  - `inquiries.json`
- `tools/validate-content.ts` 已校验：
  - JSON schema
  - id 唯一性
  - asset 文件存在性
  - map point 目标存在性
  - scroll node 与 segment 关联
  - cold knowledge 卡片与下载包资源关联

### 1.5 自动化和质量闸门

- 已有 API 测试：
  - `apps/api/src/server.test.ts`
- 已有 schema 测试：
  - `packages/schemas/src/schema.test.ts`
- 已有桌面 E2E：
  - `tests/e2e/desktop-mvp.spec.ts`
- E2E 覆盖原 demo 主路径：
  - Landing 四入口
  - 入画地图
  - 巨石山下大石佛热区
  - 游湖目标节点
  - 节点弹层
  - 问湖图册
  - 冷知识预览轮播
- `tools/run-e2e.ts` 已解决 Windows 下 Playwright webServer 进程回收不稳定问题。
- 最近一次已通过：
  - `npm run validate:content`
  - `npm run test`
  - `npm run build`
  - `npm run test:e2e`

### 1.6 文档同步

- `README.md` 已说明 `app/` 是当前前端体验基准。
- `PRD.md` 已补充工程化口径修正。
- `TDD.md` 已改为 Vite 工程壳承载原 demo 的技术路线。
- `design.md` 已补充“不是贴合，是直接使用原型”的保真优先级。

## 2. 还没做到位的内容

### 2.1 前端运行时工程化不足

- `app/main.js` 仍是大体量单文件，包含：
  - hash 路由
  - 状态管理
  - 交互逻辑
  - 节点数据
  - 冷知识数据
  - DOM 渲染
- 当前 demo 运行时尚未真正从 API 读取内容。
- `content/*.json` 与 `app/main.js` 内嵌数据仍存在重复和潜在漂移。
- 仍需要在不改变视觉和交互的前提下，逐步把数据源切到 API / JSON。

### 2.2 React port 残留

- `apps/web/src/**` 里仍保留早先 React port 代码。
- 当前它不再是 MVP 前端来源，但仍占用目录和依赖。
- 需要后续决策：
  - 删除 React port 残留；
  - 或移动到 archive；
  - 或保留为未来迁移实验，但必须明确不参与当前 MVP build/runtime。

### 2.3 素材工程化不足

- 目前仍有较多原始或设计素材直接散布在：
  - `design/`
  - `data/raw/`
  - `exports/`
  - 根目录图片
- Web 发布级素材与原始素材尚未完全分层。
- 尚未建立自动化素材生成流程：
  - 压缩
  - 尺寸检测
  - WebP / AVIF
  - 缩略图
  - 长卷瓦片或多分辨率
- `content/assets-manifest.json` 已有雏形，但还不是完整发布资产管线。

### 2.4 生产部署不足

- 尚无 `.env.example`。
- 尚无生产部署配置：
  - 静态站点部署
  - API 部署
  - 反向代理
  - 缓存策略
- 尚无 CI/CD：
  - GitHub Actions / 其他 CI
  - 自动执行 validate / test / build / e2e
- 尚无 release checklist。

### 2.5 后端仍是 MVP 只读雏形

- API 目前仅服务本地内容读取。
- 还没有：
  - 查询参数
  - 版本化内容发布流程
  - 内容缓存策略
  - 错误 requestId 生成
  - 结构化日志策略
  - health/readiness 区分
- `POST /api/v1/inquiries` 仍是后置能力。

### 2.6 内容治理不足

- 节点正式史料来源还未完全补齐。
- `notes` 还不是完整可读的史料详情系统。
- `卷中微识` 已接入 4 张正式知识卡片，原占位卡片已删除。
- 社区共研数据结构有雏形，但尚未进入真实流程。
- 需要明确：
  - 事实 / 推测 / 创作性解读分层
  - 来源字段规范
  - 待考证内容展示规则

### 2.7 Git 和交付边界未完成

- 当前工作区大量文件仍处于未跟踪状态。
- 还没有确认提交范围。
- 根据项目规则，以下内容未经确认不能提交：
  - 原始数据
  - 截图
  - 导出 PDF
  - 临时文件
  - 外部资料
- 需要先做提交范围审计，再分批 commit。

## 3. 后续继续完善清单

### P0：先稳住当前工程

- [ ] 重新运行并记录当前质量闸门结果：
  - `npm run validate:content`
  - `npm run test`
  - `npm run build`
  - `npm run test:e2e`
- [ ] 建立 `docs/02_execution/` 下的每日执行记录。
- [ ] 清点 `git status --short`，按“代码 / 文档 / 内容 / 原始素材 / 导出物”分类。
- [ ] 明确第一批可提交范围。
- [ ] 不提交 `data/raw/`、`exports/`、截图和临时文件，除非用户明确确认。
- [ ] 删除或归档 Playwright / 构建产生的临时目录，确保 `.gitignore` 生效。

### P1：前端 demo 数据外置但保持视觉一致

- [ ] 给 `app/main.js` 做数据边界梳理，不先重构视觉。
- [ ] 标出仍内嵌在 `app/main.js` 的数据：
  - map points
  - scroll segments
  - scroll nodes
  - node cards
  - notes
  - cold knowledge sections
- [ ] 逐步让 `app/main.js` 从静态 JSON 或 `/api/v1/*` 读取数据。
- [ ] 每迁出一类数据后跑 E2E，确认页面与 demo 视觉和交互一致。
- [ ] 建立一条“demo 保真回归测试”：
  - 页面入口数量
  - hash 路由
  - 关键热区
  - 节点弹层
  - 问湖预览
- [ ] 严禁在本阶段重写布局、样式、题签坐标或交互手感。

### P2：清理 React port 残留

- [ ] 审计 `apps/web/src/**` 是否仍被 build/test 引用。
- [ ] 如果不参与当前 MVP：
  - 删除；
  - 或移动到本地内部归档区；
  - 或在 README 中标注为历史实验，不作为当前运行入口。
- [ ] 移除不再需要的 React 依赖：
  - `react`
  - `react-dom`
  - `@vitejs/plugin-react`
  - testing-library 相关依赖
- [ ] 删除或调整无效 React tests。
- [ ] 确认 `npm run test`、`npm run build` 仍通过。

### P3：素材发布管线

- [ ] 盘点当前素材目录：
  - `design/`
  - `data/raw/`
  - `data/processed/`
  - `exports/`
  - 根目录图片
- [ ] 制定 Web 发布素材目录，例如：
  - `public/assets/`
  - 或 `app/assets/`
- [ ] 建立素材 manifest 字段规范：
  - id
  - src
  - width
  - height
  - kind
  - publishStatus
  - source
  - license/status
- [ ] 增加素材检查脚本：
  - 文件存在
  - 体积阈值
  - 尺寸
  - 格式
  - 是否误用原始大图
- [ ] 为长卷制定瓦片或多分辨率方案。

### P4：后端成熟化

- [ ] 补 `.env.example`。
- [ ] 增加 API requestId 生成。
- [ ] 增加统一 error handler。
- [ ] 区分 `health` 与 `readiness`。
- [ ] 增加内容读取缓存。
- [ ] 增加 API 文档：
  - `docs/api/`
  - 或 OpenAPI spec
- [ ] 为未来 `inquiries` 提交能力写清楚：
  - 是否真实提交
  - 是否需要数据库
  - 审核流程
  - 隐私和版权规则

### P5：CI/CD 和部署

- [ ] 增加 GitHub Actions 或等价 CI：
  - install
  - validate content
  - unit tests
  - build
  - e2e
- [ ] 增加 production preview 命令。
- [ ] 明确部署目标：
  - 纯静态
  - Node API
  - 静态 + serverless API
  - 展陈本地包
- [ ] 写部署文档：
  - `docs/02_execution/deploy-checklist.md`
- [ ] 写 release checklist：
  - 版本号
  - 质量闸门
  - 手动验收
  - 回滚方式

### P6：内容和史料治理

- [ ] 补齐 15 个节点来源字段。
- [ ] 将节点卡片内容分层：
  - 节点简介
  - 南宋建制
  - 今日坐标
  - 史迹价值
  - 来源
  - 证据状态
- [x] 补 `卷中微识` 首批 4 张正式卡片。
- [ ] 扩展 `notes` 为可读、可检索、可关联的史料条目。
- [ ] 明确待考证内容展示样式。

## 4. 推荐下一步执行顺序

1. 先做提交范围审计，确认哪些工程文件可以进入 Git。
2. 清理 React port 残留，避免后续再次误打开旧 React 页面。
3. 保持 `app/` 视觉不动，开始把 `app/main.js` 中的数据逐类外置。
4. 每迁出一类数据，就跑 E2E 和人工打开页面确认保真。
5. 建立素材发布目录和 manifest 规则。
6. 增加 CI，让工程化质量闸门自动跑。
7. 再进入部署和后端提交能力设计。

## 5. 新窗口接续提示词

可以在新窗口直接贴这段：

```text
项目路径：F:\codex\04西湖繁胜全景图。
请先阅读 AGENTS.md、README.md、PRD.md、TDD.md、design.md，以及 docs/02_execution/2026-07-04-engineering-status-and-next-steps.md。
当前红线：app/index.html、app/styles.css、app/main.js 是已确认 demo 和 MVP 前端体验唯一基准，后续工程化必须保证最终网页呈现与 demo 一致，不能用 React 或其他框架重写相似版本。
请继续补齐工程化，优先顺序：
1. 审计 git status 和提交范围；
2. 清理或归档 apps/web/src 的 React port 残留；
3. 在不改变 demo 视觉和交互的前提下，把 app/main.js 的内嵌数据逐类切到 content/API；
4. 补素材发布管线；
5. 补 CI/CD 与部署文档。
每一步都要跑 npm run validate:content、npm run test、npm run build、npm run test:e2e，并明确说明是否仍与 demo 一致。
```
