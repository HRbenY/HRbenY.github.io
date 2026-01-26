# Butterfly 主题配置指南（_config.butterfly.yml）

适用文件：`_config.butterfly.yml`。本文按配置文件原有章节划分，逐项覆盖所有参数，给出用途与常见取值。

通用约定
- 路径：以 `/img/...` 开头的路径对应 `source/img/...`
- 开关：`true/false`，留空通常表示不启用或使用默认值
- 结构：嵌套参数用 `父.子` 表示

## 导航与菜单

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `nav` | object | 导航栏分组（以下为子项）。 |
| `nav.logo` | string | 导航栏 logo 图片路径，留空则不显示。 |
| `nav.display_title` | boolean | 是否显示站点标题。 |
| `nav.display_post_title` | boolean | 在文章页显示文章标题。 |
| `nav.fixed` | boolean | 是否固定导航栏。 |
| `menu` | object | 菜单映射，键为显示名，值格式为 `路径 || 图标类`，支持二级菜单。 |

## 代码块

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `code_blocks` | object | 代码块设置分组。 |
| `code_blocks.theme` | string/false | 主题：`darker`/`pale night`/`light`/`ocean`/`false`。 |
| `code_blocks.macStyle` | boolean | 是否使用 mac 风格窗口样式。 |
| `code_blocks.height_limit` | number/false | 代码块高度限制（px），`false` 为不限制。 |
| `code_blocks.word_wrap` | boolean | 是否自动换行。 |
| `code_blocks.copy` | boolean | 是否显示复制按钮。 |
| `code_blocks.language` | boolean | 是否显示语言标签。 |
| `code_blocks.shrink` | boolean/none | 是否默认折叠代码块；`none` 为展开且隐藏按钮。 |
| `code_blocks.fullpage` | boolean | 是否允许全屏显示。 |

## 社交链接

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `social` | object | 社交链接映射：`icon: url || 文案 || 颜色`。 |

## 站点图标与头像

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `favicon` | string | 站点 favicon 路径。 |
| `avatar` | object | 头像分组。 |
| `avatar.img` | string | 头像图片路径。 |
| `avatar.effect` | boolean | 头像特效开关。 |

## 头图 / 封面 / 背景 / 404

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `disable_top_img` | boolean | 是否禁用所有页面头图。 |
| `default_top_img` | string | 文章未指定头图时的默认头图。 |
| `index_img` | string | 首页头图。 |
| `archive_img` | string | 归档页头图。 |
| `tag_img` | string | 标签页头图。 |
| `tag_per_img` | list | 按标签设置头图：`- 标签名: /img/...`。 |
| `category_img` | string | 分类页头图。 |
| `category_per_img` | list | 按分类设置头图：`- 分类名: /img/...`。 |
| `footer_img` | string/false | 页脚背景图；`false` 关闭。 |
| `background` | string/array | 站点背景，支持颜色、图片或数组随机。 |
| `cover` | object | 首页卡片封面分组。 |
| `cover.index_enable` | boolean | 首页是否启用封面。 |
| `cover.aside_enable` | boolean | 侧边栏是否启用封面。 |
| `cover.archives_enable` | boolean | 归档页是否启用封面。 |
| `cover.default_cover` | list | 默认封面列表，未指定时随机。 |
| `error_img` | object | 404/友链等错误图片设置分组。 |
| `error_img.flink` | string | 友链缺失图片。 |
| `error_img.post_page` | string | 文章页缺失图片。 |
| `error_404` | object | 简易 404 页面分组。 |
| `error_404.enable` | boolean | 是否启用主题自带 404。 |
| `error_404.subtitle` | string | 404 副标题。 |
| `error_404.background` | string | 404 背景图。 |

## 文章元信息

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `post_meta` | object | 文章/页面元信息分组。 |
| `post_meta.page` | object | 页面元信息分组。 |
| `post_meta.page.date_type` | string | `created`/`updated`/`both`。 |
| `post_meta.page.date_format` | string | `date`/`relative`。 |
| `post_meta.page.categories` | boolean | 是否显示分类。 |
| `post_meta.page.tags` | boolean | 是否显示标签。 |
| `post_meta.page.label` | boolean | 是否显示标签图标/文本。 |
| `post_meta.post` | object | 文章元信息分组。 |
| `post_meta.post.position` | string | `left`/`center`。 |
| `post_meta.post.date_type` | string | `created`/`updated`/`both`。 |
| `post_meta.post.date_format` | string | `date`/`relative`。 |
| `post_meta.post.categories` | boolean | 是否显示分类。 |
| `post_meta.post.tags` | boolean | 是否显示标签。 |
| `post_meta.post.label` | boolean | 是否显示标签图标/文本。 |

