---
title: Flow matching
author: Spa-Master
date: 2026-07-27 22:42:00
updated: 2026-07-27 22:42:00
tags: []
---

![image.png](https://cdn.jsdelivr.net/gh/HRbenY/blog-assets@master//img/20260727224203927.png)

目的是从已知分布中得到目标分布。上图中 `p0` 是已知分布，`p1` 是目标分布。中间的过程称为 $p_k$ 。各种 FM 方法本质上是在训练速度场的拟合，找出已知分布到目标分布速度场。

将速度场作为学习参数，真实的速度场的生成依赖路径的假设。不同模型有不同的路径假设。
