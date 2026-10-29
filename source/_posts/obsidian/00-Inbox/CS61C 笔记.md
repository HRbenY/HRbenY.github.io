---
title: CS61C 笔记
author: Spa-Master
date: 2026-10-27 16:43:00
updated: 2026-10-27 16:43:00
tags: []
---

### 6 great ideas in computer architecture

#### 1. 架构的抽象

![image.png](https://cdn.jsdelivr.net/gh/HRbenY/blog-assets@master//img/20261027164410929.png)

高级语言编程可以不用管底层是如何实现的，指令集的设计也不固定电路的具体 implement 方式。

#### 2. Moore's law

每两年芯片规模翻倍

#### 3. Principle of Locality/Memory Hierarchy

![image.png](https://cdn.jsdelivr.net/gh/HRbenY/blog-assets@master//img/20261027164918357.png)
如果把访问寄存器的时间 1 ns 类比到 1 分钟，在不同的存储介质内的访问延迟是天差地别的。普遍上存在存储空间越大，访问时延越大的规律，我们无法把寄存器做到无穷多。

正因如此，计算机需要设计缓存体系。基于如下两个原理：

- 时间局限性：最近访问的数据很可能再次被访问
- 空间局限性：相邻数据很可能被一起访问

据此设计出了存储层级结构金字塔图，如下。

![image.png](https://cdn.jsdelivr.net/gh/HRbenY/blog-assets@master//img/20261027165318081.png)

#### 4. Parallelism

并行计算显然可以加速程序计算，但是最终的加速比例取决于程序中必须串行的部分。称为 Amdahl's Law

假如 10 core 加速一个 90%并行的程序，加速比为 $1/(0.1 + 0.9/10)≈5.26$ 

#### 5. Performance Measurement & Improvement

性能优化关注两个指标：Latency 和 Throughput。前者关心某个任务需要多久时间拉起并完成，后者关心拉起后的执行速度。

在进行性能优化时，应当注意软硬结合，让代码迎合计算机的物理结构，例如

- Locality
- Parallelism
- Special hardware features，比如 NPU 对矩阵运算的加速。
![image.png](https://cdn.jsdelivr.net/gh/HRbenY/blog-assets@master//img/20261027172936510.png)

#### 6. Dependability via Redundancy

随着现代处理器越来越精密，微小的干扰就会导致晶体管位反转。可以通过冗余实现可靠性。

- Redundancy so that a failing piece doesn't make the whole system fail.
- Applies to everything from datacenters to storage to memory ...to instructions.

### 2~4

二进制，C 语言语法

### 5 C : Memory Management

## RISC-V
