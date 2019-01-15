GLSL Functions
==============

OPENGL ES SHADING LANGUAGE BUILT-IN FUNCTIONS
=============================================

This is a reference for the built-in functions of the OpenGL ES Shading Language that is described in the OpenGL ES Shading Language specification. For more information please visit: [www.opengl.org/registry](http://www.opengl.org/registry).

* * * * *

ANGLE & TRIGONOMETRY FUNCTIONS
==============================

* * * * *

Radians
=======

    float radians(float degrees)
    vec2 radians(vec2 degrees)
    vec3 radians(vec3 degrees)
    vec4 radians(vec4 degrees)

The **radians** function converts degrees to radians. The input parameter can be a floating scalar or a float vector. In case of a float vector all components are converted from degrees to radians separately.

* * * * *

Degrees
=======

    float degrees(float radians)
    vec2 degrees(vec2 radians)
    vec3 degrees(vec3 radians)
    vec4 degrees(vec4 radians)

The **degrees** function converts radians to degrees. The input parameter can be a floating scalar or a float vector. In case of a float vector every component is converted from radians to degrees separately.

* * * * *

Sine
====

    float sin(float angle)
    vec2 sin(vec2 angle)
    vec3 sin(vec3 angle)
    vec4 sin(vec4 angle)

The **sin** function returns the sine of an angle in radians. The input parameter can be a floating scalar or a float vector. In case of a float vector the sine is calculated separately for every component.

* * * * *

Cosine
======

    float cos(float angle)
    vec2 cos(vec2 angle)
    vec3 cos(vec3 angle)
    vec4 cos(vec4 angle)

The **cos** function returns the cosine of an angle in radians. The input parameter can be a floating scalar or a float vector. In case of a float vector the cosine is calculated separately for every component.

* * * * *

Tangent
=======

    float tan(float angle)
    vec2 tan(vec2 angle)
    vec3 tan(vec3 angle)
    vec4 tan(vec4 angle)

The **tan** function returns the tangent of an angle in radians. The input parameter can be a floating scalar or a float vector. In case of a float vector the tangent is calculated separately for every component.

* * * * *

Arcsine
=======

    float asin(float x)
    vec2 asin(vec2 x)
    vec3 asin(vec3 x)
    vec4 asin(vec4 x)

The **asin** function returns the arcsine of an angle in radians. It is the inverse function of sine. The input parameter can be a floating scalar or a float vector. In case of a float vector the arcsine is calculated separately for every component.

* * * * *

Arccosine
=========

    float acos(float x)
    vec2 acos(vec2 x)
    vec3 acos(vec3 x)
    vec4 acos(vec4 x)

The **acos** function returns the arccosine of an angle in radians. It is the inverse function of cosine. The input parameter can be a floating scalar or a float vector. In case of a float vector the arccosine is calculated separately for every component.

* * * * *

Arctangent
==========

    float atan(float y_over_x)
    vec2 atan(vec2 y_over_x)
    vec3 atan(vec3 y_over_x)
    vec4 atan(vec4 y_over_x)

The **atan** function returns the arctangent of an angle in radians. It is the inverse function of tangent. The input parameter can be a floating scalar or a float vector. In case of a float vector the arctangent is calculated separately for every component.

    float atan(float y, float x)
    vec2 atan(vec2 y, vec2 x)
    vec3 atan(vec3 y, vec3 x)
    vec4 atan(vec4 y, vec4 x)

There is also a two-argument variation of the **atan** function (in other programming languages often called atan2). For a point with Cartesian coordinates (x, y) the function returns the angle θ of the same point with polar coordinates (r, θ).

* * * * *

EXPONENTIAL FUNCTIONS
=====================

* * * * *

Exponentiation
==============

    float pow(float x, float y)
    vec2 pow(vec2 x, vec2 y)
    vec3 pow(vec3 x, vec3 y)
    vec4 pow(vec4 x, vec4 y)

The **power** function returns x raised to the power of y. The input parameters can be floating scalars or float vectors. In case of float vectors the operation is done component-wise.

* * * * *

Exponential function
====================

    float exp(float x)
    vec2 exp(vec2 x)
    vec3 exp(vec3 x)
    vec4 exp(vec4 x)

The **exp** function returns the constant e raised to the power of x. The input parameter can be a floating scalar or a float vector. In case of a float vector the operation is done component-wise.

* * * * *

Natural logarithm
=================

    float log(float x)
    vec2 log(vec2 x)
    vec3 log(vec3 x)
    vec4 log(vec4 x)

The **log** function returns the power to which the constant e has to be raised to produce x. The input parameter can be a floating scalar or a float vector. In case of a float vector the operation is done component-wise.

* * * * *

Exponential function (base 2)
=============================

    float exp2(float x)
    vec2 exp2(vec2 x)
    vec3 exp2(vec3 x)
    vec4 exp2(vec4 x)

The **exp2** function returns 2 raised to the power of x. The input parameter can be a floating scalar or a float vector. In case of a float vector the operation is done component-wise.

* * * * *

Logarithm (base 2)
==================

    float log2(float x)
    vec2 log2(vec2 x)
    vec3 log2(vec3 x)
    vec4 log2(vec4 x)

The **log2** function returns the power to which 2 has to be raised to produce x. The input parameter can be a floating scalar or a float vector. In case of a float vector the operation is done component-wise.

* * * * *

Square root
===========

    float sqrt(float x)
    vec2 sqrt(vec2 x)
    vec3 sqrt(vec3 x)
    vec4 sqrt(vec4 x)

The **sqrt** function returns the square root of x. The input parameter can be a floating scalar or a float vector. In case of a float vector the operation is done component-wise.

* * * * *

Inverse square root
===================

    float inversesqrt(float x)
    vec2 inversesqrt(vec2 x)
    vec3 inversesqrt(vec3 x)
    vec4 inversesqrt(vec4 x)

The **inversesqrt** function returns the inverse square root of x, i.e. the reciprocal of the square root. The input parameter can be a floating scalar or a float vector. In case of a float vector the operation is done component-wise.

* * * * *

COMMON FUNCTIONS
================

* * * * *

Absolute value
==============

    float abs(float x)
    vec2 abs(vec2 x)
    vec3 abs(vec3 x)
    vec4 abs(vec4 x)

The **abs** function returns the absolute value of x, i.e. x when x is positive or zero and -x for negative x. The input parameter can be a floating scalar or a float vector. In case of a float vector the operation is done component-wise.

* * * * *

Sign
====

    float sign(float x)
    vec2 sign(vec2 x)
    vec3 sign(vec3 x)
    vec4 sign(vec4 x)

The **sign** function returns 1.0 when x is positive, 0.0 when x is zero and -1.0 when x is negative. The input parameter can be a floating scalar or a float vector. In case of a float vector the operation is done component-wise.

* * * * *

Floor
=====

    float floor(float x)
    vec2 floor(vec2 x)
    vec3 floor(vec3 x)
    vec4 floor(vec4 x)

The **floor** function returns the largest integer number that is smaller or equal to x. The input parameter can be a floating scalar or a float vector. In case of a float vector the operation is done component-wise.

Side note: The return value is of type floating scalar or float vector although the result of the operation is an integer.

* * * * *

Ceiling
=======

    float ceil(float x)
    vec2 ceil(vec2 x)
    vec3 ceil(vec3 x)
    vec4 ceil(vec4 x)

The **ceiling** function returns the smallest number that is larger or equal to x. The input parameter can be a floating scalar or a float vector. In case of a float vector the operation is done component-wise.

Side note: The return value is of type floating scalar or float vector although the result of the operation is an integer.

* * * * *

Fractional part
===============

    float fract(float x)
    vec2 fract(vec2 x)
    vec3 fract(vec3 x)
    vec4 fract(vec4 x)

The **fract** function returns the fractional part of x, i.e. x minus floor(x). The input parameter can be a floating scalar or a float vector. In case of a float vector the operation is done component-wise.

* * * * *

Modulo
======

    float mod(float x, float y)
    vec2 mod(vec2 x, vec2 y)
    vec3 mod(vec3 x, vec3 y)
    vec4 mod(vec4 x, vec4 y)

The **mod** function returns x minus the product of y and floor(x/y). The input parameters can be floating scalars or float vectors. In case of float vectors the operation is done component-wise.

Side note: If x and y are integers the return value is the remainder of the division of x by y as expected.

    float mod(float x, float y)
    vec2 mod(vec2 x, float y)
    vec3 mod(vec3 x, float y)
    vec4 mod(vec4 x, float y)

There is also a variation of the **mod** function where the second parameter is always a floating scalar.

* * * * *

Minimum
=======

    float min(float x, float y)
    vec2 min(vec2 x, vec2 y)
    vec3 min(vec3 x, vec3 y)
    vec4 min(vec4 x, vec4 y)

The **min** function returns the smaller of the two arguments. The input parameters can be floating scalars or float vectors. In case of float vectors the operation is done component-wise.

    float min(float x, float y)
    vec2 min(vec2 x, float y)
    vec3 min(vec3 x, float y)
    vec4 min(vec4 x, float y)

There is also a variation of the **min** function where the second parameter is always a floating scalar.

* * * * *

Maximum
=======

    float max(float x, float y)
    vec2 max(vec2 x, vec2 y)
    vec3 max(vec3 x, vec3 y)
    vec4 max(vec4 x, vec4 y)

The **max** function returns the larger of the two arguments. The input parameters can be floating scalars or float vectors. In case of float vectors the operation is done component-wise.

    float max(float x, float y)
    vec2 max(vec2 x, float y)
    vec3 max(vec3 x, float y)
    vec4 max(vec4 x, float y)

There is also a variation of the **max** function where the second parameter is always a floating scalar.

* * * * *

Clamp
=====

    float clamp(float x, float minVal, float maxVal)
    vec2 clamp(vec2 x, vec2 minVal, vec2 maxVal)
    vec3 clamp(vec3 x, vec3 minVal, vec3 maxVal)
    vec4 clamp(vec4 x, vec4 minVal, vec4 maxVal)

The **clamp** function returns x if it is larger than minVal and smaller than maxVal. In case x is smaller than minVal, minVal is returned. If x is larger than maxVal, maxVal is returned. The input parameters can be floating scalars or float vectors. In case of float vectors the operation is done component-wise.

    float clamp(float x, float minVal, float maxVal)
    vec2 clamp(vec2 x, float minVal, float maxVal)
    vec3 clamp(vec3 x, float minVal, float maxVa
    vec4 clamp(vec4 x, flfloat minVal float maxVal)

There is also a variation of the **clamp** function where the second and third parameters are always a floating scalars.

* * * * *

Mix
===

    float mix(float x, float y, float a)
    vec2 mix(vec2 x, vec2 y, vec2 a)
    vec3 mix(vec3 x, vec3 y, vec3 a)
    vec4 mix(vec4 x, vec4 y, vec4 a)

The **mix** function returns the linear blend of x and y, i.e. the product of x and (1 - a) plus the product of y and a. The input parameters can be floating scalars or float vectors. In case of float vectors the operation is done component-wise.

    float mix(float x, float y, float a)
    vec2 mix(vec2 x, vec2 y, float a)
    vec3 mix(vec3 x, vec3 y, float a)
    vec4 mix(vec4 x, vec4 y, float a)

There is also a variation of the **mix** function where the third parameter is always a floating scalar.

* * * * *

Step
====

    float step(float edge, float x)
    vec2 step(vec2 edge, vec2 x)
    vec3 step(vec3 edge, vec3 x)
    vec4 step(vec4 edge, vec4 x)

`step(a, b)` returns `a >= b ? 1.0 : 0.0`    
`step(a, b)` returns `b < a ? 0.0 : 1.0`    

The **step** function returns 0.0 if x is smaller then edge and otherwise 1.0. The input parameters can be floating scalars or float vectors. In case of float vectors the operation is done component-wise.

    float step(float edge, float x)
    vec2 step(float edge, vec2 x)
    vec3 step(float edge, vec3 x)
    vec4 step(float edge, vec4 x)

There is also a variation of the **step** function where the edge parameter is always a floating scalar.

* * * * *

Smoothstep
==========

    float smoothstep(float edge0, float edge1, float x)
    vec2 smoothstep(vec2 edge0, vec2 edge1, vec2 x)
    vec3 smoothstep(vec3 edge0, vec3 edge1, vec3 x)
    vec4 smoothstep(vec4 edge0, vec4 edge1, vec4 x)

The **smoothstep** function returns 0.0 if x is smaller then edge0 and 1.0 if x is larger than edge1. Otherwise the return value is interpolated between 0.0 and 1.0 using Hermite polynomirals. The input parameters can be floating scalars or float vectors. In case of float vectors the operation is done component-wise.

    float smoothstep(float edge0, float edge1, float x)
    vec2 smoothstep(float edge0, float edge1, vec2 x)
    vec3 smoothstep(float edge0, float edge1, vec3 x)
    vec4 smoothstep(float edge0, float edge1, vec4 x)

There is also a variation of the *\* smoothstep*\* function where the edge0 and edge1 parameters are always floating scalars.

* * * * *

GEOMETRIC FUNCTIONS
===================

* * * * *

Length
======

    float length(float x)
    float length(vec2 x)
    float length(vec3 x)
    float length(vec4 x)

The **length** function returns the length of a vector defined by the Euclidean norm, i.e. the square root of the sum of the squared components. The input parameter can be a floating scalar or a float vector. In case of a floating scalar the length function is trivial and returns the absolute value.

* * * * *

Distance
========

    float distance(float p0, float p1)
    float distance(vec2 p0, vec2 p1)
    float distance(vec3 p0, vec3 p1)
    float distance(vec4 p0, vec4 p1)

The **distance** function returns the distance between two points. The distance of two points is the length of the vector d = p0 - p1, that starts at p1 and points to p0. The input parameters can be floating scalars or float vectors. In case of floating scalars the distance function is trivial and returns the absolute value of d.

* * * * *

Dot product
===========

    float dot(float x, float y)
    float dot(vec2 x, vec2 y)
    float dot(vec3 x, vec3 y)
    float dot(vec4 x, vec4 y)

The **dot** function returns the dot product of the two input parameters, i.e. the sum of the component-wise products. If x and y are the same the square root of the dot product is equivalent to the length of the vector. The input parameters can be floating scalars or float vectors. In case of floating scalars the dot function is trivial and returns the product of x and y.

* * * * *

Cross product
=============

    vec3 cross(vec3 x, vec3 y)

The **cross** function returns the cross product of the two input parameters, i.e. a vector that is perpendicular to the plane containing x and y and has a magnitude that is equal to the area of the parallelogram that x and y span. The input parameters can only be 3-component floating vectors. The cross product is equivalent to the product of the length of the vectors times the sinus of the(smaller) angle between x and y.

* * * * *

Normalize
=========

    float normalize(float x)
    vec2 normalize(vec2 x)
    vec3 normalize(vec3 x)
    vec4 normalize(vec4 x)

The **normalize** function returns a vector with length 1.0 that is parallel to x, i.e. x divided by its length. The input parameter can be a floating scalar or a float vector. In case of a floating scalar the normalize function is trivial and returns 1.0.

* * * * *

Faceforward
===========

    float faceforward(float N, float I, float Nref)
    vec2 faceforward(vec2 N, vec2 I, vec2 Nref)
    vec3 faceforward(vec3 N, vec3 I, vec3 Nref)
    vec4 faceforward(vec4 N, vec4 I, vec4 Nref)

The **faceforward** function returns a vector that points in the same direction as a reference vector. The function has three input parameters of the type floating scalar or float vector: N, the vector to orient, I, the incident vector, and Nref, the reference vector. If the dot product of I and Nref is smaller than zero the return value is N. Otherwise -N is returned.

* * * * *

Reflect
=======

    float reflect(float I, float N)
    vec2 reflect(vec2 I, vec2 N)
    vec3 reflect(vec3 I, vec3 N)
    vec4 reflect(vec4 I, vec4 N)

The **reflect** function returns a vector that points in the direction of reflection. The function has two input parameters of the type floating scalar or float vector: I, the incident vector, and N, the normal vector of the reflecting surface.

Side note: To obtain the desired result the vector N has to be normalized. The reflection vector always has the same length as the incident vector. From this it follows that the reflection vector is normalized if N and I are both normalized.

* * * * *

Refract
=======

    float refract(float I, float N, float eta)
    vec2 refract(vec2 I, vec2 N, float eta)
    vec3 refract(vec3 I, vec3 N, float eta)
    vec4 refract(vec4 I, vec4 N, float eta)

The **refract** function returns a vector that points in the direction of refraction. The function has two input parameters of the type floating scalar or float vector and one input parameter of the type floating scalar: I, the incident vector, N, the normal vector of the refracting surface, and eta, the ratio of indices of refraction.

Side note: To obtain the desired result the vectors I and N have to be normalized.

* * * * *

MATRIX FUNCTIONS
================

* * * * *

Component-wise matrix multiplication
====================================

    mat2 matrixCompMult(mat2 x, mat2 y)
    mat3 matrixCompMult(mat3 x, mat3 y)
    mat4 matrixCompMult(mat4 x, mat4 y)

The **matrixCompMult** function returns a matrix resulting from a component-wise multiplication. The function has two input parameters of the type floating point matrix and returns a matrix of the same type. The indices of the returned matrix are calculated as follows: z[i][j] = x[i][j] \* y[i][j]

Side note: This is NOT the matrix multiplication known from linear algebra. To obtain the "normal" matrix multiplication the \* operator is used: z = x \* y

* * * * *

VECTOR RELATIONAL FUNCTIONS
===========================

* * * * *

Less than comparison
====================

    bvec2 lessThan(vec2 x, vec2 y)
    bvec3 lessThan(vec3 x, vec3 y)
    bvec4 lessThan(vec4 x, vec4 y)

    bvec2 lessThan(ivec2 x, ivec2 y)
    bvec3 lessThan(ivec3 x, ivec3 y)
    bvec4 lessThan(ivec4 x, ivec4 y)

The **lessThan** function returns a boolean vector as result of a component-wise comparison in the form of x[i] \< y[i]. The function has two input parameters of the type floating point vector or signed integer vector.

* * * * *

Less than or equal comparison
=============================

    bvec2 lessThanEqual(vec2 x, vec2 y)
    bvec3 lessThanEqual(vec3 x, vec3 y)
    bvec4 lessThanEqual(vec4 x, vec4 y)

    bvec2 lessThanEqual(ivec2 x, ivec2 y)
    bvec3 lessThanEqual(ivec3 x, ivec3 y)
    bvec4 lessThanEqual(ivec4 x, ivec4 y)

The **lessThanEqual** function returns a boolean vector as result of a component-wise comparison in the form of x[i] \<= y[i]. The function has two input parameters of the type floating point vector or signed integer vector.

* * * * *

Greater than comparison
=======================

    bvec2 greaterThan(vec2 x, vec2 y)
    bvec3 greaterThan(vec3 x, vec3 y)
    bvec4 greaterThan(vec4 x, vec4 y)

    bvec2 greaterThan(ivec2 x, ivec2 y)
    bvec3 greaterThan(ivec3 x, ivec3 y)
    bvec4 greaterThan(ivec4 x, ivec4 y)

The **greaterThan** function returns a boolean vector as result of a component-wise comparison in the form of x[i] \> y[i]. The function has two input parameters of the type floating point vector or signed integer vector.

* * * * *

Greater than or equal comparison
================================

    bvec2 greaterThanEqual(vec2 x, vec2 y)
    bvec3 greaterThanEqual(vec3 x, vec3 y)
    bvec4 greaterThanEqual(vec4 x, vec4 y)

    bvec2 greaterThanEqual(ivec2 x, ivec2 y)
    bvec3 greaterThanEqual(ivec3 x, ivec3 y)
    bvec4 greaterThanEqual(ivec4 x, ivec4 y)

The **greaterThanEqual** function returns a boolean vector as result of a component-wise comparison in the form of x[i] \>= y[i]. The function has two input parameters of the type floating point vector or signed integer vector.

* * * * *

Equal comparison
================

    bvec2 equal(vec2 x, vec2 y)
    bvec3 equal(vec3 x, vec3 y)
    bvec4 equal(vec4 x, vec4 y)

    bvec2 equal(ivec2 x, ivec2 y)
    bvec3 equal(ivec3 x, ivec3 y)
    bvec4 equal(ivec4 x, ivec4 y)

The **equal** function returns a boolean vector as result of a component-wise comparison in the form of x[i] = y[i]. The function has two input parameters of the type floating point vector or signed integer vector.

* * * * *

Not equal comparison
====================

    bvec2 notEqual(vec2 x, vec2 y)
    bvec3 notEqual(vec3 x, vec3 y)
    bvec4 notEqual(vec4 x, vec4 y)

    bvec2 notEqual(ivec2 x, ivec2 y)
    bvec3 notEqual(ivec3 x, ivec3 y)
    bvec4 notEqual(ivec4 x, ivec4 y)

The **notEqual** function returns a boolean vector as result of a component-wise comparison in the form of x[i] != y[i]. The function has two input parameters of the type floating point vector or signed integer vector.

* * * * *

Any evaluation
==============

    bool any(bvec2 x)
    bool any(bvec3 x)
    bool any(bvec4 x)

The **any** function returns a boolean value as result of the evaluation whether any component of the input vector is TRUE. The function has one input parameters of the type boolean vector.

* * * * *

All evaluation
==============

    bool all(bvec2 x)
    bool all(bvec3 x)
    bool all(bvec4 x)

The **all** function returns a boolean value as result of the evaluation whether all components of the input vector are TRUE. The function has one input parameters of the type boolean vector.

* * * * *

Not evaluation
==============

     bvec2 not(bvec2 x)
     bvec3 not(bvec3 x)
     bvec4 not(bvec4 x)

The **not** function returns a boolean vector as result of a component-wise logical complement operation. The function has one input parameters of the type boolean vector.

* * * * *

TEXTURE LOOKUP FUNCTIONS
========================

* * * * *

2D texture lookup
=================

    vec4 texture2D(sampler2D sampler, vec2 coord)
    vec4 texture2D(sampler2D sampler, vec2 coord, float bias)

The **texture2D** function returns a texel, i.e. the (color) value of the texture for the given coordinates. The function has one input parameter of the type sampler2D and one input parameter of the type vec2 : sampler, the uniform the texture is bound to, and coord, the 2-dimensional coordinates of the texel to look up.

There is an optional third input parameter of the type float: bias. After calculating the appropriate level of detail for a texture with mipmaps the bias is added before the actual texture lookup operation is executed.

Side note: On iOS devices texture lookup functionality is only available in the fragment shader.

* * * * *

Cubemap texture lookup
======================

    vec4 textureCube(samplerCube sampler, vec3 coord)
    vec4 textureCube(samplerCube sampler, vec3 coord, float bias)

The **textureCube** function returns a texel, i.e. the (color) value of the texture for the given coordinates. The function has one input parameter of the type samplerCube and one input parameter of the type vec3 : sampler, the uniform the texture is bound to, and coord, the 3-dimensional coordinates of the texel to look up.

There is an optional third input parameter of the type float: bias. After calculating the appropriate level of detail for a texture with mipmaps the bias is added before the actual texture lookup operation is executed.

Side note: On iOS devices texture lookup functionality is only available in the fragment shader.

[](https://twitter.com/ShaderificApp "Shaderific for iOS")
