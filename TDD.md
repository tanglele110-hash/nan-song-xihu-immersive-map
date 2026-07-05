# TDD：西湖繁胜全景图沉浸式交互网站

## 0. 文档信息

- 文档版本：v1.1 Desktop Web MVP Engineering Wrapper
- 更新时间：2026-07-04
- 需求依据：`PRD.md` v0.10 Desktop Web MVP Scope
- MVP 范围：前置 Landing Page + `入画`、`游湖`、`拾遗`、`问湖` 四个一级版块
- MVP 设备范围：桌面 Web 端；移动端响应式与触控体验后置
- 实现原则：原 demo 原样承载、后端与内容契约工程化、素材可替换、史料可追溯、动效可降级

## 1. 技术目标

1. 当前先实现一条已验证的核心路径：Landing Page → `入画` 分卷热区 → `游湖` 的西湖北岸三段横卷 → 15 个节点题签与节点信息卡片 → `拾遗` 参考图页 → `问湖` 冷知识图册墙。
2. 当前工程化 MVP 以 `app/index.html`、`app/styles.css`、`app/main.js` 为前端唯一体验基准；后端、内容契约、校验、构建和测试围绕该 demo 补齐，不重写视觉和交互。
3. 长卷浏览采用虚拟横向位置和视觉位移实现，不依赖浏览器原生横向滚动条作为主体验。
4. 动效默认克制：支持 `prefers-reduced-motion`、静态降级。声景入口已从当前初稿移除，后续恢复需另行确认。
5. 原始素材、导出物和临时文件默认不提交 Git；生产 Web 素材必须由处理流程生成。

## 2. 推荐实现形态

`app/` 是当前 MVP 前端源码基准，文件位于：

| 文件 | 作用 |
| --- | --- |
| `app/index.html` | 页面结构、五个 view、统一抬头、节点弹层容器 |
| `app/styles.css` | 纸墨视觉、Landing/入画/游湖/卡片/拾遗/问湖样式 |
| `app/main.js` | hash 路由、热区、横卷交互、节点卡片、示例数据 |

当前页面应通过 Vite 工程壳原样服务 `app/index.html`，也可以直接用浏览器打开作为同一份体验。工程化 MVP 形态为：

- 前端承载：`apps/web` 使用 Vite 服务原始 `app/` demo，不重新实现 DOM、样式、版式或交互。
- 后端框架：Fastify + TypeScript，只提供 MVP 只读内容 API，不启用账号、数据库写入或真实社区提交。
- 共享数据契约：Zod schemas，前端、后端、内容校验共用一套字段定义。
- 内容层：`JSON + Markdown`，JSON 管结构化字段，Markdown 管长文本和史料说明。
- 素材层：`content/assets-manifest.json` 记录 Web 可用素材路径、尺寸、来源和发布状态。
- 测试层：Vitest 覆盖 schemas/API/content 校验；Playwright 覆盖原 demo 的桌面 MVP 主路径。
- 运行基线：Node.js `20.19+` 或 `22.12+`，与 Vite v8 基线保持一致。
- 动画层：优先 CSS transform、opacity、clip-path、mask、requestAnimationFrame；复杂滚动/视差动效可在确认参考实现后再引入动画库。
- 音频层：P0 不启用；如后续恢复，先更新 PRD/TDD/DESIGN。

本文中的 `app/` 是当前前端体验入口；`apps/web/` 是服务该入口的 Vite 工程壳；`apps/api/` 是本地只读内容 API。任何未来框架迁移都不得默认改变 `app/` 的样式、版式和交互。

本地运行：

```powershell
npm install
npm run dev:api
npm run dev:web
```

打开：`http://127.0.0.1:5173/app/index.html`

质量检查：

```powershell
npm run validate:content
npm run test
npm run build
npm run test:e2e
```

## 2.0 2026-07-04 工程化架构锁定

架构结论：

| 层级 | 决策 | MVP 说明 |
| --- | --- | --- |
| 前端 | `app/` 原 demo + `apps/web` Vite 工程壳 | 原样承载已确认的 `app/index.html`、`app/styles.css`、`app/main.js`，不按 feature 重写当前 MVP |
| 后端 | `apps/api`，Fastify + TypeScript | 只读 API，从 `content/` 读取已校验 JSON/Markdown |
| 共享契约 | `packages/schemas`，Zod | 校验内容文件、API 响应和前端类型 |
| 内容源 | `content/*.json` + `content/notes/*.md` | 从当前 `app/main.js` 内嵌数组外置 |
| 素材源 | `public/assets/` + `content/assets-manifest.json` | 生产 Web 素材与原始素材分层 |
| 运行时 | Node.js `20.19+` 或 `22.12+` | 支持 Vite v8、本地 API 和测试工具链 |
| 测试 | Vitest + Playwright | 内容/API/schema 用 Vitest 校验；桌面 1024x768、1440x900 用 Playwright 验证原 demo 主路径 |