## 首页设置

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `index_site_info_top` | string | 首页站点信息位置（如 `300px`/`10%`）。 |
| `index_top_img_height` | string | 首页头图高度（如 `300px`）。 |
| `subtitle` | object | 首页副标题分组。 |
| `subtitle.enable` | boolean | 是否启用副标题。 |
| `subtitle.effect` | boolean | 打字机效果开关。 |
| `subtitle.typed_option` | object | typed.js 配置项。 |
| `subtitle.source` | number/false | 一言来源：`false/1/2/3`。 |
| `subtitle.sub` | list/string | 副标题内容（多行可列表）。 |
| `index_layout` | number | 1~7 布局模式（见主题注释）。 |
| `index_post_content` | object | 首页文章摘要分组。 |
| `index_post_content.method` | number/false | `1/2/3/false`，控制摘要来源。 |
| `index_post_content.length` | number | 摘要长度（method=2/3 时生效）。 |

## 文章页设置

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `toc` | object | 目录分组。 |
| `toc.post` | boolean | 文章页是否显示目录。 |
| `toc.page` | boolean | 页面是否显示目录。 |
| `toc.number` | boolean | 目录是否显示编号。 |
| `toc.expand` | boolean | 目录是否默认展开。 |
| `toc.style_simple` | boolean | 是否使用简洁目录样式。 |
| `toc.scroll_percent` | boolean | 是否显示阅读进度。 |
| `post_copyright` | object | 版权信息分组。 |
| `post_copyright.enable` | boolean | 是否显示版权块。 |
| `post_copyright.decode` | boolean | 是否对复制内容解码。 |
| `post_copyright.author_href` | string | 作者链接。 |
| `post_copyright.license` | string | 版权协议名称。 |
| `post_copyright.license_url` | string | 版权协议链接。 |
| `reward` | object | 赞赏分组。 |
| `reward.enable` | boolean | 是否启用赞赏。 |
| `reward.text` | string | 赞赏提示文案。 |
| `reward.QR_code` | list | 二维码列表：`- img/link/text`。 |
| `post_edit` | object | 文章编辑入口分组。 |
| `post_edit.enable` | boolean | 是否启用“编辑本文”。 |
| `post_edit.url` | string | 编辑链接模板（GitHub 编辑地址）。 |
| `related_post` | object | 相关文章分组。 |
| `related_post.enable` | boolean | 是否显示相关文章。 |
| `related_post.limit` | number | 显示数量。 |
| `related_post.date_type` | string | `created`/`updated`。 |
| `post_pagination` | number/false | 翻页方向：`1/2/false`。 |
| `noticeOutdate` | object | 文章过期提示分组。 |
| `noticeOutdate.enable` | boolean | 是否启用过期提示。 |
| `noticeOutdate.style` | string | `simple`/`flat`。 |
| `noticeOutdate.limit_day` | number | 超过天数才提示。 |
| `noticeOutdate.position` | string | `top`/`bottom`。 |
| `noticeOutdate.message_prev` | string | 前缀文案。 |
| `noticeOutdate.message_next` | string | 后缀文案。 |

## 页脚设置

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `footer` | object | 页脚分组。 |
| `footer.nav` | string/list | 页脚导航（按需设置）。 |
| `footer.owner` | object | 站点所有者信息。 |
| `footer.owner.enable` | boolean | 是否显示年份等信息。 |
| `footer.owner.since` | number | 站点起始年份。 |
| `footer.copyright` | object | 主题版权显示设置。 |
| `footer.copyright.enable` | boolean | 是否显示版权。 |
| `footer.copyright.version` | boolean | 是否显示版本号。 |
| `footer.custom_text` | string | 自定义页脚文本。 |

