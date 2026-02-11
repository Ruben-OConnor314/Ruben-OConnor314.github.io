---
title: Camera Frustum Culling in Geometry Nodes
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

$$M_P =
\begin{bmatrix}
\dfrac{2 f_{\text{mm}}}{s_w} & 0 & 0 & 0 \\
0 & \dfrac{2 f_{\text{mm}} a}{s_w} & 0 & 0 \\
0 & 0 & \dfrac{F+n}{n-F} & \dfrac{2Fn}{n-F} \\
0 & 0 & -1 & 0
\end{bmatrix}$$

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

$$M_W =
\begin{bmatrix}
e_{11} & e_{21} & e_{31} & p_x \\
e_{12} & e_{22} & e_{32} & p_y \\
e_{13} & e_{23} & e_{33} & p_z \\
0 & 0 & 0 & 1
\end{bmatrix}$$

Where $\mathbf{\hat{e}}_1, \mathbf{\hat{e}}_2, \mathbf{\hat{e}}_3$ are the orthonormal basis vectors of the camera. Geometry nodes uses a ***column-major*** layout, so;

$$\large(\mathbf{\hat{e}}_i)_j = e_{ij}  \quad i,j \in \{1,2,3\}$$
and position of the camera in world space:

$$\large\vec{P} = \begin{bmatrix}
p_x \\
p_y \\
p_z 

\end{bmatrix} \in \mathbb{R}^3$$

#### <u>Inverting the world matrix to obtain the view matrix</u>

Let a point in homogenous world space:

$$\large\mathbf{x}_w = \begin{bmatrix}
p_x \\
p_y \\
p_z \\
1

\end{bmatrix} \in \mathbb{R}^4_{\text Homogenous}$$

And let the cameras world matrix be $M_W$. Then:

$$\large\mathbf{x}_w = M_W \cdot \mathbf{x}_c$$

Multiplying a camera-space coordinate or point $\mathbf{x}_c$ with the world matrix, we get where it 'arrives' in world space.

However, for frustum tests we require the opposite process. We want to take a point in **world space** and express it in the cameras local coordinate system, then we can decide if it lies inside or outside the frustum. 

So lets solve the above equation for $\mathbf{x}_c$ ;
$$\large\mathbf{x}_w = M_W \cdot \mathbf{x}_c$$

Just invert $M_W$ to get it on the LHS, easy as pi!

$$\large M^{-1}_W \cdot \mathbf{x}_w = \mathbf{x}_c$$

Thus:

$$\large \mathbf{x}_c = M^{-1}_W \cdot \mathbf{x}_w$$

So the view matrix is just the inverted world matrix:

$$\large M_V = M^{-1}_W $$

![[Pasted image 20260210205514.png]]

## Defining the clip-space transform