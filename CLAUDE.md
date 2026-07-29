# Hexo 博客 — 项目说明（Claude / Agent）

本仓库是 **Spa-Master** 的 Hexo 博客源码（主题 Butterfly），内容主要从 **Obsidian vault** 同步而来。  
日常写作在 Obsidian；本仓负责渲染、构建、部署到 GitHub Pages。

站点：https://hrbeny.github.io  
远程：`HRbenY/HRbenY.github.io`

---

## 1. 内容流水线

```
Obsidian 写笔记 (front matter: published = true)
  → Obsidian 仓库 GitHub Action 推送笔记到本仓 main
  → 本仓 Action: cover:sync → hexo generate → 推 gh-pages
  → GitHub Pages 发布
```

本地常用命令：

```bash
npm run server      # cover sync + hexo server
npm run build       # cover sync + hexo generate
npm run cover:sync  # 仅同步/生成文章头图
npm run clean
```

Python 依赖（头图）：`requirements.txt` → Pillow。字体：`assets/fonts/MapleMono-NF-CN-Regular.ttf`。

---

## 2. 渲染栈（改配置前必读）

| 组件 | 实际生效位置 | 说明 |
|---|---|---|
| 渲染器 | `hexo-renderer-markdown-it-plus` | **只读** `_config.yml` 的 `markdown_it_plus:` |
| 主题 | Butterfly | `_config.butterfly.yml` |
| 双链 | `hexo-filter-titlebased-link` | `_config.yml` → `titlebased_link.enable` |
| 公式（构建期） | 渲染器内置 `@iktakahiro/markdown-it-katex` | 输出 KaTeX HTML |
| 公式（页面样式） | Butterfly `math.use: katex` | 注入 KaTeX CSS |
| Callout | `markdown-it-obsidian-callouts` | 挂在 `markdown_it_plus.plugins` |
| 任务列表 | `markdown-it-task-lists` | 同上 |
| Callout 样式 | `source/css/callout_blocks.css` | Butterfly `inject.head` 引入 |

### 常见坑：无效配置段

`_config.yml` 里的 **`markdown:`** 段（含其 `plugins`）对当前渲染器**基本无效**。  
新增 markdown-it 插件必须写在：

```yaml
markdown_it_plus:
  plugins:
    - plugin:
        name: some-plugin
        enable: true
        options: { ... }
```

不要写到 `markdown.plugins` 却以为会生效。

---

## 3. Obsidian → Hexo 适配清单

从 Obsidian 发布到 Hexo，**不是开箱即用**。下列是本仓已做的适配与仍须注意的限制。

### 3.1 公式（高优先级）

| 问题 | 原因 | 本仓做法 |
|---|---|---|
| 公式有 HTML 但样式乱/空白 | 构建期用 KaTeX，主题却加载 MathJax；无 KaTeX CSS | Butterfly：`math.use: katex` |
| 段落中间的 `$$...$$` 不渲染 | `markdown-it-katex` 只认独立 display 块 | `scripts/normalize-display-math.js`：渲染前把 `$$...$$` 规范成独立块（跳过代码围栏） |
| 行内 `$...$` | 渲染器内置支持 | 一般可用；复杂式优先独立 `$$` 块 |

**写作建议：**

- 复杂公式尽量单独成段：

  ```md
  $$
  \Delta{\omega_i} = \cdots
  $$
  ```

- 即使写在句中 `text$$...$$text`，本仓 filter 也会尽量拆成块；仍建议源文干净。
- 代码块里的 `$` 不会被 math filter 改动（有 fence 保护）。

### 3.2 Callout（`> [!note]`）

| 问题 | 原因 | 本仓做法 |
|---|---|---|
| 折叠方向反了 / 不认 `+` `-` | 旧插件 `mdit-plugin-callouts` 用 `\|open`/`\|closed`，不认 OFM | 使用 `markdown-it-obsidian-callouts` |
| 样式丢失 | 新插件 DOM 是 `.callout[data-callout=...]` | `source/css/callout_blocks.css` 按 OFM DOM 写样式 |