## 侧边栏

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `aside` | object | 侧边栏分组。 |
| `aside.enable` | boolean | 是否启用侧边栏。 |
| `aside.hide` | boolean | 是否默认隐藏。 |
| `aside.button` | boolean | 是否显示隐藏按钮。 |
| `aside.mobile` | boolean | 移动端是否启用。 |
| `aside.position` | string | `left`/`right`。 |
| `aside.display` | object | 哪些页面显示侧边栏。 |
| `aside.display.archive` | boolean | 归档页显示。 |
| `aside.display.tag` | boolean | 标签页显示。 |
| `aside.display.category` | boolean | 分类页显示。 |
| `aside.card_author` | object | 作者卡片。 |
| `aside.card_author.enable` | boolean | 是否启用作者卡片。 |
| `aside.card_author.description` | string | 作者描述。 |
| `aside.card_author.button` | object | 作者卡片按钮。 |
| `aside.card_author.button.enable` | boolean | 是否显示按钮。 |
| `aside.card_author.button.icon` | string | 按钮图标类。 |
| `aside.card_author.button.text` | string | 按钮文字。 |
| `aside.card_author.button.link` | string | 按钮链接。 |
| `aside.card_announcement` | object | 公告卡片。 |
| `aside.card_announcement.enable` | boolean | 是否启用公告。 |
| `aside.card_announcement.content` | string | 公告内容。 |
| `aside.card_recent_post` | object | 最近文章卡片。 |
| `aside.card_recent_post.enable` | boolean | 是否启用。 |
| `aside.card_recent_post.limit` | number | 显示数量。 |
| `aside.card_recent_post.sort` | string | `date`/`updated`。 |
| `aside.card_recent_post.sort_order` | string | 排序方式。 |
| `aside.card_newest_comments` | object | 最新评论卡片。 |
| `aside.card_newest_comments.enable` | boolean | 是否启用。 |
| `aside.card_newest_comments.sort_order` | string | 排序方式。 |
| `aside.card_newest_comments.limit` | number | 显示数量。 |
| `aside.card_newest_comments.storage` | number | 本地缓存分钟数。 |
| `aside.card_newest_comments.avatar` | boolean | 是否显示头像。 |
| `aside.card_categories` | object | 分类卡片。 |
| `aside.card_categories.enable` | boolean | 是否启用。 |
| `aside.card_categories.limit` | number | 显示数量（0 为全部）。 |
| `aside.card_categories.expand` | string | `none/true/false`。 |
| `aside.card_categories.sort_order` | string | 排序方式。 |
| `aside.card_tags` | object | 标签卡片。 |
| `aside.card_tags.enable` | boolean | 是否启用。 |
| `aside.card_tags.limit` | number | 显示数量（0 为全部）。 |
| `aside.card_tags.color` | boolean | 是否彩色标签。 |
| `aside.card_tags.orderby` | string | `random/name/length`。 |
| `aside.card_tags.order` | number | `1` 升序，`-1` 降序。 |
| `aside.card_tags.sort_order` | string | 排序方式。 |
| `aside.card_archives` | object | 归档卡片。 |
| `aside.card_archives.enable` | boolean | 是否启用。 |
| `aside.card_archives.type` | string | `monthly/yearly`。 |
| `aside.card_archives.format` | string | 日期格式（如 `YYYY年MM月`）。 |
| `aside.card_archives.order` | number | `1` 升序，`-1` 降序。 |
| `aside.card_archives.limit` | number | 显示数量（0 为全部）。 |
| `aside.card_archives.sort_order` | string | 排序方式。 |
| `aside.card_post_series` | object | 系列文章卡片。 |
| `aside.card_post_series.enable` | boolean | 是否启用。 |
| `aside.card_post_series.series_title` | boolean | 是否用系列名做标题。 |
| `aside.card_post_series.orderBy` | string | `title`/`date`。 |
| `aside.card_post_series.order` | number | `1` 升序，`-1` 降序。 |
| `aside.card_webinfo` | object | 站点信息卡片。 |
| `aside.card_webinfo.enable` | boolean | 是否启用。 |
| `aside.card_webinfo.post_count` | boolean | 是否显示文章数。 |
| `aside.card_webinfo.last_push_date` | boolean | 是否显示最近更新。 |
| `aside.card_webinfo.sort_order` | string | 排序方式。 |
| `aside.card_webinfo.runtime_date` | string | 建站时间（用于运行时长）。 |

