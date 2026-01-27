# SPA-Master 的 Hexo 博客仓库

## Workflow

使用Obsidian编写Markdown笔记，同步到github。Obsidian的repo配置了Github Action，当检查到front-matter为published = true的笔记有变化时自动推送这部分笔记到当前仓库的 main 分支。本repo的Action检查到main分支变化
自动`npm run cover:sync && hexo clean && hexo g && hexo s`，构建产物在gh-pages分支上。deploy到hrbeny.github.io的也是gh-pages分支。

## Cover Sync

- 本地测试：`npm run server`（内置 cover sync）
- 手动执行：`npm run cover:sync` 后再跑 `npx hexo s`
- Actions：`npm run build`（已包含 cover sync）
- 字体路径：`assets/fonts/MapleMono-NF-CN-Regular.ttf`