**Obsidian 语义（本仓已对齐）：**

| 写法 | 行为 |
|---|---|
| `> [!tip]-` | 默认可折叠且**收起** |
| `> [!info]+` | 默认可折叠且**展开** |
| `> [!note]`（无 `+`/`-`） | 常显块（非 `<details>`） |

### 3.3 任务列表

| 问题 | 本仓做法 |
|---|---|
| `- [ ]` / `- [x]` 当纯文本 | `markdown-it-task-lists` + `callout_blocks.css` 中 checkbox 样式 |

### 3.4 双链 `[[...]]`

| 能力 | 状态 |
|---|---|
| `[[笔记名]]` | 支持；**按 md 文件名（basename）匹配**，不是 front-matter title |
| `[[笔记\|别名]]` | 支持 |
| `[[笔记#标题]]` | 支持（锚点会做 slug 化） |
| `[[folder/note]]` 路径链 | **不支持**（插件正则禁止 `/`） |
| `![[嵌入]]` | **不支持**（插件刻意排除 `![[`） |
| 链到未发布/库外笔记 | 原样留下 `[[...]]` 文本 |

插件：`hexo-filter-titlebased-link`（`titlebased_link.enable: true`）。

**写作建议：**

- 被链接笔记文件名与 `[[链接文本]]` 一致（或使用别名语法）。
- 发布集内尽量闭环；帮助文档式交叉引用若目标未同步，会断链。

### 3.5 标签

Obsidian 常见 `#tag` / front matter 带 `#` 前缀。  
本仓 `scripts/normalize-tags.js` 在 `before_generate` 去掉 tag 前导 `#` 并去重。

### 3.6 permalink / 下载问题

若 front matter 写：

```yaml
permalink: syntax          # 无尾斜杠
```

Hexo 会生成**无扩展名裸文件**，本地/部分服务器返回 `Content-Type: application/octet-stream`，浏览器会**下载**而不是打开页面。

**正确写法：**

```yaml
permalink: syntax/         # 带尾斜杠 → public/syntax/index.html
```

或省略 `permalink`，使用站点默认 `:year/:month/:day/:title/`。

测试语料示例：`source/_posts/obsidian/90-Archived/Obsidian/` 三篇官方帮助摘录。

### 3.7 图片与资源

| 写法 | 建议 |
|---|---|
| CDN / 绝对 URL `![](https://...)` | 推荐，稳定 |
| 站内 `/img/...` | 可 |
| 相对路径 `![](image.png)` | 易 404（同步时常未带上附件） |
| `![[img.png]]` / `![](...\|100)` 尺寸 | 标准 MD/本仓**基本不支持** Obsidian 尺寸扩展 |

### 3.8 其它 OFM / 常用语法状态

| 语法 | 状态 |
|---|---|
| `==高亮==` | 支持（内置 `markdown-it-mark`） |
| `~~删除线~~` | 支持 |
| 脚注 `[^1]` | 支持（内置 footnote） |
| `H~2~O` / `X^2^` | 支持（sub/sup） |
| `%%注释%%` | **未适配**（会当正文显示） |
| Mermaid | 主题侧 `mermaid.enable` 当前为 false；开了才出图 |
| Dataview / 块引用 `^id` / `[[n#^id]]` | **未适配** |
| `[TOC]` | 不可靠（内置 TOC 语法通常不是这个） |

---

## 4. 相关文件索引