API 统一使用 `/api/v1` 前缀：

| Method | Path | MVP | 说明 |
| --- | --- | --- | --- |
| GET | `/api/v1/health` | 是 | API 健康检查 |
| GET | `/api/v1/site` | 是 | 站点标题、导航和元信息 |
| GET | `/api/v1/assets/manifest` | 是 | Web 素材清单 |
| GET | `/api/v1/map-points` | 是 | 入画地图热区 |
| GET | `/api/v1/scroll/segments` | 是 | 游湖横卷分段 |
| GET | `/api/v1/scroll/nodes` | 是 | 游湖节点题签和卡片 |
| GET | `/api/v1/notes` | 是 | 拾遗索引和证据状态 |
| GET | `/api/v1/notes/:id` | P1 | 拾遗详情正文 |
| GET | `/api/v1/cold-knowledge/sections` | 是 | 问湖冷知识图册 |
| POST | `/api/v1/inquiries` | 否 | MVP 返回 `501 INQUIRY_SUBMISSION_NOT_ENABLED` |

标准成功响应：

```ts
type ApiSuccess<T> = {
  data: T;
  meta: {
    schemaVersion: string;
    generatedAt: string;
  };
};
```

标准错误响应：

```ts
type ApiError = {
  error: {
    code: string;
    message: string;
    requestId: string;
  };
};
```

MVP 数据流：

```text
internal source references
  -> tools generate/verify Web assets
  -> content/*.json + content/notes/*.md + assets-manifest
  -> Fastify /api/v1 read-only API
  -> Vite wrapper serving app/index.html
  -> legacy demo runtime app/main.js
  -> Playwright desktop QA
```

当前 `app/` 是工程化 MVP 的前端主实现；`apps/web` 只提供开发服务器、生产构建和 API 代理。

## 2.1 工程化 MVP 当前实现状态

| 模块 | 当前实现 |
| --- | --- |
| 前端入口 | `apps/web` 使用 Vite 原样服务 `app/index.html`，沿用 hash 路由 `#map`、`#scroll?target=...`、`#notes`、`#inquiry` |
| 后端入口 | `apps/api`，Fastify 只读 API，监听 `127.0.0.1:4174` |
| 内容源 | `content/site.json`、`map-points.json`、`scroll-segments.json`、`scroll-nodes.json`、`notes.json`、`cold-knowledge.json`、`assets-manifest.json` |
| 共享契约 | `packages/schemas`，Zod 校验 API 内容、内容文件和前端类型 |
| 素材服务 | `/content-assets/:assetId` 从 `assets-manifest` 解析 Web 可用图片和 zip |
| API | 已实现 `/api/v1/health`、`/api/v1/site`、`/api/v1/assets/manifest`、`/api/v1/map-points`、`/api/v1/scroll/segments`、`/api/v1/scroll/nodes`、`/api/v1/notes`、`/api/v1/cold-knowledge/sections`；`POST /api/v1/inquiries` 返回 501 |
| 交互覆盖 | 沿用原 demo 的 Landing、入画、游湖横卷、节点卡片、拾遗参考图页、问湖冷知识图册和预览轮播 |
| QA | `validate:content`、Vitest、生产 build、Playwright 桌面 E2E；E2E 使用本机 Chrome channel |
| MVP 边界 | 桌面 Web only；移动端响应式、真实提交、账号、数据库和声景均后置 |

## 2.2 legacy 原型状态