## 右下角按钮

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `rightside_bottom` | string/number | 右下角按钮距离底部（px）。 |
| `translate` | object | 简繁转换分组。 |
| `translate.enable` | boolean | 是否启用简繁切换。 |
| `translate.default` | string | 按钮文字（默认）。 |
| `translate.defaultEncoding` | number | `1` 繁体，`2` 简体。 |
| `translate.translateDelay` | number | 切换延迟（ms）。 |
| `translate.msgToTraditionalChinese` | string | 简体时显示的“切换为繁体”文本。 |
| `translate.msgToSimplifiedChinese` | string | 繁体时显示的“切换为简体”文本。 |
| `readmode` | boolean | 是否启用阅读模式按钮。 |
| `darkmode` | object | 深色模式分组。 |
| `darkmode.enable` | boolean | 是否启用深色模式。 |
| `darkmode.button` | boolean | 是否显示切换按钮。 |
| `darkmode.autoChangeMode` | number/false | `1/2/false` 自动切换策略。 |
| `darkmode.start` | number | 自动切换的起始小时。 |
| `darkmode.end` | number | 自动切换的结束小时。 |
| `rightside_scroll_percent` | boolean | 顶部按钮显示滚动进度。 |
| `rightside_item_order` | object | 右下按钮显示/隐藏顺序。 |
| `rightside_item_order.enable` | boolean | 是否启用自定义顺序。 |
| `rightside_item_order.hide` | list | 默认隐藏项列表。 |
| `rightside_item_order.show` | list | 默认显示项列表。 |
| `rightside_config_animation` | boolean | 配置按钮动画开关。 |

## 全局设置

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `anchor` | object | 锚点行为设置。 |
| `anchor.auto_update` | boolean | 滚动时是否更新 URL 锚点。 |
| `anchor.click_to_scroll` | boolean | 点击标题是否滚动到锚点。 |
| `photofigcaption` | boolean | 是否显示图片 figcaption。 |
| `copy` | object | 复制行为设置。 |
| `copy.enable` | boolean | 是否启用复制提示。 |
| `copy.copyright` | object | 复制附加版权信息设置。 |
| `copy.copyright.enable` | boolean | 是否追加版权信息。 |
| `copy.copyright.limit_count` | number | 超过字数才追加。 |
| `wordcount` | object | 字数统计分组（需插件）。 |
| `wordcount.enable` | boolean | 是否启用。 |
| `wordcount.post_wordcount` | boolean | 文章元信息显示字数。 |
| `wordcount.min2read` | boolean | 文章元信息显示阅读时长。 |
| `wordcount.total_wordcount` | boolean | 侧边栏显示总字数。 |
| `busuanzi` | object | 不蒜子统计分组。 |
| `busuanzi.site_uv` | boolean | 是否显示站点 UV。 |
| `busuanzi.site_pv` | boolean | 是否显示站点 PV。 |
| `busuanzi.page_pv` | boolean | 是否显示页面 PV。 |

## 数学公式

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `math` | object | 数学渲染分组。 |
| `math.use` | string | `mathjax`/`katex`/空。 |
| `math.per_page` | boolean | 是否对所有页面加载数学脚本。 |
| `math.hide_scrollbar` | boolean | 隐藏公式横向滚动条。 |
| `math.mathjax` | object | MathJax 配置分组。 |
| `math.mathjax.enableMenu` | boolean | 是否启用右键菜单。 |
| `math.mathjax.tags` | string | `all/ams/none` 公式编号策略。 |
| `math.katex` | object | KaTeX 配置分组。 |
| `math.katex.copy_tex` | boolean | 是否启用 KaTeX 复制。 |

## 搜索

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `search` | object | 搜索分组。 |
| `search.use` | string | `algolia_search`/`local_search`/`docsearch`。 |
| `search.placeholder` | string | 搜索框提示文案。 |
| `search.algolia_search` | object | Algolia 配置分组。 |
| `search.algolia_search.hitsPerPage` | number | 每页结果数。 |
| `search.local_search` | object | 本地搜索配置分组。 |
| `search.local_search.preload` | boolean | 是否预加载索引。 |
| `search.local_search.top_n_per_article` | number | 每篇文章显示前 N 条。 |
| `search.local_search.unescape` | boolean | 反转义 HTML。 |
| `search.local_search.pagination` | object | 分页设置。 |
| `search.local_search.pagination.enable` | boolean | 是否启用分页。 |
| `search.local_search.pagination.hitsPerPage` | number | 分页大小。 |
| `search.local_search.CDN` | string | 本地搜索 CDN（可留空）。 |
| `search.docsearch` | object | Docsearch 配置分组。 |
| `search.docsearch.appId` | string | Algolia App ID。 |
| `search.docsearch.apiKey` | string | API Key。 |
| `search.docsearch.indexName` | string | 索引名。 |
| `search.docsearch.option` | object | 额外配置。 |

