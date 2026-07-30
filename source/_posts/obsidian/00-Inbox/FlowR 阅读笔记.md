---
title: null
author: Spa-Master
date: 2026-07-30 20:34:00
updated: 2026-07-30 20:34:00
tags: []
---

## 引入

现有的 3-D 重建算法要求密集的 2-D 观测，which is very laborious. 现有的做法是使用 2-D 生成时模型基于稀疏观测生成额外的视角，但是存在 hallucinnations ,inconsistent generation results, and subsequent reconstruction artifacts 问题。

作者希望提出一种算法，能基于很少的视角得到更好的 NVS 结果，并且还能从视角的增多中收益。

## FlowR 架构

包含两个部分，分别是 3DGS 流水线和基于 Flow Matching 的稀疏观测致密化。

![image.png](https://cdn.jsdelivr.net/gh/HRbenY/blog-assets@master//img/20260730212059602.png)


作者打算基于粗糙的渲染图，重建出真实图像，而不是从噪声开始。

## 高斯泼溅

将整个复杂的 3D 场景表示为 $K$ 个 3D 高斯元。记作 $$\mathfrak{g}_k := \{\boldsymbol{\mu}_k, \mathbf{s}_k, \mathbf{q}_k, \alpha_k, \mathbf{c}_k\}$$五个参数分别是 position, scale, rotation, opacity and view-dependent color

本文给出的高斯核函数公式为：

$$\mathfrak{g}_k(\mathbf{p}) := \exp\left(-\frac{1}{2}[\mathbf{p} - \boldsymbol{\mu}_k]^\top \boldsymbol{\Sigma}_k^{-1} [\mathbf{p} - \boldsymbol{\mu}_k]\right)$$
其中
$$\boldsymbol{\Sigma}_k := \mathbf{U}_k \mathrm{diag}(\mathbf{s}_k)^2 \mathbf{U}_k^\top$$
其中 $\mathbf{U}_k$ 是由四元数 $\mathbf{q}_k$ 转换来的旋转矩阵，$\mathbf{s}_k$ 是缩放因子。

不必过多纠结，一般高斯泼溅使用的都是这个核函数。

## Flow Matching

参考 [[Flow matching]]
