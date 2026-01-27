---
title: PSK
author: Spa-Master
date: '2026-01-06 15:16:27'
updated: '2026-01-06 15:16:27'
tags: []
---

误码率公式：
$$
P = \frac{1}{2}\text{erfc}(\sqrt {SNR})
$$

其中erfc只能查表

高信噪比(>3)下的近似公式
$$
P = \frac{1}{2\sqrt{SNR \cdot \pi}}exp(-SNR)
$$
