---
title: Adamw
author: Spa-Master
date: '2026-01-17 00:00:00'
updated: '2026-01-17 00:00:00'
tags:
- topic/transformer
- type/note
---

从SGD到Adamw，所有优化器的形式都类似
$$
w \;\leftarrow\; w - \text{lr} \cdot \text{transformed\_grad}
$$
区别只在于`transformed_grad` 是如何由原始梯度 `grad` 得到的。
## 1. SGD
$$w \leftarrow w - \text{lr} \cdot \nabla_w L$$
## 2. SGD+Momentum
在SGD的基础上，进行时间维度平滑。
$$v_t = \mu v_{t-1} + \nabla L$$
$$w \leftarrow w - \text{lr} \cdot v_t$$

- transformed_grad
$$transformed\_grad = EMA(grad)$$
## 3. AdaGrad

Adagrad认为不同的参数应该使用不同的学习率。
$$r_t = \beta r_{t-1} + (1-\beta)\nabla L^2$$
$$
w \leftarrow w - \text{lr} \cdot \frac{\nabla L}{\sqrt{r_t} + \epsilon}
$$

- transformed_grad
$$transformed\_grad = \frac{grad}{\sqrt{(EMA(grad^2))}}$$
## 4. Adam

Adam是Momentum和AdaGrad的结合。内部需要保存一阶矩和二阶矩。
- 一阶矩：Momentum，代表梯度更新方向
- 二阶矩：梯度尺度。

$$m_t = \beta_1 m_{t-1} + (1-\beta_1)\nabla L$$
$$v_t = \beta_2 v_{t-1} + (1-\beta_2)\nabla L^2$$
除此之外，因为 EMA 初期偏向 0，所以要对m和v进行偏置修正。（t是t次幂）
$$\hat m_t = \frac{m_t}{1-\beta_1^t},
\quad
\hat v_t = \frac{v_t}{1-\beta_2^t}$$

最终公式是
$$w \leftarrow w - \text{lr} \cdot \frac{\hat m_t}{\sqrt{\hat v_t} + \epsilon}
$$
-  transformed_grad
$$transformed_grad = EMA(grad) / sqrt(EMA(grad^2))$$

## 5. Adamw

值得注意的是，有一段时间人们误以为在 Adam 中简单地添加 L2 正则化（即把 $\lambda w$ 加到梯度中）就能达到权重衰减的效果，就像在 SGD 中那样。但这被证明在 Adam 这类自适应算法中是错误的。

我们上面提到Adam的更新是$$\Delta{\omega_i} = -\text{lr} \cdot \frac{\hat m_t}{\sqrt{\hat v_t} + \epsilon}$$
注意，这里分子和分母中的 $\hat{m}_t$ 和 $\hat{v}_t$ 都是 $\nabla L$ 的函数。我们在 [[L2 Regularization]] 提到，L2正则化会给总Loss加上一项，使得最终的梯度 $\nabla L' = \nabla L + \lambda \omega$。因此，$\lambda \omega$ 会混入到分子和分母中，并因为Adam的自适应机制（$m_t$ 的平滑和 $v_t$ 的缩放）而扭曲，导致不同参数的正则化程度不同。
## 正确方式

解决方式很简单，我们调整一下加入$\lambda \omega$的时机，不在求出$\nabla L$后立刻引入，而是在最终的公式中加上一项$\lambda \omega$。即

$$
\Delta{\omega_i} = -\text{lr} \cdot (\frac{\hat m_t}{\sqrt{\hat v_t} + \epsilon} + \lambda\omega)
$$

最终公式是$$w \leftarrow w - \text{lr} \cdot (\frac{\hat m_t}{\sqrt{\hat v_t} + \epsilon} + \lambda\omega)
$$