## 分享

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `share` | object | 分享组件分组。 |
| `share.use` | string | `sharejs`/`addtoany`/空。 |
| `share.sharejs` | object | Share.js 配置分组。 |
| `share.sharejs.sites` | string | 站点列表，逗号分隔。 |
| `share.addtoany` | object | AddToAny 配置分组。 |
| `share.addtoany.item` | string | 按钮列表，逗号分隔。 |

## 评论系统

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `comments` | object | 评论分组。 |
| `comments.use` | string | 可用项：Disqus/Disqusjs/Livere/Gitalk/Valine/Waline/Utterances/Facebook Comments/Twikoo/Giscus/Remark42/Artalk（可两种，用逗号分隔）。 |
| `comments.text` | boolean | 评论按钮显示名称。 |
| `comments.lazyload` | boolean | 懒加载评论。 |
| `comments.count` | boolean | 文章头图显示评论数。 |
| `comments.card_post_count` | boolean | 首页卡片显示评论数。 |
| `disqus` | object | Disqus 配置分组。 |
| `disqus.shortname` | string | Disqus shortname。 |
| `disqus.apikey` | string | 用于最新评论小组件。 |
| `disqusjs` | object | DisqusJS 配置分组。 |
| `disqusjs.shortname` | string | Disqus shortname。 |
| `disqusjs.apikey` | string | Disqus API Key。 |
| `disqusjs.option` | object | DisqusJS 额外配置。 |
| `livere` | object | Livere 配置分组。 |
| `livere.uid` | string | Livere UID。 |
| `gitalk` | object | Gitalk 配置分组。 |
| `gitalk.client_id` | string | Gitalk Client ID。 |
| `gitalk.client_secret` | string | Gitalk Client Secret。 |
| `gitalk.repo` | string | GitHub 仓库名。 |
| `gitalk.owner` | string | 仓库所有者。 |
| `gitalk.admin` | list | 管理员列表。 |
| `gitalk.option` | object | Gitalk 额外配置。 |
| `valine` | object | Valine 配置分组。 |
| `valine.appId` | string | LeanCloud App ID。 |
| `valine.appKey` | string | LeanCloud App Key。 |
| `valine.avatar` | string | 头像风格。 |
| `valine.serverURLs` | string | 自定义服务器地址。 |
| `valine.bg` | string | 背景图。 |
| `valine.visitor` | boolean | 使用 Valine 统计 PV。 |
| `valine.option` | object | Valine 额外配置。 |
| `waline` | object | Waline 配置分组。 |
| `waline.serverURL` | string | Waline 服务地址。 |
| `waline.bg` | string | 背景图。 |
| `waline.pageview` | boolean | 使用 Waline 统计 PV。 |
| `waline.option` | object | Waline 额外配置。 |
| `utterances` | object | Utterances 配置分组。 |
| `utterances.repo` | string | GitHub 仓库（owner/repo）。 |
| `utterances.issue_term` | string | 关联规则（pathname/title 等）。 |
| `utterances.light_theme` | string | 亮色主题。 |
| `utterances.dark_theme` | string | 暗色主题。 |
| `utterances.js` | string | 自定义脚本地址。 |
| `utterances.option` | object | 额外配置。 |
| `facebook_comments` | object | Facebook 评论配置分组。 |
| `facebook_comments.app_id` | string | App ID。 |
| `facebook_comments.user_id` | string | 用户 ID（可选）。 |
| `facebook_comments.pageSize` | number | 每页数量。 |
| `facebook_comments.order_by` | string | `social/time/reverse_time`。 |
| `facebook_comments.lang` | string | 语言，如 `en_US`。 |
| `twikoo` | object | Twikoo 配置分组。 |
| `twikoo.envId` | string | 环境 ID。 |
| `twikoo.region` | string | 地域。 |
| `twikoo.visitor` | boolean | 使用 Twikoo 统计 PV。 |
| `twikoo.option` | object | 额外配置。 |
| `giscus` | object | Giscus 配置分组。 |
| `giscus.repo` | string | 仓库（owner/repo）。 |
| `giscus.repo_id` | string | Repo ID。 |
| `giscus.category_id` | string | Category ID。 |
| `giscus.light_theme` | string | 亮色主题。 |
| `giscus.dark_theme` | string | 暗色主题。 |
| `giscus.js` | string | 自定义脚本地址。 |
| `giscus.option` | object | 额外配置。 |
| `remark42` | object | Remark42 配置分组。 |
| `remark42.host` | string | 服务地址。 |
| `remark42.siteId` | string | Site ID。 |
| `remark42.option` | object | 额外配置。 |
| `artalk` | object | Artalk 配置分组。 |
| `artalk.server` | string | 服务地址。 |
| `artalk.site` | string | 站点标识。 |
| `artalk.visitor` | boolean | 使用 Artalk 统计 PV。 |
| `artalk.option` | object | 额外配置。 |

