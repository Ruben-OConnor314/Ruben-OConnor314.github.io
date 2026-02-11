---
title: Camera Frustum Culling in Geometry Nodes (WIP)
category: Technical Art
date: 2020  
software:
- Blender
- Geometry Nodes
concepts:
- Linear Algebra
- Affine Transformations
- Vector Subspaces
- Projective Transformations
---

## <u>The Projection Matrix</u>

To perform frustum culling, we require a boolean selection field that determines whether a point in **world space** lies within the camera’s visible region. This region is not axis-aligned, and depends on the camera’s intrinsic perspective parameters (focal length, sensor size, aspect ratio) as well as its near and far clipping distances. These parameters define a **projective transformation**, mapping world-space coordinates into **clip space**, where visibility can be evaluated using simple half-space inequalities.

The camera’s projection matrix can be written as:

$$
M_P =
\begin{bmatrix}
\dfrac{2 f_{\text{mm}}}{s_w} & 0 & 0 & 0 \\
0 & \dfrac{2 f_{\text{mm}} a}{s_w} & 0 & 0 \\
0 & 0 & \dfrac{F+n}{n-F} & \dfrac{2Fn}{n-F} \\
0 & 0 & -1 & 0
\end{bmatrix}
$$

Where,
- $F$ is the far clipping distance (cameras maximum view extent)
- $n$ is the near clipping distance (camera cant see objects behind this extent)
- $s_w$ is the cameras sensor width
- $f_{mm}$ is the cameras focal length in millimeters
- $a$ is the cameras aspect ratio


### <u>The inverted World Matrix (AKA View Matrix)</u>

Recall our requirement. *To construct a field that determines whether a point lies inside the camera’s frustum.* The projection matrix $M_p$​ alone is insufficient for this, since it only encodes the camera’s *intrinsic parameters* (field of view, aspect ratio, near/far planes). It assumes the camera is located at the origin and aligned with the canonical axes.

In the special case where the camera lies at the world origin and is axis-aligned, world space and camera space coincide, and frustum evaluation using only $M_p$​​ is valid.

In general, however, the camera may be arbitrarily positioned and oriented in world space. To account for these *extrinsic* properties, we incorporate the camera’s world transform. Specifically, we use its inverse, known as the ***view matrix***, to map world-space points into camera space.

We will first define the world matrix $M_W$, then discuss why we chose to take its inverse.
The cameras world matrix can be written generally as such;

$$
M_W =
\begin{bmatrix}
e_{11} & e_{21} & e_{31} & p_x \\
e_{12} & e_{22} & e_{32} & p_y \\
e_{13} & e_{23} & e_{33} & p_z \\
0 & 0 & 0 & 1
\end{bmatrix}
$$

Where $\mathbf{\hat{e}}_1, \mathbf{\hat{e}}_2, \mathbf{\hat{e}}_3$ are the orthonormal basis vectors of the camera. Geometry nodes uses a ***column-major*** layout, so;

$$
\large(\mathbf{\hat{e}}_i)_j = e_{ij}  \quad i,j \in \{1,2,3\}
$$

and position of the camera in world space:

$$
\large\vec{P} = \begin{bmatrix}
p_x \\
p_y \\
p_z
\end{bmatrix} \in \mathbb{R}^3
$$

#### <u>Inverting the world matrix to obtain the view matrix</u>

Let a point in homogenous world space:

$$
\large\mathbf{x}_w = \begin{bmatrix}
p_x \\
p_y \\
p_z \\
1
\end{bmatrix} \in \mathbb{R}^4_{\text{Homogenous}}
$$

And let the cameras world matrix be $M_W$. Then:

$$
\large\mathbf{x}_w = M_W \cdot \mathbf{x}_c
$$

Multiplying a camera-space coordinate or point $\mathbf{x}_c$ with the world matrix, we get where it 'arrives' in world space.

However, for frustum tests we require the opposite process. We want to take a point in **world space** and express it in the cameras local coordinate system, then we can decide if it lies inside or outside the frustum.

So let's solve the above equation for $\mathbf{x}_c$ ;
$$
\large\mathbf{x}_w = M_W \cdot \mathbf{x}_c
$$

Just invert $M_W$ to get it on the LHS, easy as pi!

$$
\large M^{-1}_W \cdot \mathbf{x}_w = \mathbf{x}_c
$$

Thus:

$$
\large \mathbf{x}_c = M^{-1}_W \cdot \mathbf{x}_w
$$

So the view matrix is just the inverted world matrix:

$$
\large M_V = M^{-1}_W
$$

![[Pasted image 20260210205514.png]]

## Defining the clip-space transform

The view matrix $M_V$ transforms points from world space into camera space. However, the cameras frustum is not defined purely by the camera basis vectors. It is also determined by the camera’s ***intrinsic perspective parameters***, such as focal length, sensor size, aspect ratio, and the near and far clipping planes. These properties, as discussed earlier, are encoded in the projection matrix $M_p$

Once we express a point in camera space, applying the projection matrix maps it into **clip space**, a projective coordinate system in which the camera’s viewing volume becomes a canonical region.

Let $\mathbf{\tilde{x}}_w \in \mathbb{R}^4$ be a point in homogenous world space. Then obtain the clip space coordinate $\mathbf{c}$ by applying the combined view-projection transform:

$$\large \mathbf{c} = M_p\cdot M_V \cdot \mathbf{\tilde{x}}_w$$

Lets define the combined clip transform matrix as:

