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

## 目标函数

$$
L_{FM}​(θ)=E_{t∼U(0,1),x∼p_t}​​[∥ v_θ​(t,x)−u_t​(x)∥^2]
$$
其中 $u_\theta(t,x)$ 是预测速度场，$u_t$ 是真实速度场。由于一般真实速度场没有 close form，不同的算法会假设不同的 $p_t$ 分布。

### CFM

### Score Function

$$s_t(x)=∇_x​\log p_t​(x)$$ 
得分函数就是给分布取对数后求对 x 的导数，可以理解成把点拉向高概率区域。

以高斯分布为例子，高斯分布的概率密度函数为
$$
p(x)=\frac{1}{\sqrt{2 \pi \sigma ^ 2}}\exp (\frac{(x-\mu)^2}{-2\sigma^2})
$$
计算 Score Function 为
$$
s(x)=\frac{x-\mu}{\sigma ^ 2}
$$
所以当 x 大于 $\mu$ 时，x 增大得分下降，x 减小得分升高。形成了将点拉向高概率区域的场。