## 聊天服务

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `chat` | object | 聊天分组。 |
| `chat.use` | string | `chatra`/`tidio`/`crisp`/空。 |
| `chat.rightside_button` | boolean | 右下角聊天按钮。 |
| `chat.button_hide_show` | boolean | 上滑显示、下滑隐藏按钮。 |
| `chatra` | object | Chatra 配置分组。 |
| `chatra.id` | string | Chatra ID。 |
| `tidio` | object | Tidio 配置分组。 |
| `tidio.public_key` | string | Public Key。 |
| `crisp` | object | Crisp 配置分组。 |
| `crisp.website_id` | string | Website ID。 |

## 统计分析

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `baidu_analytics` | string | 百度统计 ID。 |
| `google_analytics` | string | GA 统计 ID。 |
| `cloudflare_analytics` | string | Cloudflare Web Analytics ID。 |
| `microsoft_clarity` | string | Clarity ID。 |
| `umami_analytics` | object | Umami 分组。 |
| `umami_analytics.enable` | boolean | 启用 Umami。 |
| `umami_analytics.serverURL` | string | 自建 Umami 地址。 |
| `umami_analytics.script_name` | string | 脚本名，默认 `script.js`。 |
| `umami_analytics.website_id` | string | Website ID。 |
| `umami_analytics.option` | object | 额外配置。 |
| `umami_analytics.UV_PV` | object | Umami PV/UV 显示分组。 |
| `umami_analytics.UV_PV.site_uv` | boolean | 站点 UV。 |
| `umami_analytics.UV_PV.site_pv` | boolean | 站点 PV。 |
| `umami_analytics.UV_PV.page_pv` | boolean | 页面 PV。 |
| `umami_analytics.UV_PV.token` | string | API Key/Token。 |
| `google_tag_manager` | object | GTM 分组。 |
| `google_tag_manager.tag_id` | string | GTM Tag ID。 |
| `google_tag_manager.domain` | string | 域名（可选）。 |

## 广告

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `google_adsense` | object | Adsense 分组。 |
| `google_adsense.enable` | boolean | 是否启用。 |
| `google_adsense.auto_ads` | boolean | 自动广告。 |
| `google_adsense.js` | string | Adsense 脚本地址。 |
| `google_adsense.client` | string | 客户端 ID。 |
| `google_adsense.enable_page_level_ads` | boolean | 是否启用页级广告。 |
| `ad` | object | 手动插入广告分组。 |
| `ad.index` | string | 首页广告（每三篇插入）。 |
| `ad.aside` | string | 侧边栏广告。 |
| `ad.post` | string | 文章页广告（翻页前）。 |

## 站点验证

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `site_verification` | list | 站点验证列表：`name` 与 `content`。 |

