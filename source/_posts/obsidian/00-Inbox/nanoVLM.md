---
author: Spa-Master
date: 2026-07-09 14:59:00
updated: 2026-11-27 00:53:39
description: nanoVLM的学习记录
permalink: nanoVLM
tags:
- 机器学习
title: nanoVLM
---

### Attention

Token embedding 后，进入 Self Attention 计算注意力。三个权重矩阵 `Wq` `Wk` `Wv` 是可以学习的参数，同一个注意力头共用一套权重矩阵。

首先进行投影，$X \cdot W_q$, $X \cdot W_k$, $X \cdot W_v$ 称为 QKV 投影，由于注意力公式中要计算 $Q\cdot K^T$ ，所以 Q 和 K 的 `hidden dim` 一定是相同的，矩阵乘后输出注意力分数，是一个 `[B,S,S]` 形状的矩阵。跟 V 相乘后，再经过线性层，将 V 的 hidden dim 映射到 embed dim 作为 Attention 的最终输出。流程如下图。

![image.png](https://cdn.jsdelivr.net/gh/HRbenY/blog-assets@master//img/20261126212347746.png)

如上介绍的单头注意力计算流程，当采用多头时，将 embed dim 分给不同的注意力头，每个注意力头都各自有一套 QKV 权重，各自可能负责捕捉不同的注意力信息。在输出时先 concact 后，过 linear 层输出成 `[B,S,D]` 大小的语义更新向量。




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

### KV cache

由于采用 casual mask，未来的 kv 不会对历史 q 有影响。据此可以保存历史 k cache 和 v cache，用于新 token 的注意力快速计算。

Decode 阶段，输入一个新 token 时，我们只需要计算新的 token query K 的结果，然后把这个结果与所有 V 相乘得到 Attention 输出。新 token 的 K 和 V 则 append 到 KVcache 末尾，用于下一个 token 的计算。

这样一来，新 token 的计算量就只与序列长度线性相关了。