| 模块 | 当前实现 |
| --- | --- |
| 路由 | 使用 hash：`#landing`、`#map`、`#scroll?target=...`、`#notes`、`#inquiry` |
| Landing | `app/assets/landing/landing-bg.png` 作为整屏背景，四个入口为绝对定位透明按钮 |
| 入画 | `app/assets/map/map-overview-bg.png` 作为底图，透明热区覆盖分卷文字 |
| 抬头 | `app-shell` 在主体验页统一显示，当前导航项标红 |
| 游湖 | `scrollSegments` 拼接 `孤山四圣延祥观.jpg`、`葛岭寺观平章第.jpg`、`巨石山下大石佛.jpg` 三段横卷 |
| 横卷交互 | 底部 range 控制左右位置，Pointer Events 拖拽横向/纵向平移，wheel 按鼠标位置锚定缩放，键盘左右移动 |
| 节点 | `scrollPanoramaNodes` 在横卷上生成朱砂纸签题签，文字逐字单列，坐标按底图同名题字精修 |
| 信息卡片 | `cardNode` 节点使用统一 `bridge-detail-card`；长标题经 `compactNodeTitle()` 去括号别名并按长度缩小字号 |
| 声景 | 相关状态和部分函数可保留为遗留占位，但 UI 入口已移除，当前不启用 |
| 拾遗 | `notes-view` 使用参考图整页底图，旧列表内容不再展示 |
| 问湖 | `coldKnowledgeSections` 渲染三组图册：`湖山岁时` 24 张、`湖上烟火` 12 张、`卷中微识` 4 张；每区块首屏最多 8 张，支持更多/收起、40 张真实图片预览轮播、区块纸签导航和已配置区块的整包下载 |

## 2.3 2026-07-03 legacy 代码同步

### 2.2.1 入口和抬头

- `app-shell` 通过 CSS 变量切换各版块抬头参考图；导航热区保持透明点击，避免点击抬头时出现红色块。
- `入画`、`游湖`、`拾遗`、`问湖` 的抬头分别使用对应运行期参考图；左上角印章统一使用 `app/assets/header/header-seal.png` 覆盖，避免不同截图印章清晰度不一致。
- `app/index.html` 中 CSS/JS 查询串需要在每轮交互改动后递增，避免浏览器缓存旧版本。

### 2.2.2 游湖横卷

- `scrollSegments` 每段需声明 `id`、`title`、`image`、`width`、`height`，可选 `cropLeft`、`cropRight`、`aliases`。
- `renderScroll()` 会给图片写入 `width`、`height` 属性；`refreshScrollMetrics()` 优先使用 `image.naturalWidth || segment.width` 和 `image.naturalHeight || segment.height`，避免等待图片完全加载后才排版。
- `state.scrollWidth`、`state.scrollHeight`、`state.scrollMaxOffset`、`state.scrollMaxYOffset`、`state.scrollOffsetY` 共同控制横卷平移与缩放。
- `setScrollZoom(zoom, anchorX, anchorY)` 以鼠标在 `scrollStage` 内的 X/Y 为锚点，缩放后重新计算横向 `currentNorm` 和纵向 `scrollOffsetY`。
- `onPointerMove()` 同时处理横向 `deltaX` 和纵向 `deltaY`；未放大时 `scrollMaxYOffset` 为 0，纵向拖动自动无效。

### 2.2.3 游湖节点与卡片

- 节点题签由 `markerLabelMarkup(label)` 把中文逐字拆成 `<span class="bridge-marker-char">`，CSS 使用 flex column 堆叠，避免竖排文字自动分列。
- 题签应尽量覆盖底图上的同名文字；当前需保留已校准节点坐标，不要批量重置。
- `compactNodeTitle(title)` 会删除长标题末尾括号别名；`#node-panel-title` 根据 `is-long-title`、`is-very-long-title` 调整字号。
- 节点卡片正文仍来自 `card.sections`，结构统一为【节点简介】【南宋建制】【今日坐标】【史迹价值】。

### 2.2.4 问湖冷知识

- `coldKnowledgeSections` 是当前问湖图册的数据入口；每个 section 包含 `id`、`title`、`subtitle`、`description`、可选 `packDownload` 和 `cards`。
- `湖山岁时` 读取 `app/assets/cold-knowledge/hushan-sui-shi/{1..24}.png`，整包为 `app/assets/downloads/西湖繁胜冷识集-湖山岁时-24张.zip`。
- `湖上烟火` 读取 `app/assets/cold-knowledge/hushang-yanhuo/{1..12}.png`，整包为 `app/assets/downloads/西湖繁胜冷识集-湖上烟火-12张.zip`。
- `湖山岁时`、`湖上烟火` 知识卡片图片尺寸为 `1086x1448`；`卷中微识` 当前 4 张图片为 `1024x1536`，继续沿用既有冷知识图册卡片框架展示。
- 首页每个区块默认最多显示前 8 张；`湖山岁时` 首屏按钮为“更多 16 张”，展开后渲染 24 张并切换为“收起”；`湖上烟火` 首屏按钮为“更多 4 张”，展开后渲染 12 张并切换为“收起”；`卷中微识` 暂显示 4 张真实卡片，不显示占位和“更多卡片待补”。
- 卡片不显示序号、卡片标题或单张下载按钮；点击真实图片卡片调用 `openColdKnowledgePreview()` 弹出大图预览，右键图片由浏览器下载。
- `coldKnowledgeGallery` 只收集真实图片卡片，当前共 40 张；预览层 `#cold-card-preview` 支持上一张/下一张按钮、滚轮切换、循环索引、标题/计数显示和相邻图片预加载。
- 标题区 `cold-tag-nav` 使用 `data-cold-jump` 滚动到对应 section；section 设置 `scroll-margin-top` 避免被抬头遮住。