```
_config.yml                 # 站点配置、markdown_it_plus、titlebased_link
_config.butterfly.yml       # 主题：math.use=katex、inject callout CSS 等
scripts/
  normalize-display-math.js # $$ display 规范化
  normalize-tags.js         # tag 去 #
  generate-root-json-assets.js  # words.json / status.json → public
source/css/callout_blocks.css   # Callout + 任务列表样式
tools/cover_sync.py         # 按规则自动生成文章封面 PNG（标题/标签）
source/img/jvgou2.jpg       # 站点横幅与滚动背景（源文件：Downloads/巨构2.jpg）
source/css/theme-palette.css # 青绿调色盘（主色 #336666 + 相近色阶）
source/img/covers/auto/     # cover_sync 生成的文章封面
source/_posts/obsidian/     # 同步来的笔记
  90-Archived/Obsidian/     # OFM 测试语料（官方帮助三篇）
```

### 全站头图 vs 文章封面（区分）

| 用途 | 资源 | 配置 |
|---|---|---|
| 首页/归档等**横幅**、滚动**背景** | `source/img/jvgou2.jpg` | `default_top_img` / `index_img` / `archive_img` / `background` 等 |
| 文章列表/文章页 **cover 卡片图** | `source/img/covers/auto/*.png` | `tools/cover_sync.py` 写入 front matter `cover:` |

不要把静态巨构图写进各篇 `cover`，否则会覆盖自动生成规则。`cover: false` 可关闭单篇封面。

### 主题色盘（#336666 同色系）

- Butterfly `theme_color`：主色/链接/TOC 等用 `#336666`，Hover/选中用 `#478c8c`，meta 用 `#7a9999`，行内 code 底 `#e0ecec`
- `source/css/theme-palette.css`：页面底 `#f5f8f8`、卡片白、标题 `#1a2626`、正文 `#3d4d4d`、代码块 `#1e2929`、分割线 `#d4e0e0`；功能色 Info/Warning/Danger/Accent 仅用于 callout/强调
- 注入：`_config.butterfly.yml` → `inject.head` 引入 `theme-palette.css`

依赖（与 OFM 相关）：

- `hexo-renderer-markdown-it-plus`
- `hexo-filter-titlebased-link`
- `markdown-it-obsidian-callouts`
- `markdown-it-task-lists`
- （遗留、当前未挂载）`mdit-plugin-callouts`、`markdown-it-mathjax3`

---

## 5. 换主题 / 自定义主题时：什么会失效

一句话：**Markdown 解析与 HTML 结构大体不依赖主题；观感（CSS）和公式字体依赖主题注入，迁主题时要重接。**

### 5.1 换主题后通常仍有效（站点级）

下列在 `_config.yml`、`package.json`、`scripts/`、`source/`，**不读主题目录**：

| 机制 | 位置 |
|---|---|
| 渲染器 + `markdown_it_plus` 插件 | Callout、任务列表、内置 KaTeX 出 HTML 等 |
| `scripts/normalize-display-math.js` | 句中 `$$` 规范化 |
| `scripts/normalize-tags.js` | tag 去 `#` |
| `hexo-filter-titlebased-link` | `[[双链]]` |
| `permalink` / 默认 URL 规则 | `_config.yml` + 文章 front matter |
| `source/css/callout_blocks.css` 文件本身 | 会生成到 `public/css/`，**文件不会丢** |

只换主题包、保留上述配置时：**双链、公式 DOM、callout/任务列表的 HTML 结构应继续生成。**

### 5.2 和主题绑定、迁主题必须处理

| 依赖 | 当前（Butterfly） | 迁主题时 |
|---|---|---|
| **KaTeX CSS** | `_config.butterfly.yml` → `math.use: katex` | 新主题开 KaTeX，或在 head 自行 inject `katex.min.css`。否则公式 HTML 在、样式乱/空白。 |
| **Callout / 任务列表 CSS 是否被引用** | `inject.head` 引入 `/css/callout_blocks.css` | 把等价 `<link>` 写到新主题 head 注入位或自定义 layout。文件在 `source/`，**丢的是引用，不是文件。** |
| 主题自带 Note / 代码块皮肤 / 目录 UI | 主题功能 | 预期会变，与 OFM 适配无关 |
| Mermaid 等 | 主题配置 | 需在新主题重新开启 |

