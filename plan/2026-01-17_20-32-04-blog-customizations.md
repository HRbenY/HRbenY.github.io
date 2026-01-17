---
mode: plan
cwd: C:\Users\707\hurun\code\Hexo\blog
task: 修改博客（favicon、首页打字机动态内容池、关于页、站点标题）
complexity: complex
planning_method: builtin
created_at: 2026-01-17T20:32:19.7115240+08:00
updated_at: 2026-01-17T20:40:13.8872818+08:00
---

# Plan: 博客定制（favicon / 打字机 / 关于页 / 标题）

## 任务概述

在 Hexo + Fluid 主题下完成 4 项改动：

1) 使用根目录 `mai.png` 作为标签页图标（favicon / apple touch icon），并放到合适的静态资源位置；
2) 改造首页打字机文案为“内容池”随机输出：访客天气（仅 IP 定位）、每日一词、我的状态；若 IP 定位失败或天气抓取失败则不展示天气并回退到其他来源；同时提供可扩展接口，后续可继续增加内容来源；
3) 完成关于页：头像 `mai.png` + GitHub / 微信 / 邮箱，均为可点击图标超链接；
4) 站点左上角标题从“HRbenY 的博客”改为“Spa-Master 的博客”。

## 执行计划

1. 盘点现状与改动入口
   - 确认站点/主题实际生效配置：`_config.yml`、`_config.fluid.yml`。
   - 定位 Fluid 打字机入口与加载顺序（模板/脚本），确保改动只接管首页分支，避免影响其他页面。

2. 处理静态资源：`mai.png` 的归位与 favicon 配置
   - 将根目录 `mai.png` 放入 `source/img/mai.png`，确保最终访问路径为 `/img/mai.png`。
   - 修改 `_config.fluid.yml`：`favicon`、`apple_touch_icon` 指向 `/img/mai.png`。

3. 让根目录 JSON 对浏览器可访问（words/status）
   - 新增 Hexo `scripts/` generator：将根目录 `words.json`、`status.json` 复制/生成到 `public/`（例如 `/words.json`、`/status.json`），保证“数据源仍在根目录”且前端可 `fetch`。
   - 定义读取约定：
     - `words.json`：数组元素 `{ word, meaning }`。
     - `status.json`：兼容 `{ text: string }` 与 `{ texts: string[] }`（优先 `texts`，便于随机与扩展）。

4. 设计首页“内容池”可扩展 Provider 接口（重点）
   - 定义 Provider 协议（建议最小字段）：
     - `id: string`
     - `enable: boolean`
     - `timeout_ms: number`
     - `weight?: number`（可选，用于抽样偏好）
     - `get_texts(ctx): Promise<string[]>`（失败/不适用返回 `[]`，不抛出到外层）
   - 设计内容池聚合器：
     - 并发执行启用的 Providers（含超时与失败隔离），将返回的 texts 扁平化加入 pool。
     - 抽样策略：默认等概率从 pool 抽 1 条；后续可扩展为按 `weight`/按 Provider 轮转。
   - 可配置与扩展方式：
     - 在 `_config.fluid.yml` 新增一个自定义配置段（例如 `index.slogan.dynamic_pool`）控制 enable、providers 列表、超时/缓存等。
     - 新增来源时只增加一个 Provider 文件并在配置中启用，不需要改动聚合器代码。

5. Provider 实现：访客天气（仅 IP 定位；失败不展示）
   - 仅使用 IP 定位服务获取粗略经纬度（不使用 `navigator.geolocation`，避免权限弹窗）。
   - IP 定位失败：直接返回 `[]`（不展示任何天气文案）。
   - 获取天气：调用 Open‑Meteo Forecast API（current 温度/天气码/风向），映射为中文描述后输出文案（仅示意：`当地天气：12°C 多云 东北风`）。
   - 天气抓取失败：直接返回 `[]`（不展示任何天气文案），由内容池回退到其他 Provider。
   - 缓存建议：天气 Provider 单独缓存（`localStorage` + TTL 10–30 分钟）以减少请求；缓存失效再请求。

6. Provider 实现：每日一词（words.json）
   - 每次刷新页面从 `/words.json` 随机抽取一个 `{ word, meaning }` 组合成文案（如 `今日一词：Equanimity（平常心；镇定）`）。
   - 失败（JSON 不可读/格式不对）：返回 `[]`，不影响其他 Provider。

7. Provider 实现：我的状态（status.json）
   - 每次进入首页触发更新：从 `/status.json` 的 `texts[]`（或 `text`）中随机取一条作为候选文案。
   - 失败：返回 `[]`。

8. 接管 Fluid 首页打字机初始化（只改首页，调用原 typing）
   - 修改 `themes/fluid/layout/_partials/plugins/typed.ejs`：
     - 仅在 `is_home()` 分支：调用“内容池聚合器”拿到最终文本后 `Fluid.plugins.typing(text)`。
     - 非首页逻辑保持不变。
   - 将聚合器与 Providers 放入独立 JS（通过 `_config.fluid.yml:custom_js` 注入），避免把大量逻辑写进模板，并保证加载顺序在 `typed.ejs` 之前或在其内部先加载后调用。

9. 完善关于页（头像 + 可点击图标链接）
   - 更新 `_config.fluid.yml:about`：
     - `avatar: /img/mai.png`
     - `name: "Spa-Master"`
     - `icons`：
       - GitHub：链接到你的 GitHub 主页（按 “HRbenY@github.com” 推断为 `https://github.com/HRbenY`，如不一致则修正为真实主页链接）。
       - 微信：提供可点击链接（可选 `weixin://` scheme；若兼容性考虑可用 `tel:15272660320` 作为点击行为，并在 tip 展示微信号）。
       - 邮箱：`mailto:hrcharck@gmail.com`
   - 更新 `source/about/index.md`：补充介绍文本（可简短），避免只显示占位内容。

10. 更新站点标题与回归验证
   - 修改 `_config.yml:title` 为 `Spa-Master 的博客`。
   - 验证：`npx hexo clean && npx hexo g && npx hexo s`；检查 favicon 生效、首页打字机每次进入更新且失败时不展示天气、关于页图标可点击、站点标题更新。

## 风险与注意事项

- IP 定位服务依赖：可能在某些网络不可用/限流；必须可配置、超时可控、失败返回 `[]` 并保证页面无报错。
- Open‑Meteo 网络波动：天气 Provider 必须“失败不入池”，避免输出半成品文案。
- 可扩展接口稳定性：Provider 协议一旦确定尽量保持向后兼容（新增字段不破坏旧 Provider）。
- JSON 发布路径：根目录 JSON 默认不会发布为静态资源，必须通过 generator 或复制进 `source/`，否则前端无法 `fetch`。

## 参考

- `_config.yml:6`（站点标题）
- `_config.fluid.yml:21`（favicon）
- `_config.fluid.yml:85`（打字机开关）
- `_config.fluid.yml:499`（首页 slogan 配置）
- `_config.fluid.yml:981`（关于页配置）
- `themes/fluid/layout/_partials/plugins/typed.ejs:1`（打字机入口）
- `themes/fluid/source/js/plugins.js:11`（`Fluid.plugins.typing`）
- `source/about/index.md:1`（关于页源文件）