## 外观与美化

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `category_ui` | string | 分类页 UI：`index/default`/空。 |
| `tag_ui` | string | 标签页 UI：`index/default`/空。 |
| `rounded_corners_ui` | boolean | 是否启用圆角。 |
| `text_align_justify` | boolean | 是否两端对齐。 |
| `mask` | object | 顶部/底部遮罩。 |
| `mask.header` | boolean | 顶部遮罩开关。 |
| `mask.footer` | boolean | 底部遮罩开关。 |
| `preloader` | object | 加载动画分组。 |
| `preloader.enable` | boolean | 是否启用。 |
| `preloader.source` | number | `1`/`2`，动画来源。 |
| `preloader.pace_css_url` | string | Pace 主题 CSS 地址。 |
| `enter_transitions` | boolean | 页面切换动画。 |
| `display_mode` | string | 默认模式：`light/dark`。 |
| `beautify` | object | 内容美化分组。 |
| `beautify.enable` | boolean | 是否启用。 |
| `beautify.field` | string | 作用范围：`site`/`post`。 |
| `beautify.title_prefix_icon` | string | 标题前缀图标（Font Awesome）。 |
| `beautify.title_prefix_icon_color` | string | 图标颜色（如 `#F47466`）。 |
| `font` | object | 全局字体分组。 |
| `font.global_font_size` | string | 全局字号。 |
| `font.code_font_size` | string | 代码字号。 |
| `font.font_family` | string | 正文字体。 |
| `font.code_font_family` | string | 代码字体。 |
| `blog_title_font` | object | 标题字体分组。 |
| `blog_title_font.font_link` | string | 字体链接（@import）。 |
| `blog_title_font.font_family` | string | 标题字体名。 |
| `hr_icon` | object | 分割线图标分组。 |
| `hr_icon.enable` | boolean | 是否启用。 |
| `hr_icon.icon` | string | Font Awesome unicode。 |
| `hr_icon.icon_top` | string | 图标上移距离。 |
| `activate_power_mode` | object | 打字机特效分组。 |
| `activate_power_mode.enable` | boolean | 是否启用。 |
| `activate_power_mode.colorful` | boolean | 是否彩色。 |
| `activate_power_mode.shake` | boolean | 是否抖动。 |
| `activate_power_mode.mobile` | boolean | 移动端是否启用。 |

## 背景特效

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `canvas_ribbon` | object | 彩带背景分组。 |
| `canvas_ribbon.enable` | boolean | 是否启用。 |
| `canvas_ribbon.size` | number | 彩带尺寸。 |
| `canvas_ribbon.alpha` | number | 透明度（0~1）。 |
| `canvas_ribbon.zIndex` | number | 层级。 |
| `canvas_ribbon.click_to_change` | boolean | 点击切换颜色。 |
| `canvas_ribbon.mobile` | boolean | 移动端是否启用。 |
| `canvas_fluttering_ribbon` | object | 飘带背景分组。 |
| `canvas_fluttering_ribbon.enable` | boolean | 是否启用。 |
| `canvas_fluttering_ribbon.mobile` | boolean | 移动端是否启用。 |
| `canvas_nest` | object | 粒子连线背景分组。 |
| `canvas_nest.enable` | boolean | 是否启用。 |
| `canvas_nest.color` | string | 线条颜色 RGB（如 `0,0,255`）。 |
| `canvas_nest.opacity` | number | 线条透明度。 |
| `canvas_nest.zIndex` | number | 层级。 |
| `canvas_nest.count` | number | 线条数量。 |
| `canvas_nest.mobile` | boolean | 移动端是否启用。 |
| `fireworks` | object | 点击烟花特效分组。 |
| `fireworks.enable` | boolean | 是否启用。 |
| `fireworks.zIndex` | number | 层级。 |
| `fireworks.mobile` | boolean | 移动端是否启用。 |
| `click_heart` | object | 点击爱心特效分组。 |
| `click_heart.enable` | boolean | 是否启用。 |
| `click_heart.mobile` | boolean | 移动端是否启用。 |
| `clickShowText` | object | 点击文字特效分组。 |
| `clickShowText.enable` | boolean | 是否启用。 |
| `clickShowText.text` | list | 文字列表（随机或顺序）。 |
| `clickShowText.fontSize` | string | 字号（如 `15px`）。 |
| `clickShowText.random` | boolean | 是否随机显示。 |
| `clickShowText.mobile` | boolean | 移动端是否启用。 |

## 图片灯箱

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `lightbox` | string | `fancybox`/`medium_zoom`/空。 |

