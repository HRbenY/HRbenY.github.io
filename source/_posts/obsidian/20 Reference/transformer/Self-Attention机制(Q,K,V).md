---
Author: Spa-Master
日期: 2026年1月17日
tags:
- topic/transformer
- type/note
- lang/python
title: Self-Attention机制(Q,K,V)
slug: Self-Attention机制(Q,K,V)
---

$$\text{Attention}(Q, K, V) = \text{softmax}\left( \frac{QK^T}{\sqrt{d_k}} \right) V$$
### 1. 核心思想转变

- **之前 (Weighted Sum)**: 我们用全 `1` 的矩阵做平均，所有 token 对过去的关注度是一样的（平权的），这与内容无关。
    
- **现在 (Self-Attention)**: 我们希望 token 能够**有选择性地**关注过去。
    
    - _例子_：如果当前 token 是名词，它可能更想关注前面的形容词，而不是介词。
        
    - **数据驱动**：权重矩阵 `wei` 不再是固定的，而是由数据（Token 自身的信息）动态计算出来的。
        

### 2. Query, Key, Value

这是注意力机制的灵魂，每个 Token 都会发出三个向量：

- **Query (Q) - 询问**: "我在寻找什么样的信息？"
    
- **Key (K) - 标签**: "我包含什么样的信息？"
    
- **Value (V) - 内容**: "如果你决定关注我，这就是我要传给你的具体数值/特征。"
    

> **比喻**：在图书馆找书。
> 
> - **Query**: 你手里的便签写着“我要找关于 Python 的书”。
>     
> - **Key**: 书脊上贴的分类标签（“编程”、“烹饪”、“历史”）。
>     
> - **Match**: 你的 Query 和书的 Key 匹配度高（点积大），你就会把注意力放在这本书上。
>     
> - **Value**: 书里的具体内容。
>     

### 3. 代码

#### A. 线性投影

```python
# 定义三个独立的线性层
key = nn.Linear(C, head_size, bias=False)
query = nn.Linear(C, head_size, bias=False)
value = nn.Linear(C, head_size, bias=False)

# 将输入 x 映射到不同的子空间
k = key(x)   # (B, T, 16)
q = query(x) # (B, T, 16)
```

- **目的**：虽然输入都是 `x`，但为了扮演不同角色（Q, K, V），我们需要通过 `nn.Linear` 进行不同的线性变换（仿射变换）。
    
- **head_size**: 这里设为 16，意味着我们把原来的维度 $C$ 压缩或映射到了 16 维的特征空间里。
    

#### B. 注意力分数和注意力归一化

```python
# 矩阵乘法计算 Q 和 K 的相似度
wei = q @ k.transpose(-2, -1) * head_size ** 0.5
# (B, T, 16) @ (B, 16, T) ---> (B, T, T)
```

- **`transpose(-2, -1)`**: 为了能做矩阵乘法，我们需要把 $K$ 的最后两个维度交换。
    
- **物理意义**:
    
    - 我们在计算序列中**每一对 Token** 之间的点积。
        
    - 点积越大 $\rightarrow$ 向量越相似 $\rightarrow$ 关注度越高。
        
    - 得到的 `wei` 矩阵形状是 $(T, T)$，其中 `wei[i, j]` 代表第 `i` 个 token 对第 `j` 个 token 的感兴趣程度（原始分数）。

- **注意力归一化(scaled attention)**
	
	假设 $Q$ 和 $K$ 中的元素是均值为 0、方差为 1 的独立随机变量。当我们计算点积 $Q \cdot K = \sum_{i=1}^{d_k} q_i k_i$ 时：
	- 求和会累加方差。
	    
	- 如果有 $d_k$ 个元素相加，结果的方差会变成 $d_k$。
	    
	- 这意味着，$d_k$ (head_size) 越大，点积结果 `wei` 里的数值就越大（比如可能出现 100, -200 这种大数）。
	为了把方差拉回1，需要除以标准差head_size**0.5。

#### C. Masking (不能看未来)

[位置掩码](/%E4%BD%8D%E7%BD%AE%E6%8E%A9%E7%A0%81/)

```python
tril = torch.tril(torch.ones(T, T))
wei = wei.masked_fill(tril == 0, float('-inf'))
```

- 这步和之前一样。对于 Decoder (GPT) 架构，我们必须切断未来的联系。
    
- 将上三角区域填为负无穷，确保 Softmax 之后这些位置的概率为 0。
    

#### D. Softmax 归一化


```Python
wei = F.softmax(wei, dim=-1)
```

- 将原始的“相似度分数”转化为“概率分布”。
    
- 每一行的和变成了 1。现在的 `wei` 矩阵告诉我们在当前时刻，应该从历史的每个位置“提取”多少比例的信息。
    

#### E. 聚合
```python
v = value(x)     # (B, T, 16)
out = wei @ v * head_size**0.5    # (B, T, T) @ (B, T, 16) -> (B, T, 16)
```

- 使用`wei @ v`而不是`wei @ x`
