---
title: PnP-Flow
author: Spa-Master
date: 2026-07-31 10:58:00
updated: 2026-07-31 10:58:00
tags: []
---

## 最大似然估计器


$$\arg\max_{x \in \mathbb{R}^d} \{\log p_{X\vert{}Y=y}(x)\} = \arg\max_{x \in \mathbb{R}^d} \{\log p_{Y\vert{}X=x}(y) + \log p_X(x)\}$$
后验概率 $p_{X\vert{}Y=y}(x)$ 表示在已知观测 $y$ 的情况下，原始分布为 $x$ 的概率。
套用贝叶斯公式：
$$p_{X\vert{}Y=y}(x) = \frac{p_{Y\vert{}X=x}(y) \cdot p_X(x)}{p_Y(y)}$$
两边取对数后
$$\log p_{X\vert{}Y=y}(x) = \log p_{Y\vert{}X=x}(y) + \log p_X(x) - \log p_Y(y)$$
由于搜索器搜索的是 x 的解，$\log p_Y(y)$ 可以看作是常数，不用写进最终的优化目标中。

由于实际问题中真实的图像分布 $p_X(x)$ 无法写出精确的数学表达式，而且在优化问题中更倾向于求解最小值，因此 MAP 搜索器在实际工作时会转化为能量最小化问题：
$$\arg\min_{x \in \mathbb{R}^d} \{F(x) + R(x)\}$$
其中：
- $F(x) := -\log p_{Y\vert{}X=x}(y)$ (数据保真项) 。如果假设加性噪声 $\xi$ 是高斯噪声 $\mathcal{N}(0, \sigma^2 I_d)$，那么这一项就可以写成最小二乘的形式 $F(x) = \frac{1}{2\sigma^2}\Vert{}Hx - y\Vert{}^2$。
- **$R(x)$ (正则化项/先验)：** 取代了原来的 $-\log p_X(x)$，用于约束解的空间，确保存在唯一的最小值。

## PnP

针对上面的能量最小化问题，由于 $F(x)$ 容易有明确的表达式，而 $R(x)$ 很难用数学公式定义，引入一个辅助变量 $v$，进行交替优化。

$$\arg\min_{x,v} \left\{ F(x) + R(v) + \frac{\lambda}{2} \Vert{}x - v\Vert{}^2 \right\}$$
正则项惩罚 $v$ 与 $x$ 的偏差。

### 更新 $x$
$$x_{k+1} = \arg\min_{x} \left\{ F(x) + \frac{\lambda}{2} \Vert{}x - v_k\Vert{}^2 \right\}$$
与 $R(x)$ 解耦后，不涉及 ODE 问题，直接反向传播更新。

> [!note]-
> 如果不使用交替优化，x 的更新公式中就会包含 $R(x)$。而 $R(X)$ 依赖 ODE 求解，反向传播更新 x 的过程中梯度会穿过 ODE 求解器，导致灾难性的数值问题。
### 更新 $v$
$$v_{k+1} = \arg\min_{v} \left\{ \frac{\lambda}{2} \Vert{}x_{k+1} - v\Vert{}^2 + R(v) \right\}$$
这一步等价于

> 已知一张带有方差为 $1/\lambda$ 高斯噪声的图像 $x_{k+1}$，求它去噪后的干净图像 $v$。

于是 $R(x)$ 可以直接换成现有的去噪器，比如 BM3D,Unet,FlowMatching。这一步便被称为即插即用。

原本

每一次迭代，$x$ 负责逼近物理观测，$v$（去噪器）负责把逼近过程中产生的伪影和噪声抹平。两者交替上升，最终收敛到完美的高清图像。