## 标签插件

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `series` | object | 系列文章标签分组。 |
| `series.enable` | boolean | 是否启用。 |
| `series.orderBy` | string | `title`/`date`。 |
| `series.order` | number | `1` 升序，`-1` 降序。 |
| `series.number` | boolean | 是否显示序号。 |
| `abcjs` | object | ABCJS 分组。 |
| `abcjs.enable` | boolean | 是否启用。 |
| `abcjs.per_page` | boolean | 是否全局加载。 |
| `mermaid` | object | Mermaid 分组。 |
| `mermaid.enable` | boolean | 是否启用。 |
| `mermaid.code_write` | boolean | 是否使用代码块写法。 |
| `mermaid.theme` | object | Mermaid 主题分组。 |
| `mermaid.theme.light` | string | 亮色主题。 |
| `mermaid.theme.dark` | string | 暗色主题。 |
| `chartjs` | object | Chart.js 分组。 |
| `chartjs.enable` | boolean | 是否启用。 |
| `chartjs.fontColor` | object | 字体颜色分组。 |
| `chartjs.fontColor.light` | string | 亮色字体颜色。 |
| `chartjs.fontColor.dark` | string | 暗色字体颜色。 |
| `chartjs.borderColor` | object | 边框颜色分组。 |
| `chartjs.borderColor.light` | string | 亮色边框颜色。 |
| `chartjs.borderColor.dark` | string | 暗色边框颜色。 |
| `chartjs.scale_ticks_backdropColor` | object | 刻度背景色分组。 |
| `chartjs.scale_ticks_backdropColor.light` | string | 亮色背景色。 |
| `chartjs.scale_ticks_backdropColor.dark` | string | 暗色背景色。 |
| `note` | object | Note Callout 分组。 |
| `note.style` | string | `simple/modern/flat/disabled`。 |
| `note.icons` | boolean | 是否显示图标。 |
| `note.border_radius` | number | 圆角半径。 |
| `note.light_bg_offset` | number | 背景亮度偏移。 |

## 其他功能

| 参数 | 类型/取值 | 配置说明 |
| --- | --- | --- |
| `pjax` | object | PJAX 分组。 |
| `pjax.enable` | boolean | 是否启用。 |
| `pjax.exclude` | list | 排除页面（如 `/music/`）。 |
| `aplayerInject` | object | APlayer 注入分组。 |
| `aplayerInject.enable` | boolean | 是否启用。 |
| `aplayerInject.per_page` | boolean | 是否全局加载。 |
| `snackbar` | object | Snackbar 提示分组。 |
| `snackbar.enable` | boolean | 是否启用。 |
| `snackbar.position` | string | 位置（如 `bottom-left`）。 |
| `snackbar.bg_light` | string | 亮色背景色。 |
| `snackbar.bg_dark` | string | 暗色背景色。 |
| `instantpage` | boolean | 是否启用 instant.page 预加载。 |
| `lazyload` | object | 图片懒加载分组。 |
| `lazyload.enable` | boolean | 是否启用。 |
| `lazyload.native` | boolean | 使用原生 lazyload。 |
| `lazyload.field` | string | `site`/`post`。 |
| `lazyload.placeholder` | string | 占位图。 |
| `lazyload.blur` | boolean | 是否模糊占位。 |
| `pwa` | object | PWA 分组。 |
| `pwa.enable` | boolean | 是否启用。 |
| `pwa.manifest` | string | manifest 路径。 |
| `pwa.apple_touch_icon` | string | iOS 图标路径。 |
| `pwa.favicon_32_32` | string | 32x32 图标路径。 |
| `pwa.favicon_16_16` | string | 16x16 图标路径。 |
| `pwa.mask_icon` | string | Safari mask 图标路径。 |
| `Open_Graph_meta` | object | Open Graph 元信息分组。 |
| `Open_Graph_meta.enable` | boolean | 是否启用。 |
| `Open_Graph_meta.option` | object | 额外 OG 配置。 |
| `structured_data` | object | 结构化数据分组。 |
| `structured_data.enable` | boolean | 是否启用。 |
| `structured_data.alternate_name` | list | 站点别名列表。 |
| `css_prefix` | boolean | 是否自动添加前缀。 |
| `inject` | object | 注入自定义代码分组。 |
| `inject.head` | list | 注入到 `<head>` 的代码。 |
| `inject.bottom` | list | 注入到 `</body>` 前的代码。 |
| `CDN` | object | CDN 设置分组。 |
| `CDN.internal_provider` | string | 内部资源 CDN（local/jsdelivr/unpkg/cdnjs/custom）。 |
| `CDN.third_party_provider` | string | 第三方资源 CDN。 |
| `CDN.version` | boolean | 是否拼接版本号。 |
| `CDN.custom_format` | string | 自定义 CDN 格式。 |
| `CDN.option` | object | 细粒度 CDN 覆盖项。 |