## 3. 页面与路由设计

| 页面 | 建议路由 | 作用 |
| --- | --- | --- |
| Landing Page | `/` | 项目题名、入境动效、主入口和轻量版块导览 |
| 入画 | `/map` | 南宋西湖鸟瞰示意地图，点击入口点进入游湖区域或锚点 |
| 游湖 | `#scroll?target={id}` | 当前为 `巨石山下大石佛` 横卷浏览、节点热点和信息卡片 |
| 拾遗 | `/notes`、`/notes/{id}` | 史料条目、图像线索、来源索引和未定问题 |
| 问湖 | `/inquiry` | 当前为冷知识图册墙；后续再扩展问题、讨论、线索提交和待核验内容 |

共享状态建议：

```yaml
currentRoute: 当前页面
currentMapPointId: 当前地图点
currentScrollX: 当前长卷归一化位置，0-1
selectedNodeId: 当前打开的游湖节点
selectedNoteId: 当前打开的拾遗条目
soundEnabled: 后续声景恢复时使用；当前 UI 不展示声景入口
activeAudioZone: 后续声景恢复时使用；当前初稿不启用
reducedMotion: 是否降级动效
```

## 4. 内容数据模型

当前初稿数据暂内嵌在 `app/main.js`，包括 `mapPoints`、`scrollNodes`、`scrollPanoramaNodes`、`notes`、`inquiries`。后续工程化建议再建立以下结构化数据文件，由页面组件读取：

| 数据 | 建议文件 | 用途 |
| --- | --- | --- |
| 站点元信息 | `content/site.json` | 项目题名、短引、导航、Landing CTA |
| Landing 层配置 | `content/landing.json` | 动效层、题签、入口按钮、跳过策略 |
| 地图点 | `content/map-points.json` | `入画` 地图热点、状态、跳转目标 |
| 游湖节点 | `content/scroll-nodes.json` | 长卷热点、卡片内容、坐标、关联条目 |
| 拾遗条目 | `content/notes.json` + `content/notes/*.md` | 史料结构、正文、来源、证据状态 |
| 问湖冷知识 | `content/cold-knowledge.json` | 后续工程化时外置冷知识分区、卡片路径、下载包和预览元数据 |
| 问湖共研内容 | `content/inquiries.json` | 后续扩展问题、讨论、线索、勘误、共创任务 |
| 声景区域 | `content/audio-zones.json` | 横向位置区间、音频层、淡入淡出规则 |
| 素材清单 | `content/assets-manifest.json` | Web 图像、瓦片、音频、占位资源路径 |

坐标统一采用归一化数值，避免素材尺寸变化后重新写死像素：

```yaml
position:
  x: 0.42
  y: 0.58
size:
  width: 0.08
  height: 0.06
```

### 4.1 MVP 游湖节点注册表

节点展示名称以用户提供名称为准，节点 id 用于游湖热点、路由、数据文件和跨版块关联。该表是 `游湖` 细节点清单，不等同于 `入画` 地图点清单。

| 展示名称 | 节点 id | 游湖路由 |
| --- | --- | --- |
| 断桥 | `duanqiao` | `/scroll?target=duanqiao` |
| 孤山路 | `gushan-road` | `/scroll?target=gushan-road` |
| 大石佛院 | `dashifo-yuan` | `/scroll?target=dashifo-yuan` |
| 十三间楼 | `shisanjianlou` | `/scroll?target=shisanjianlou` |
| 保叔塔与崇寿院 | `baoshu-ta-chongshou-yuan` | `/scroll?target=baoshu-ta-chongshou-yuan` |
| 智果院 | `zhiguo-yuan` | `/scroll?target=zhiguo-yuan` |
| 挹秀园 | `yixiu-yuan` | `/scroll?target=yixiu-yuan` |
| 贾似道赐第 | `jiasidao-ci-di` | `/scroll?target=jiasidao-ci-di` |
| 后乐园（原集芳御园） | `houleyuan-jifang-yuyuan` | `/scroll?target=houleyuan-jifang-yuyuan` |
| 唐招贤寺（宋禅宗院） | `tang-zhaoxian-si-song-chanzong-yuan` | `/scroll?target=tang-zhaoxian-si-song-chanzong-yuan` |
| 处士桥 | `chushi-qiao` | `/scroll?target=chushi-qiao` |
| 西太乙宫 | `xi-taiyi-gong` | `/scroll?target=xi-taiyi-gong` |
| 四圣延祥观 | `sisheng-yanxiang-guan` | `/scroll?target=sisheng-yanxiang-guan` |
| 西村酒楼 | `xicun-jiulou` | `/scroll?target=xicun-jiulou` |
| 西村渡口 | `xicun-dukou` | `/scroll?target=xicun-dukou` |

