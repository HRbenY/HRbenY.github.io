---
Author: Spa-Master
日期: 2026年1月17日
tags:
- lang/cuda
- topic/algo
- type/note
- type/snippet
title: Matrix Transpose
---

假设要实现$B = A^T$
native实现在转置后写入矩阵的时候会出现stride不连续的问题，降低HBM的访问效率。所以要用shared_memory做访问合并
## 合并访问
根本思路是合并转置后的非连续访问，使用shared memory来做坐标映射，实现
```text
连续读取->连续写入shared memory->非连续读出->连续写入
```
的过程。shared memory乱序读取的开销可以忽略不计。

由于引入了shared memory，问题可以从宏观和微观两个角度考虑。宏观考虑的是当前处理的block怎么对应，微观考虑的是block内部怎么对应。

### 宏观

比如我们拿到了A的第0行第3列的block，可以断言这个block的元素都跟B的第3行第0列block的元素一一对应（不考虑边界），只是中间经由shared memory扭转了一下顺序。那么可以确定最终的B的索引一定有一部分是
$$
\begin{aligned}
Bx = blockDim.y * blockIdx.y + ? \\
By = blockDim.x * blockIdx.x + ?
\end{aligned}
$$
### 微观

因为B默认是行优先存储，所以列是连续的。要达到连续写入B，必须保证B的列索引是连续的。可以反推出必须使用threadIdx.x作为B的列索引。

> 这里和直觉相反。朴素实现是用A的列索引作为B的行索引，也符合转置的理解。但是这里为了访问速度，用A的列索引也作为B的列索引，中间的数据用shared memory做缓冲。所以需要进行坐标变换。

最终确定每个线程对矩阵B的操作是

$$
\boxed{
\begin{aligned}
Bx = blockDim.y * blockIdx.y + threadIdx.x \\
By = blockDim.x * blockIdx.x + threadIdx.y
\end{aligned}
}
$$
由此我们得到了每个线程需要修改的矩阵B的位置。再根据B的索引找出对应的shared memory中的元素就可以了。

```c
__global__ void matrix_transpose_kernel(const float* input, float* output, int rows, int cols) {

    __shared__ float s[TILE_WIDTH][TILE_WIDTH];

    int x = blockDim.x * blockIdx.x + threadIdx.x;

    int y = blockDim.y * blockIdx.y + threadIdx.y;

  

    int tx = threadIdx.x;

    int ty = threadIdx.y;

  

    if(x < cols && y < rows){

        s[ty][tx] = input[y * cols + x];

  

    }

    __syncthreads();

  

    int new_x = blockDim.y * blockIdx.y + threadIdx.x;

    int new_y = blockDim.x * blockIdx.x + threadIdx.y;

  

    if(new_x < rows && new_y < cols){

        output[new_y * rows + new_x] = s[tx][ty];

    }

}
```
