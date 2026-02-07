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

To perform frustum culling, we require a boolean selection field that determines whether a point in world space lies within the camera’s visible region. This region is not axis-aligned, and depends on the camera’s intrinsic perspective parameters (focal length, sensor size, aspect ratio) as well as its near and far clipping distances. These parameters define a projective transformation, mapping world-space coordinates into clip space, where visibility can be evaluated using simple half-space inequalities.

<br>
The camera’s projection matrix can be written as:

$$
M_p =
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