录入原则：

- 后续 `scroll-nodes.json` 应包含本表 15 个节点；当前初稿仅将 15 个节点作为注册表和问湖/拾遗关联选项保留。
- 游湖节点坐标来自内部原始标注资料和三张已发布横卷切片。
- 坐标先录入为归一化值，后续可由标注工具或脚本精修。

### 4.2 入画地图入口点

`入画` 当前使用整张参考图底图，地图点以透明热区覆盖图中红色分卷文字区域；后续工程化时再把这些热区外置为 `map-points.json`。不要求覆盖 4.1 节全部 15 个游湖细节点。

`map-points.json` 字段建议：

```yaml
id: map-entry-001
label: 鸟瞰入口点名称
region: 西湖北岸
status: open | locked | pending
targetType: region | scrollX | node
scrollTarget: 游湖区域 id / 归一化 scrollX / 最近节点 id
sourceStatus: 已证实/较可信/待考证/创作性推演
summary: 入口说明
position:
  x: 0.42
  y: 0.58
```

录入原则：

- 当前热区坐标来自 `app/assets/map/map-overview-bg.png` 的视觉位置；后续可用内部原始标注资料校准。
- `targetType=node` 时，`scrollTarget` 才需要等于某个 `scroll-nodes.json` 节点 id。
- `targetType=region` 或 `targetType=scrollX` 时，`scrollTarget` 可以指向区域 id 或归一化横向位置。
- 部分细节点只在 `游湖` 长卷内出现，不进入 `map-points.json`。

## 5. 页面实现方案

### 5.1 Landing Page / Entry

内容实现：

- 当前直接使用 `app/assets/landing/landing-bg.png` 作为 Landing 整屏底图。
- 当前四个版块入口写在 `app/index.html`，位置由 `app/styles.css` 中 `.landing-entry-*` 控制。
- 后续工程化时，可再把题名、入口和动效配置拆入 `site.json` / `landing.json`。

交互实现：

- 首次访问展示静态底图和四个入口；入口直接导航到 `#map`、`#scroll`、`#notes`、`#inquiry`。
- 当前不设置单独主 CTA、“直接入画”按钮或“跳过动效”按钮。
- 后续如果新增动效，再考虑本地状态和跳过策略。
- 检测 `prefers-reduced-motion`，开启时只保留静态封面和轻量 opacity 过渡。
- 动效使用 transform 和 opacity，避免大面积滤镜、频繁布局计算和不可控视频背景。

验收重点：

- 3 秒内可点击四个入口热区。
- 题名“西湖繁胜全景图”是第一视觉信号。
- 低性能桌面环境降级后仍能进入 `/map`。

### 5.2 入画 Bird's-eye Map

内容实现：

- 当前入画底图为 `app/assets/map/map-overview-bg.png`。
- 透明热区写在 `app/index.html` 的 `.map-volume-hit` 按钮中，坐标写在 `app/styles.css`。
- 当前重点热区：`hit-stone`、`hit-geling`、`hit-gushan`，对应 `巨石山下大石佛`、`葛岭寺观平章第`、`孤山四圣延祥观` 等分卷入口。
- 其他热区可保留为后续分卷占位，但不代表已完成对应页面。
- 后续工程化时，再改为读取 `map-points.json`。

交互实现：

- 地图容器保持固定比例，使用 `object-fit: contain` 或 SVG viewBox 保证桌面视口缩放稳定。
- 地图热区是可聚焦按钮，hover/focus 可有轻量反馈，但不显示大型浮层。
- 当前热区点击进入 `#scroll?target={scrollTarget}`，由 hash 路由解析。
- `status=locked/pending` 的点只展示待开放说明，不做强 CTA。
- 点击返回或主导航时保留最近地图点状态，方便从游湖返回入画。

验收重点：

