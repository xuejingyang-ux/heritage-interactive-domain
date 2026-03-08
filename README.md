# 境生·万象 — 非遗沉浸交互域

> 打破时空界限，以数字之笔重绘非遗华章。  
> 在这里，传统不再是静止的古董，而是可感、可触、可创的活态文明。

基于 **Web3D × AIGC × Motion Capture** 构建的中华非物质文化遗产沉浸式交互空间，融合现代前端技术与 Google Gemini / Imagen AI，呈现四大核心模块。

---

## ✨ 功能模块

| 模块 | 名称 | 技术 | 描述 |
|------|------|------|------|
| 解构·匠心 | 榫卯 3D 交互 | React Three Fiber | 高精度 PBR 材质渲染，实时爆炸视图，物理拼装演示 |
| 入戏·非遗 | 数字皮影 | MediaPipe / Canvas | 摄像头动作追踪，实时驱动皮影人偶 |
| 赋诗·造物 | AI 诗词画境 | Gemini 2.5 + Imagen 3 | 输入诗词意象，生成意境解读与国风画作 |
| 历史长卷 | 时间轴卷轴 | GSAP ScrollTrigger | 横向滚动叙事，五朝非遗传承脉络 |

---

## 🚀 快速开始

### 前置条件

- **Node.js** v18 或以上（当前环境：v20）
- **智谱AI API Key**（GLM-4-Flash 文本完全免费，CogView-3-Flash 图像有免费额度）
  → 前往 [BigModel 开放平台](https://open.bigmodel.cn/) 注册获取

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env` 文件（**注意：是 `.env`，不是 `.env.local`**）：

```env
# 必填：智谱AI API Key（在 https://open.bigmodel.cn/ 免费注册获取）
ZHIPU_API_KEY=your_zhipu_api_key_here

# 可选：后端端口，默认 8787
API_PORT=8787

# 可选：数据库路径，默认 server/data/app.db
DB_PATH=server/data/app.db
```

> ⚠️ 请勿将 `.env` 文件提交到版本控制。

### 3. 启动项目

**方式一：一键启动（推荐）**

```bash
npm run dev:full
```

同时启动后端（端口 8787）和前端（端口 3000）。

**方式二：分窗口启动**

```bash
# 终端 A — 启动后端
npm run dev:server

# 终端 B — 启动前端
npm run dev:client
```

### 4. 访问

打开浏览器访问：**[http://localhost:3000](http://localhost:3000)**

> 💡 皮影模块需要摄像头权限，请在浏览器弹出授权提示时点击「允许」。

---

## 📦 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev:full` | 同时启动前端 + 后端（开发首选） |
| `npm run dev:client` | 仅启动 Vite 前端开发服务器 |
| `npm run dev:server` | 仅启动 Express 后端服务 |
| `npm run build` | 构建生产前端产物到 `dist/` |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | TypeScript 类型检查 |

---

## 🏁 比赛提交网址（推荐 Netlify Free）

如果你希望**免绑卡**并快速拿到一个可访问网址，建议使用 **Netlify Free**。当前仓库已经补充了 `netlify.toml` 和 `netlify/functions/api.mjs`，前端会发布为静态站点，`/api` 会由 Netlify Functions 提供。

### 1. 推送代码到 GitHub

确保仓库包含：

- `netlify.toml`
- `netlify/functions/api.mjs`
- `src/` + `vite.config.ts`

### 2. 在 Netlify 导入仓库

1. 登录 Netlify，点击 **Add new project** → **Import an existing project**
2. 选择 GitHub 并授权仓库访问
3. 选择你的仓库 `heritage-interactive-domain`
4. Build command 填：`npm install && npm run build`
5. Publish directory 填：`dist`

### 3. 配置环境变量

在 Netlify 项目设置中补充：

- `ZHIPU_API_KEY=你的key`

### 4. 等待部署完成并获取 URL

部署成功后会得到类似：

`https://your-site-name.netlify.app`

这个链接就是可提交的网址。

### 5. 提交前检查

- `https://.../` 首页可打开
- `https://.../sunmao` 等子页面可直接访问
- `https://.../api/health` 返回健康检查 JSON
- 摄像头模块需 HTTPS（Netlify 默认是 HTTPS）

> 说明：Netlify 版本的 `/api/poetry/history` 使用函数内存保存最近记录，适合演示，不保证长期持久化。如果你需要稳定保存历史记录，后续应接入外部数据库。

---

## 🏁 备选方案：Render 单服务部署

如果你更看重后端常驻服务和 SQLite 本地持久化，也可以继续使用 **Render 单服务部署**（前后端同域名，一个链接即可演示全部功能）。

### 1. 推送代码到 GitHub

确保仓库包含：

- `render.yaml`
- `server/`（后端）
- `src/` + `vite.config.ts`（前端）

### 2. 在 Render 创建 Web Service

1. 登录 Render，点击 **New +** → **Blueprint**（推荐，自动读取 `render.yaml`）  
2. 选择你的 GitHub 仓库并创建  
3. 在环境变量中补充：`ZHIPU_API_KEY=你的key`

### 3. 等待构建完成并获取 URL

部署成功后会得到类似：

`https://your-service-name.onrender.com`

这个链接就是比赛可提交网址。

### 4. 提交前检查

- `https://.../` 首页可打开
- `https://.../sunmao` 等子页面可直接访问
- `https://.../api/health` 返回健康检查 JSON
- 摄像头模块需 HTTPS（Render 默认是 HTTPS）

> 说明：项目已支持生产环境由 Express 同时托管 `dist` 前端和 `/api` 后端，无需拆成两个域名。

---

## 🧯 常见问题

### Vite 报错 `JavaScript heap out of memory`

如果你看到类似：

```text
FATAL ERROR: Committing semi space failed. Allocation failed - JavaScript heap out of memory
```

通常是依赖重优化（`Re-optimizing dependencies`）阶段触发的内存不足。项目脚本已内置更高的 Node 堆上限（`--max-old-space-size=4096`）。

若仍偶发，先清理缓存再重启：

```bash
rm -rf node_modules/.vite
npm run dev:client
```

在 Windows PowerShell 可用：

```powershell
Remove-Item -Recurse -Force node_modules/.vite
npm run dev:client
```

---

## 🗂️ 项目结构

```
├── index.html                  # 入口 HTML
├── src/
│   ├── main.tsx                # React 应用入口
│   ├── App.tsx                 # 主页面布局与导航
│   ├── index.css               # 全局样式（Tailwind v4 + 主题色）
│   ├── components/
│   │   ├── SunmaoModule.tsx    # 榫卯 3D 交互模块
│   │   ├── ShadowPuppetModule.tsx  # 数字皮影模块
│   │   ├── PoetryModule.tsx    # AI 诗词画境模块
│   │   └── ScrollModule.tsx    # 历史长卷滚动模块
│   └── lib/
│       └── utils.ts            # cn() 工具函数
├── server/
│   ├── index.mjs               # 服务端入口
│   ├── app.mjs                 # Express 应用配置
│   ├── config.mjs              # 环境变量读取
│   ├── db.mjs                  # SQLite 初始化与 CRUD
│   ├── routes/
│   │   ├── health.mjs          # GET /api/health
│   │   └── poetry.mjs          # POST/GET /api/poetry
│   ├── services/
│   │   └── poetryService.mjs   # Gemini + Imagen 3 调用逻辑
│   ├── middleware/
│   │   ├── requestLogger.mjs   # 请求日志
│   │   └── errorHandler.mjs    # 统一错误处理
│   └── data/                   # SQLite 数据库文件（自动创建）
├── vite.config.ts              # Vite 配置（含 /api 代理）
├── tsconfig.json
└── package.json
```

---

## 🔌 后端 API

### 健康检查
```
GET /api/health
```

### 生成诗词画境
```
POST /api/poetry
Content-Type: application/json

{ "prompt": "明月松间照，清泉石上流" }
```

响应：
```json
{
  "id": 1,
  "text": "月光透过松林洒落，清泉于石间潺潺流淌...",
  "image": "data:image/png;base64,..."
}
```

### 获取历史记录
```
GET /api/poetry/history?limit=8
```

---

## 🛠️ 技术栈

**前端**
- React 19 + TypeScript
- Vite 6 + Tailwind CSS v4
- React Three Fiber / Three.js（3D 渲染）
- GSAP ScrollTrigger（滚动动画）
- Framer Motion（交互动效）
- MediaPipe Tasks Vision（动作追踪）

**后端**
- Node.js + Express
- better-sqlite3（本地持久化）
- dotenv（环境变量）

**AI 服务**
- 智谱AI GLM-4-Flash（文本理解与意境生成，免费）
- 智谱AI CogView-3-Flash（国风图像生成，免费额度）

---

## 🎨 主题色系

| 色名 | 色值 | 含义 |
|------|------|------|
| `zhusha` | `#FF461F` | 朱砂·主题色 |
| `ink` | `#1A1A1A` | 墨色 |
| `paper` | `#F5F2ED` | 宣纸色 |
| `tianqing` | `#B2D0D0` | 天青 |
| `dailan` | `#424C50` | 黛蓝 |
| `tenghuang` | `#FFB61E` | 藤黄 |
