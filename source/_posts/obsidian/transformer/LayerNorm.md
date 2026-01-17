---
Author: Spa-Master
日期: 2026年1月17日
tags:
- transformer
- normalization
title: LayerNorm
---

> 并不是BatchNorm简单的交换N和D。
## 前向传播

在前向传播中，LayerNorm的公式就是BatchNorm交换N和D维度。LayerNorm在每个批次内部进行Normalization，而BatchNorm是跨Batch的Norm。导致mean和std_dev稍有不同。
### (1) 均值
$$\mu = \frac{1}{D} \sum_{i=1}^{D} x_i$$

### (2) 方差
$$\sigma^2 = \frac{1}{D} \sum_{i=1}^{D} (x_i - \mu)^2$$

### (3) 标准差 + eps
$$\sigma = \sqrt{\sigma^2 + \varepsilon}$$

### (4) 归一化
$$\hat{x}_i = \frac{x_i - \mu}{\sigma}$$

### (5) 仿射变换（gamma / beta）
$$y_i = \gamma_i \hat{x}_i + \beta_i$$

## 反向传播

- 已知 $$\frac{\partial L}{\partial y_i} = d y_i$$
- 求 $$\frac{\partial L}{\partial x_i},\frac{\partial L}{\partial \gamma_i},\frac{\partial L}{\partial \beta_i}$$
### $\beta$ 
$\beta$ 在y上进行了广播，所以累计y的梯度就行。
$$y_i = \gamma_i \hat{x}_i + \beta_i
\Rightarrow
\frac{\partial L}{\partial \beta_i} = \sum dy_i$$
### $\gamma$ 
简单的乘法
$$\frac{\partial L}{\partial \gamma_i}
= \sum dy_i \cdot \hat{x}_i$$
### dx
传导路径

>x → μ → σ → x̂ → y → L

而$$\hat{x}=\frac{x_i - \mu}{\sigma}$$
其中$\mu$和$\sigma$都依赖于$x_i$，所以$x_i$一共有三条路径。
1. 直接贡献
$$\frac{\partial \hat{x}_i}{\partial x_i}
= \frac{1}{\sigma}$$
2. $\mu$的贡献
$$\mu = \frac{1}{D} \sum_k x_k
\Rightarrow
\frac{\partial \mu}{\partial x_j} = \frac{1}{D}$$
3. $\sigma$的贡献
$$\sigma^2 = \frac{1}{D} \sum_k (x_k - \mu)^2$$
$$\frac{\partial \sigma^2}{\partial x_j}
= \frac{2}{D}(x_j - \mu)$$
$$\sigma = \sqrt{\sigma^2 + \varepsilon}
\Rightarrow
\frac{\partial \sigma}{\partial x_j}
= \frac{x_j - \mu}{D \sigma}$$
- 最终结果
$$\frac{\partial L}{\partial x_i}
=
\frac{1}{D \sigma}
\left(
D \cdot d\hat{x}_i
- \sum_j d\hat{x}_j
- \hat{x}_i \sum_j d\hat{x}_j \hat{x}_j
\right)$$