- 桌面热区可被鼠标点击和键盘聚焦，命中区域覆盖目标分卷文字且不误触相邻区域。
- 用户能理解地图是“示意性”，不是 GIS 精准复原。
- 地图点进入长卷后位置准确。

### 5.3 游湖 The Scroll

内容实现：

- 当前长卷素材直接读取 `app/assets/scroll/north-bank/` 下的三段发布级横卷，并由 `scrollSegments` 拼接。
- 后续正式发布前再生成 WebP/AVIF、多分辨率或瓦片素材，放入 `public/assets/scroll/north-bank/` 或等价目录。
- `南宋西湖北线加标注.jpg`、`南宋西湖北线加标注2.jpg`、`南宋西湖北线加标注3.jpg` 可作为后续节点定位和文字识别参考。
- 当前横卷热点读取 `scrollPanoramaNodes`，包含标题、分类、分卷 id、归一化命中区域、摘要、考证状态、卡片正文和题签标签。
- 15 个 `scrollNodes` 同时作为全量节点注册表、关联选项和可视热点的基础清单；后续仍需补正式史料来源和继续精修坐标。
- 声景数据当前不读取，`audio-zones.json` 后置。

交互实现：

- 用一个固定视口容器承载长卷层，通过 `translate3d(x, y, 0)` 移动画面。
- 当前维护有限范围的 `currentNorm`、`scrollWidth`、`scrollHeight`、`scrollMaxOffset`、`scrollMaxYOffset`、`scrollOffsetY` 和 `scrollZoom`；不实现 modulo 无缝循环。
- 桌面滚轮用于调整 `scrollZoom`，并以鼠标位置为 X/Y 缩放锚点；拖拽用 Pointer Events，放大后可上下拖动画卷；底部 range 控制左右位置；键盘支持左右键和 Esc。
- 当前不做首尾无缝循环。
- 节点热点按长卷坐标渲染在同一 transform 层内，随画卷同步移动。
- 点击节点打开纸墨信息层，信息层不随画卷移动；Esc、关闭按钮、点击遮罩可关闭。
- 从地图进入时读取 `target`，换算到 `currentScrollX` 并平滑定位；若用户开启 reduced motion，直接定位。
- 当前不显示声音按钮；不得在游湖页恢复声景图标、声景开关或声景状态条，除非用户重新确认。

验收重点：

- 滚轮、拖拽、键盘三种桌面输入不互相冲突。
- 节点卡片不遮挡刚点击的关键画面区域。
- 滑块、拖拽、滚轮缩放和键盘移动表现一致，不出现横卷错位。
- 声景不属于当前游湖验收。

#### 5.3.1 节点题签与卡片实现

当前 `app/main.js` 中 `cardNode()` 生成带 `card` 数据的游湖节点；`openNodePanel(item)` 对 `item.card` 走统一 `bridge-detail-card` 分支，不再把 `chushi-qiao` 误用为断桥专属分支。

实现要求：

- 节点题签由 `.scroll-bridge-marker`、`.bridge-marker-emblem`、`.bridge-marker-label`、`.bridge-marker-dot` 组成。
- `markerLabelMarkup(label)` 将中文标签拆成逐字 `<span class="bridge-marker-char">`，CSS flex column 保证竖版单列，不允许自动分两列。
- 题签坐标写在 `cardNode(id, title, category, segmentId, x, y, width, height, card)` 的归一化参数里；位置目标是遮住底图同名文字。
- `openNodePanel(item)` 对 `item.card` 隐藏通用 `summary`、`.node-meta`、`.panel-actions`，并在 `#node-panel-detail` 中渲染 `card.intro`、`card.sections` 和 `card.seal`。
- `compactNodeTitle(title)` 删除长标题末尾括号别名；标题元素按 `is-long-title`、`is-very-long-title` 自动调整字号。
- 样式使用 `.bridge-detail-card`、`.bridge-card-intro`、`.bridge-card-section`、`.bridge-card-seal`；不渲染右上角竖排标题，不使用标题横线。

### 5.4 拾遗 Historical Notes

内容实现：

- 条目结构读取 `notes.json`，长正文读取 `content/notes/*.md`。
- 每条条目必须包含 `id`、`title`、`category`、`sourceStatus`、`relatedMapPoint`、`relatedScrollNode`、`sources`。
- 来源字段必须结构化记录标题、作者/机构、年份、出处、链接/馆藏/页码。

交互实现：

