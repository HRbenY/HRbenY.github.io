---
Author: Spa-Master
日期: 2026年1月17日
tags:
- topic/transformer
- type/note
title: L2 Regularization
---

L2正则化的目的是权重衰减，让Loss和权重的L2范数正相关。在SGD和Momentum中不需多余处理就能达到这样的效果。但是Adagrad和Adam由于对梯度做了预处理，不能直接应用公式。（见 [Adamw](20-Reference/transformer/Adamw.md)）

## 作用

防止模型**过拟合 (Overfitting)**。通过限制参数（权重 $w$）的大小，使模型变得更简单、更平滑，避免对训练数据中的噪声死记硬背。

## 公式

总损失可以表示如下

$$
\mathcal{L}_{total}(w)=\mathcal{L}_{data}(w)+\frac{\lambda}{2} \| w \| ^2
$$

对总损失求梯度

$$
\nabla_w \mathcal{L}_{total}=\nabla_w \mathcal{L}_{data}+\nabla_w \left(\frac{\lambda}{2}\| w \|^2\right)
$$

可得

$$
\nabla_w \mathcal{L}_{total}=\nabla_w \mathcal{L}+\lambda w
$$
梯度更新的过程随着采用的优化器不同而有区别。