$$\large M_C = M_p\cdot M_V$$

Thus:

$$\large \mathbf{c} = M_C \cdot \mathbf{x}_w $$

where:

$$
\large\mathbf{c}_w = \begin{bmatrix}
c_x \\
c_y \\
c_z \\
c_w
\end{bmatrix} \in \mathbb{R}^4_{\text{Homogenous}}
$$

Unlike affine transformations, the projection matrix introduces a non-trivial $w$ component. The value $c_w$​ is depth-dependent, and it is responsible for the perspective effect.



## The clip volume

In clip space, the camera frustum is represented by a fixed canonical volume defined by the inequalities:

$$\large
-c_w \le c_x \le c_w
$$

$$\large
-c_w \le c_y \le c_w
$$

$$\large
-c_w \le c_z \le c_w
$$

A point lies inside the camera frustum if and only if it satisfies all three bounds simultaneously.



## Relation to normalized device coordinates (NDC)

$$\large
x_{ndc} = \frac{c_x}{c_w},\quad
y_{ndc} = \frac{c_y}{c_w},\quad
z_{ndc} = \frac{c_z}{c_w}
$$

$$\large
-1 \le x_{ndc} \le 1,\quad
-1 \le y_{ndc} \le 1,\quad
-1 \le z_{ndc} \le 1
$$

However, for frustum culling we do not need to explicitly compute the perspective divide. Instead, we may evaluate the equivalent inequalities directly in clip space.



## Converting the bounds into half-space tests

$$\large
c_x \le c_w \quad\Rightarrow\quad c_w - c_x \ge 0
$$

$$\large
-c_w \le c_x \quad\Rightarrow\quad c_x + c_w \ge 0
$$

Applying the same rearrangement for all axes yields six half-space inequalities:

$$\large
c_w + c_x \ge 0,\quad c_w - c_x \ge 0
$$

$$\large
c_w + c_y \ge 0,\quad c_w - c_y \ge 0
$$

$$\large
c_w + c_z \ge 0,\quad c_w - c_z \ge 0
$$

A point lies inside the frustum if and only if all six inequalities are satisfied.

---

## Extracting the frustum planes from the clip transform

Recall that a point in homogeneous world space is transformed into clip space by:

$$
\mathbf{c} = M \tilde{\mathbf{p}}
$$

where

$$
M = M_p M_V
$$

and

$$
\tilde{\mathbf{p}} =
\begin{bmatrix}
p_x\\
p_y\\
p_z\\
1
\end{bmatrix}.
$$

Let the rows of the clip transform matrix $M$ be denoted as:

$$
M =
\begin{bmatrix}
\mathbf{r}_1^T\\
\mathbf{r}_2^T\\
\mathbf{r}_3^T\\
\mathbf{r}_4^T
\end{bmatrix}.
$$

Then the clip-space coordinates are given by:

$$
c_x = \mathbf{r}_1 \cdot \tilde{\mathbf{p}},\quad
c_y = \mathbf{r}_2 \cdot \tilde{\mathbf{p}},\quad
c_z = \mathbf{r}_3 \cdot \tilde{\mathbf{p}},\quad
c_w = \mathbf{r}_4 \cdot \tilde{\mathbf{p}}.
$$

The canonical clip volume is defined by:

$$
-c_w \le c_x \le c_w,\quad
-c_w \le c_y \le c_w,\quad
-c_w \le c_z \le c_w.
$$

Rearranging the first bound gives:

$$
c_x \le c_w \quad\Rightarrow\quad c_w - c_x \ge 0
$$

Substituting the row-dot expressions yields:

$$
(\mathbf{r}_4 \cdot \tilde{\mathbf{p}}) - (\mathbf{r}_1 \cdot \tilde{\mathbf{p}}) \ge 0
$$

which can be factored as:

$$
(\mathbf{r}_4 - \mathbf{r}_1)\cdot\tilde{\mathbf{p}} \ge 0.
$$

This has the standard plane half-space form:

$$
\pi \cdot \tilde{\mathbf{p}} \ge 0,
$$

therefore the right frustum plane is:

$$
\pi_R = \mathbf{r}_4 - \mathbf{r}_1.
$$

Similarly, the inequality:

$$
-c_w \le c_x \quad\Rightarrow\quad c_x + c_w \ge 0
$$

yields the left plane:

$$
\pi_L = \mathbf{r}_4 + \mathbf{r}_1.
$$

Repeating this derivation for $y$ and $z$ produces the remaining frustum planes:

$$
\pi_B = \mathbf{r}_4 + \mathbf{r}_2,\quad
\pi_T = \mathbf{r}_4 - \mathbf{r}_2
$$

$$
\pi_N = \mathbf{r}_4 + \mathbf{r}_3,\quad
\pi_F = \mathbf{r}_4 - \mathbf{r}_3.
$$

Thus, the clip transform matrix $M$ implicitly encodes all six frustum planes, since the frustum bounds are defined directly in terms of the clip coordinates $(c_x,c_y,c_z,c_w)$, each of which is generated by a row of $M$.

---

## Combined half-space frustum test

Let $\{\pi_i\}_{i=1}^6$ denote the set of extracted frustum planes. A point $\mathbf{p}$ is inside the camera frustum if and only if it lies in the positive half-space of all six planes:

$$
\text{Inside}(\mathbf{p}) =
\bigwedge_{i=1}^{6}
\left(\pi_i \cdot \tilde{\mathbf{p}} \ge 0\right).
$$