- `/notes` 展示分类列表：画作概览、图像线索、流传考证、参考来源、未定问题。
- `/notes/{id}` 展示条目详情、来源列表、关联节点和关联问湖问题。
- 点击“回到画卷位置”进入 `/scroll?target={relatedScrollNode}`。
- 点击“发起问湖讨论”进入 `/inquiry?related={noteId}`，并预填关联对象。
- 支持按证据状态筛选，避免待考证内容和已证实内容混淆。

验收重点：

- 没有来源的内容只能显示为“待考证/推测”，不得写成定论。
- 每条示例条目都能回链到地图点或游湖节点。
- 阅读体验以横排为主，长正文不强行竖排。

### 5.5 问湖 Cold Knowledge / Inquiry

内容实现：

- 当前 P0 使用 `coldKnowledgeSections` 渲染冷知识图册墙，不渲染提问/线索表单。
- `coldKnowledgeSections` 直接内嵌在 `app/main.js`，每个 section 包含 `id`、`title`、`subtitle`、`description`、可选 `packDownload` 和 `cards`。
- 真实图片卡片进入 `coldKnowledgeGallery`，用于跨区块预览轮播；占位卡片不进入预览轮播。
- 后续共研版本再用 `inquiries.json` 提供静态样例或真实后端数据，内容类型包括 `question`、`discussion`、`clue`、`correction`、`task`。
- 后续每条共研内容保留 `relatedTo`、`source`、`status`、`submitterNote`、`createdAt` 字段。

交互实现：

- 页面提供三个分区纸签：`湖山岁时`、`湖上烟火`、`卷中微识`，点击后滚动到对应 section。
- 每个 section 默认只渲染前 8 张卡片；有剩余真实卡片时通过 `[data-cold-more]` 切换展开/收起，展开后仍追加到同一个 grid。
- 真实图片卡片带 `role="button"` 和 `tabindex="0"`，支持点击、Enter 和 Space 打开预览。
- 预览层按 `state.coldPreviewIndex` 维护当前索引；上一张/下一张按钮和滚轮事件都调用 `stepColdKnowledgePreview()`，索引通过 `normalizeColdKnowledgeIndex()` 循环。
- 预览层打开时给 `body` 添加 `has-cold-preview`；关闭按钮或点击背景关闭预览。
- 从游湖节点或拾遗条目进入问湖并自动带入关联对象的能力后置到共研版本。
- 表单、提交后的本地预览、待核验状态和筛选列表后置；不做点赞排行、热榜和强社交流。

验收重点：

- 用户能区分三个冷知识分区，并能使用纸签导航跳转。
- `湖山岁时` 展开后显示 24 张真实卡片，`湖上烟火` 展开后显示 12 张真实卡片，`卷中微识` 显示 4 张真实卡片且无占位。
- 点击真实卡片能打开 40 张图片范围内的预览轮播，上一张/下一张、滚轮切换、标题和计数均可用。
- 所有用户贡献默认待核验的规则保留为后续共研版本质量门槛，不作为当前 P0 页面验收。

## 6. 共享组件与交互模块

建议优先抽象以下模块：

- `AppShell`：主体验导航、当前版块状态。
- `EntryLanding`：Landing 底图层和四个入口热区。
- `MapPointLayer`：地图点渲染、浮层、状态样式。
- `ScrollViewport`：长卷视口、虚拟位置、输入事件。
- `NodeHotspotLayer`：游湖节点热点与选中态。
- `NodeInfoPanel`：节点信息卡片、来源、关联跳转。
- `AudioController`：后续声景恢复时再启用；当前初稿不渲染声音开关。
- `EvidenceBadge`：已证实、较可信、待考证、创作性解读。
- `ColdKnowledgeGallery`：问湖冷知识分区、更多/收起、卡片预览轮播。
- `InquiryForm`：问湖提问、线索、勘误表单，后续共研版本再启用。

## 7. 素材与目录策略

- `data/raw/`：原始采集数据，默认不提交 Git。
- `app/assets/landing/landing-bg.png`：当前 Landing 底图。
- `app/assets/map/map-overview-bg.png`：当前入画底图。
- `app/assets/scroll/north-bank/`：当前 `游湖` 三段发布级横卷底图。
- 内部原始标注资料：后续 `入画` 地图点、`游湖` 节点定位和文字标注校准参考，不进入公开仓库。
- `data/processed/`：清洗后的中间数据，默认不提交 Git，除非用户明确确认。
- `data/workbooks/`：稳定工作簿、测算表和可追踪表格。
- `exports/pdf/`：PDF 导出物，默认不提交 Git。
- `exports/images/`：图片导出物，默认不提交 Git。
- `tools/`：素材处理、切片、格式转换、数据校验脚本。
- `content/`：后续前端工程的结构化内容源，需在建立工程时再确认是否纳入 Git。
- `public/assets/`：后续前端工程的 Web 可用素材目录，不放原始大图。

