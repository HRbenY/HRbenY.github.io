---
author: Spa-Master
date: 2026-07-09 14:59:00
updated: 2026-11-26 18:18:05
description: nanoVLM的学习记录
permalink: nanoVLM
tags:
- 机器学习
title: nanoVLM
---

### Modality Projector

由于 vit 输出维度是 `[N,1024,768]`, 但是语言模型的 Hidden Dimension 是 960。这里存在两个问题：
1. **特征维度不匹配：** 768 需要变成 960。
2. **视觉 Token 太多：** 每个图像块有 1024 个 Token，会增加语言模型的计算量。
Modality Projector 就是负责解决这两个问题的。

#### Pixel shuffle

NanoVLM 的 Pixel Shuffle 实际上是将空间维度上的多个 Token 合并到特征维度上。假设有 4×4 个 Patch，每个 Patch 只有一个特征值，合并因子为 2。合并之前需要使用 16 个图像 token（对应原始的 16 个 patch）。进行 pixel shuffle 后，每 `2x2` 个相邻 token 被合并为一个大 token，这四个 token 的特征维度被 concact。
![image.png](https://cdn.jsdelivr.net/gh/HRbenY/blog-assets@master//img/20261126154151486.png)


| 步骤                     | Tensor Shape      |
| ---------------------- | ----------------- |
| 原始输入                   | `[N,1024,768]`    |
| 恢复二维空间                 | `[N,32,32,768]`   |
| 拆分空间维度                 | `[N,8,4,8,4,768]` |
| `permute(0,1,3,2,4,5)` | `[N,8,8,4,4,768]` |
| 合并局部 Patch             | `[N,64,12288]`    |
注意 permute 步骤，将外层坐标放在一次，每个局部 `4x4` 区域内的特征放在一起，最后通过 reshape 完成 concact 合并。如果不 permute，虽然最终 shape 也是 `[N,64,12288]`，但合并的就不一定是空间上相邻的 4×4 个 Patch。

#### Linear 投影

Pixel Shuffle 完成后，每个视觉 token 有 12288 维，但是语言模型只需要 960 维。所以需要一个线性层进行降维映射。
### 多模态 embedding 融合