**切勿**在换主题后把 `math` 改回仅 MathJax 且不注入 KaTeX CSS：构建期已是 KaTeX HTML，`$` 已被吃掉，MathJax 补不回来。

可选兜底 inject（任意主题 head）：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.27/dist/katex.min.css">
<link rel="stylesheet" href="/css/callout_blocks.css">
```

### 5.3 不同迁主题场景

| 场景 | 渲染适配 |
|---|---|
| 仍用 Butterfly，只改配色/布局 | 基本不动 |
| 换成 Fluid / NexT 等现成主题 | 保留 `markdown_it_plus` + `scripts/` + 双链插件；**重接 KaTeX CSS + callout CSS 引用** |
| 完全自写主题 | 同上；layout `head` 记得挂上述两个 CSS |

`source/_posts`、`source/css`、`scripts/` **不属于主题包**，换主题不会被主题覆盖删除。

### 5.4 迁主题后验收清单

打开一篇公式文 + 一篇含 callout/任务列表的文（可用三篇测试语料）：

1. [ ] `[[双链]]` 仍可点  
2. [ ] `$` / `$$` 排版正常（页面有 katex.css）  
3. [ ] `> [!tip]-` 默认收起、`+` 默认展开，左边框样式在  
4. [ ] `- [x]` 为 checkbox  
5. [ ] 页面源码中引用了 `/css/callout_blocks.css`  
6. [ ] 自定义 `permalink: xxx/` 为 `text/html`，不会触发下载  

---

## 6. 改适配时的原则

1. **先确认配置段是否生效**（`markdown_it_plus` vs 无效的 `markdown:`）。
2. **公式引擎只能有一套**：构建 KaTeX ↔ 主题（或 inject）KaTeX CSS；勿混用 MathJax 作为唯一前端引擎。
3. **Callout 只保留一套插件**，并与 CSS DOM 结构一致。
4. **优先用 filter 兼容 Obsidian 源文**，少改 vault 笔记正文（同步会被覆盖）。
5. **主题可换，站点级适配尽量放在 `_config.yml` / `scripts/` / `source/`**；主题里只做资源注入。
6. 本地验证用三篇测试文 + 真实笔记（如 Adamw、多线程编程）：
   - http://localhost:4000/syntax/
   - http://localhost:4000/advanced-syntax/
   - http://localhost:4000/obsidian-flavored-markdown/

---

## 7. 已知未做 / 可后续做

按收益排序（历史讨论过的优先级）：

1. ~~统一公式引擎~~（已做）
2. ~~Callout OFM + 任务列表 + display math 规范化~~（已做）
3. 清理无效 `markdown:` 段与未使用依赖
4. Mermaid 开关与主题配置
5. `%%注释%%` 构建期剥离
6. 双链增强：按 title 索引、失败态样式、`![[图]]`
7. 图片相对路径 / 附件同步约定
8. 将 KaTeX / callout CSS 注入尽量主题无关化（减少迁主题步骤）

---

## 8. 给 Agent 的快速检查表

用户反馈「md 在博客里不对」时：

1. 是否 **Obsidian 扩展语法**？查 §3 表。
2. 插件是否写在 **`markdown_it_plus`**？
3. 公式：是否有 **KaTeX CSS**？是否夹在句中 `$$`？看 `normalize-display-math.js` 与 §5。
4. Callout：是否 **`+`/`-`** 与插件是否为 **obsidian-callouts**？CSS 是否被 inject？
5. 链接点击变下载：permalink 是否缺 **`/`**？
6. 双链：目标是否已发布、文件名是否一致？
7. 刚换主题？查 §5 验收清单（多半是 CSS 未重接）。

本地：`npm run server` 或 `npx hexo generate && npx hexo server`。