图片处理原则：

1. 原始大图只作为源文件保存，不直接进入页面。
2. 当前初稿可直接引用已确认底图；正式发布前 Landing、入画地图、游湖长卷分别生成独立 Web 优化素材。
3. 长卷素材优先生成多分辨率或瓦片，避免一次加载 141MB 级别文件。
4. 标注参考图只用于录入坐标、文字和跳转关系；生产页面的地图点、热点、文字说明和卡片必须由数据层渲染。
5. 生成 Web 素材时应尽量使用无文字标注版本；如必须使用标注参考图，应只用于内部调试，不进入最终用户界面。
6. 所有生成文件保留处理脚本或参数记录，确保可复现。

## 8. 自动化与校验

脚本统一放入 `tools/`。建议逐步补充：

- 素材检查：列出原始图尺寸、体积、格式和是否适合 Web。
- 图片生成：从原始素材生成 WebP/AVIF、缩略图、瓦片或预览图。
- 数据校验：检查地图点、游湖节点、拾遗条目、问湖冷知识卡片和后续共研内容的必填字段与关联 id。
- 链接校验：检查 `scrollTarget`、`relatedScrollNode`、`relatedMapPoint`、`noteEntry` 是否存在。
- 当前游湖节点校验：检查 `巨石山下大石佛` 横卷能加载，`断桥` 标记能点击并打开专属卡片。15 个节点全量校验后置到扩展阶段。
- 入画入口点校验：检查 `map-points.json` 中每个 `status=open` 的入口点都能进入有效游湖区域、`scrollX` 或节点；不要求覆盖全部 15 个游湖节点。
- 坐标校验：检查地图点坐标和游湖节点坐标均为 0-1 归一化数值，且不超出素材边界。
- 体积报告：输出各页面首屏和关键资源体积，辅助性能验收。

新增依赖、运行环境或命令后，必须在本文件补充说明。

## 9. 质量闸门

内容质量：

- 事实、推测、审美解读必须分层。
- 没有来源的内容不得写成确定史实。
- 后续问湖共研内容默认待核验，不与正式拾遗内容混排。
- 标注图中的文字不默认等同于正式史料说明；节点说明进入正式内容前仍需来源和证据状态。

交互质量：

- Landing 入口、地图热区、节点热点、卡片关闭必须支持键盘操作。声音开关当前不显示。
- 桌面可点击区域必须可见、可聚焦、可操作；移动端 44px 触控目标后置到响应式专项。
- 支持 reduced motion；声音入口当前移除。
- 长卷交互不能锁死页面，必须保留返回、关闭和导航路径。
- 入画地图入口点必须可键盘聚焦，并能进入对应游湖区域、`scrollX` 或最近节点。
- 当前初稿至少保证 `断桥` 能在横卷内通过热点打开专属卡片；15 个 MVP 游湖细节点全量热点后置。

性能质量：

- Landing 首屏目标 3 秒内可交互。
- 长卷移动优先使用 transform，避免滚动中触发布局抖动。
- 大图和后续内容按需加载；音频后置。
- 当前已确认设计图可作为原型底图直接加载；正式发布前再替换为 Web 优化素材。原始超大图仍不得作为最终用户首屏大图直接加载。

仓库质量：

- 不把 token 化链接、隐私数据、临时截图、自动化输出写入稳定报告。
- 未经用户确认，不提交原始数据、截图、导出 PDF 或临时文件。
- 需要导出 PDF 时，先确认源 Markdown 内容稳定。
- 执行批量移动或重命名前，先盘点源路径和目标结构。
- 路径调整后同步更新 `README.md`、`AGENTS.md`、`PRD.md`、`TDD.md`。

## 10. MVP 验证清单

- Landing：底图明确，四个入口可点击，低性能降级可用。
- 入画：分卷热区可聚焦、可点击，开放点能进入游湖目标位置，待开放点不误导。
- 游湖：底部滑块、拖拽、滚轮缩放、键盘可用；`巨石山下大石佛` 横卷不卡顿；断桥热点和卡片可开关。
- 拾遗：条目有证据状态和来源结构，可回到对应画卷节点。
- 问湖：三类冷知识分区可见，更多/收起可用，真实图片可进入 40 张范围内的大图预览轮播，已配置区块的整包下载入口可见。
- 声景：当前初稿不展示；恢复前需更新 PRD/TDD/DESIGN。
