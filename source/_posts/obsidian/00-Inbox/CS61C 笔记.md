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

### 32个RV32I寄存器

RISC-V 32 I 指令集架构规定了 32 个 32 位宽的寄存器。其中，零寄存器 `x0` 被硬连线设置为零。

由于在 RV32I 指令集架构中字长为为 32 位，这意味着每个寄存器都是 32 位宽。

### 零寄存器

寄存器 `x0` 被硬件连线置零，无法修改数值。

### 位运算指令

![image.png](https://cdn.jsdelivr.net/gh/HRbenY/blog-assets@master//img/20261104210510566.png)

注意 `not` 是一个伪指令，`not rd rs1` 底层实现是 `xori rd rs1 -1` 。而且 `not` 没有立即数版本，因为将立即数取反并存入，相当于直接存入立即数取反后的结果，没必要专门创建一个指令。

### 数据传输



![image.png](https://cdn.jsdelivr.net/gh/HRbenY/blog-assets@master//img/20261104210900561.png)

如上图，处理器通过发出地址来读取或写入数据，从而与内存通信。

- **从内存加载**：将数据从内存读取到处理器中。
- **存储到**内存：将数据从处理器写入内存。

> [!Note]-
> As computer architects, our world is processor-centric–because that’s where all the action happens. So the direction of this operation is with respect to the operation: load _from_, store _to_.

#### 读取字

| Instruction       | Name       | Description                            |
| ----------------- | ---------- | -------------------------------------- |
| `lw rd imm(rs1)`  | Load Word  | `R[rd] = M[R[rs1] + imm][31:0]`        |
| `sw rs2 imm(rs1)` | Store Word | `M[R[rs1] + imm][31:0] = R[rs2][31:0]` |

RISC-V 只允许对**寄存器**中的数据进行操作。对内存中的数据进行任何操作都必须涉及多条指令：

1. 将内存中的数据**加载到寄存器中**
2. 对处理器中的寄存器**执行操作。**
3. （如有必要）将数据**存储回内存。**

#### 字节序和对齐

> 在 RISC-V 中，字节序与字节地址无关。

无论在大端还是小端系统中，从该字节的地址加载一个字节大小的数据，都将返回存储的值。因为无论字节序如何，字节的存储都是相同的。比如 `0x12345678`，存入大端为 `78 56 34 12`，存入小端为 `12 34 56 78` 。虽然字节之间的顺序不同，但是字节是相同的，都是 `12` `34` `56` `78` 这四个。

> 根据 RISC-V 标准，字的加载和存储操作**应该使用字对齐的地址**。

对于 RV32I 来说，这意味着地址 `R[rs1] + imm` 应该是 4 的倍数。非字对齐的地址会导致依赖于具体实现的行为。换句话说，虽然 RISC-V 在技术上允许非对齐访问以支持旧代码，但这非常慢且混乱。


#### 读取字节

对于大小小于 32 位的数据类型，如果按照字存取方式申请完整的 word，会比较浪费。 RV32I 提供字节大小和半字大小存储方式。

| Instruction       | Name            | Description                            |
| ----------------- | --------------- | -------------------------------------- |
| `sb rs2 imm(rs1)` | Store Byte      | `M[R[rs1] + imm][7:0] = R[rs2][7:0]`   |
| `sh rs2 imm(rs1)` | Store Half-word | `M[R[rs1] + imm][15:0] = R[rs2][15:0]` |
| `sw rs2 imm(rs1)` | Store Word      | `M[R[rs1] + imm][31:0] = R[rs2][31:0]` |
