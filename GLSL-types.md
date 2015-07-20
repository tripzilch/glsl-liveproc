GLSL Types {#page-title}
==========

OPENGL ES SHADING LANGUAGE TYPES {#openglesshadinglanguagetypes}
================================

This is a reference for the types of the OpenGL ES Shading Language that
is described in the OpenGL ES Shading Language specification. For more
information please visit:
[www.opengl.org/registry](http://www.opengl.org/registry).

* * * * *

SCALAR TYPES {#scalartypes}
============

* * * * *

Void
====

    void main(void);
    int aFunction(void);
    void bFunction(float);

The data type **void** is used when the parameter list of a function is
empty and when a function does not return a value.

* * * * *

Boolean
=======

    bool aBool = true;
    bool bBool = bool(aInt);
    bool cBool = bool(aFloat);

The data type **bool** is used for boolean values (true or false).

Side note: Implicit type conversions are not supported. Type conversions
can be done using constructors as shown in the second and third example.

* * * * *

Integer
=======

    int aInt = 42;
    int bInt = int(aBool);
    int cInt = int(aFloat);

The data type **int** is used for integer values.

Side note: Implicit type conversions are not supported. Type conversions
can be done using constructors as shown in the second and third example.

* * * * *

Floating point {#floatingpoint}
==============

    float aFloat = 1.0;
    float bFloat = float(aBool);
    float cFloat = float(aInt);

The data type **float** is used for floating point (scalar) values.

Side note: Implicit type conversions are not supported. Type conversions
can be done using constructors as shown in the second and third example.

* * * * *

VECTOR TYPES {#vectortypes}
============

* * * * *

2-component boolean vector {#2componentbooleanvector}
==========================

    bvec2 aBvec2 = bvec2(true, true);
    bvec2 bBvec2 = bvec2(true);

    bvec2 cBvec2 = bvec2(aBvec3);
    bvec2 dBvec2 = bvec2(aBvec3.x, aBvec3.y);

The data type **bvec2** is used for boolean vectors with two components.
There are several ways to initialize a vector:

-   Components are specified by providing a scalar value for each
    component (first example).
-   Components are specified by providing one scalar value. This value
    is used for all components (the second example is equivalent to the
    first).
-   Components are specified by providing a vector of higher dimension.
    The respective values are used to initialize the components (the
    second and third example are equivalent).

Side note: The vector constructors can be used to cast between different
vector types since type conversions are done automatically for each
component.

* * * * *

3-component boolean vector {#3componentbooleanvector}
==========================

    vec3 aBvec3 = bvec3(true, true, true);
    vec3 bBvec3 = bvec3(true);

    vec3 cBvec3 = bvec3(aBvec4);
    vec3 dBvec3 = bvec3(aBvec4.x, aBvec4.y, aBvec4.z);

    vec3 eBvec3 = bvec3(aBvec2, aBool);
    vec3 fBvec3 = bvec3(aBvec2.x, aBvec2.y, aBool);

The data type **bvec3** is used for boolean vectors with three
components. There are several ways to initialize a vector:

-   Components are specified by providing a scalar value for each
    component (first example).
-   Components are specified by providing one scalar value. This value
    is used for all components (the second example is equivalent to the
    first).
-   Components are specified by providing a vector of higher dimension.
    The respective values are used to initialize the components (the
    second and third example are equivalent).
-   Components are specified by providing a combination of vectors
    and/or scalars. The respective values are used to initialize the
    vector (the fifth and sixth example are equivalent). The arguments
    of the constructor must have at least as many components as the
    vector that is initialized.

Side note: The vector constructors can be used to cast between different
vector types since type conversions are done automatically for each
component.

* * * * *

4-component boolean vector {#4componentbooleanvector}
==========================

    vec4 aBvec4 = bvec4(true, true, true, true);
    vec4 bBvec4 = bvec4(true);

    vec4 cBvec4 = bvec4(aBvec2, aBool, aBvec3);
    vec4 dBvec4 = bvec4(aBvec2.x, aBvec2.y, aBool, aBvec3.x);

The data type **bvec4** is used for boolean vectors with four
components. There are several ways to initialize a vector:

-   Components are specified by providing a scalar value for each
    component (first example).
-   Components are specified by providing one scalar value. This value
    is used for all components (the second example is equivalent to the
    first).
-   Components are specified by providing a combination of vectors and
    scalars. The respective values are used to initialize the components
    (the third and fourth example are equivalent). The arguments of the
    constructor must have at least as many components as the vector that
    is initialized.

Side note: The vector constructors can be used to cast between different
vector types since type conversions are done automatically for each
component.

* * * * *

2-component integer vector {#2componentintegervector}
==========================

    bvec2 aIvec2 = ivec2(1, 1);
    bvec2 bIvec2 = ivec2(1);

    bvec2 cIvec2 = ivec2(aIvec3);
    bvec2 dIvec2 = ivec2(aIvec3.x, aIvec3.y);

The data type **ivec2** is used for integer vectors with two components.
There are several ways to initialize a vector:

-   Components are specified by providing a scalar value for each
    component (first example).
-   Components are specified by providing one scalar value. This value
    is used for all components (the second example is equivalent to the
    first).
-   Components are specified by providing a vector of higher dimension.
    The respective values are used to initialize the components (the
    second and third example are equivalent).

Side note: The vector constructors can be used to cast between different
vector types since type conversions are done automatically for each
component.

* * * * *

3-component integer vector {#3componentintegervector}
==========================

    vec3 aIvec3 = ivec3(1, 1, 1);
    vec3 bIvec3 = ivec3(1);

    vec3 cIvec3 = ivec3(aIvec4);
    vec3 dIvec3 = ivec3(aIvec4.x, aIvec4.y, aIvec4.z);

    vec3 eIvec3 = ivec3(aIvec2, aInt);
    vec3 fIvec3 = ivec3(aIvec2.x, aIvec2.y, aInt);

The data type **ivec3** is used for integer vectors with three
components. There are several ways to initialize a vector:

-   Components are specified by providing a scalar value for each
    component (first example).
-   Components are specified by providing one scalar value. This value
    is used for all components (the second example is equivalent to the
    first).
-   Components are specified by providing a vector of higher dimension.
    The respective values are used to initialize the components (the
    second and third example are equivalent).
-   Components are specified by providing a combination of vectors
    and/or scalars. The respective values are used to initialize the
    vector (the fifth and sixth example are equivalent). The arguments
    of the constructor must have at least as many components as the
    vector that is initialized.

Side note: The vector constructors can be used to cast between different
vector types since type conversions are done automatically for each
component.

* * * * *

4-component integer vector {#4componentintegervector}
==========================

    vec4 aIvec4 = ivec4(1, 1, 1, 1);
    vec4 bIvec4 = ivec4(1);

    vec4 cIvec4 = ivec4(aIvec2, aInteger, aIvec3);
    vec4 dIvec4 = ivec4(aIvec2.x, aIvec2.y, aInt, aIvec3.x);

The data type **ivec4** is used for integer vectors with four
components. There are several ways to initialize a vector:

-   Components are specified by providing a scalar value for each
    component (first example).
-   Components are specified by providing one scalar value. This value
    is used for all components (the second example is equivalent to the
    first).
-   Components are specified by providing a combination of vectors and
    scalars. The respective values are used to initialize the components
    (the third and fourth example are equivalent). The arguments of the
    constructor must have at least as many components as the vector that
    is initialized.

Side note: The vector constructors can be used to cast between different
vector types since type conversions are done automatically for each
component.

* * * * *

2-component floating point vector {#2componentfloatingpointvector}
=================================

    vec2 aVec2 = vec2(1.0, 1.0);
    vec2 bVec2 = vec2(1.0);

    vec2 cVec2 = vec2(aVec3);
    vec2 dVec2 = vec2(aVec3.x, aVec3.y);

The data type **vec2** is used for floating point vectors with two
components. There are several ways to initialize a vector:

-   Components are specified by providing a scalar value for each
    component (first example).
-   Components are specified by providing one scalar value. This value
    is used for all components (the second example is equivalent to the
    first).
-   Components are specified by providing a vector of higher dimension.
    The respective values are used to initialize the components (the
    second and third example are equivalent).

Side note: The vector constructors can be used to cast between different
vector types since type conversions are done automatically for each
component.

* * * * *

3-component floating point vector {#3componentfloatingpointvector}
=================================

    vec3 aVec3 = vec3(1.0, 1.0, 1.0);
    vec3 bVec3 = vec3(1.0);

    vec3 cVec3 = vec3(aVec4);
    vec3 dVec3 = vec3(aVec4.x, aVec4.y, aVec4.z);

    vec3 eVec3 = vec3(aVec2, aFloat);
    vec3 fVec3 = vec3(aVec2.x, aVec2.y, aFloat);

The data type **vec3** is used for floating point vectors with three
components. There are several ways to initialize a vector:

-   Components are specified by providing a scalar value for each
    component (first example).
-   Components are specified by providing one scalar value. This value
    is used for all components (the second example is equivalent to the
    first).
-   Components are specified by providing a vector of higher dimension.
    The respective values are used to initialize the components (the
    second and third example are equivalent).
-   Components are specified by providing a combination of vectors
    and/or scalars. The respective values are used to initialize the
    vector (the fifth and sixth example are equivalent). The arguments
    of the constructor must have at least as many components as the
    vector that is initialized.

Side note: The vector constructors can be used to cast between different
vector types since type conversions are done automatically for each
component.

* * * * *

4-component floating point vector {#4componentfloatingpointvector}
=================================

    vec4 aVec4 = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 bVec4 = vec4(1.0);

    vec4 cVec4 = vec4(aVec2, aFloat, aVec3);
    vec4 dVec4 = vec4(aVec2.x, aVec2.y, aFloat, aVec3.x);

The data type **vec4** is used for floating point vectors with four
components. There are several ways to initialize a vector:

-   Components are specified by providing a scalar value for each
    component (first example).
-   Components are specified by providing one scalar value. This value
    is used for all components (the second example is equivalent to the
    first).
-   Components are specified by providing a combination of vectors and
    scalars. The respective values are used to initialize the components
    (the third and fourth example are equivalent). The arguments of the
    constructor must have at least as many components as the vector that
    is initialized.

Side note: The vector constructors can be used to cast between different
vector types since type conversions are done automatically for each
component.

* * * * *

MATRIX TYPES {#matrixtypes}
============

* * * * *

2x2 floating point matrix {#2x2floatingpointmatrix}
=========================

    mat2 aMat2 = mat2(1.0, 0.0,  // 1. column
                      0.0, 1.0); // 2. column
    mat2 bMat2 = mat2(1.0);

    mat2 cMat2 = mat2(aVec2, bVec2);
    mat2 dMat2 = mat2(aVec3, aFloat);

The data type **mat2** is used for floating point matrices with two
times two components in column major order. There are several ways to
initialize a matrix:

-   Components are specified by providing a scalar value for each
    component (first example). The matrix is filled column by column.
-   Components are specified by providing one scalar value. This value
    is used for the components on the main diagonal (the second example
    is equivalent to the first).
-   Components are specified by providing a combination of vectors and
    scalars. The respective values are used to initialize the components
    column by column. The arguments of the constructor must have at
    least as many components as the matrix that is initialized.

The following examples show how the values of a matrix can be accessed
to set or get the values:

    mat2 aMat2;
    aMat2[1][1] = 1.0;
    float aFloat = aMat2[1][1];

    aMat2[0] = vec2(1.0);
    vec2 aVec2 = aMat2[0];

The values of a matrix can be accessed component-wise or column by
column:

-   In the first example the bottom right component of a matrix is set
    to a float value.
-   In the second example a new variable of type float is initialized
    with the value of the bottom right component of a matrix.
-   In the third example the first column vector of a matrix is set with
    a vector.
-   In the fourth example a new variable of type float vector is
    initialized with the column vector.

* * * * *

3x3 floating point matrix {#3x3floatingpointmatrix}
=========================

    mat3 aMat3 = mat3(1.0, 0.0, 0.0,  // 1. column
                      0.0, 1.0, 0.0,  // 2. column
                      0.0, 0.0, 1.0); // 3. column
    mat3 bMat3 = mat3(1.0);

    mat3 cMat3 = mat3(aVec3, bVec3, cVec3);
    mat3 dMat3 = mat3(aVec4, aVec3, bVec4, aFloat);

The data type **mat3** is used for floating point matrices with three
times three components in column major order. There are several ways to
initialize a matrix:

-   Components are specified by providing a scalar value for each
    component (first example). The matrix is filled column by column.
-   Components are specified by providing one scalar value. This value
    is used for the components on the main diagonal (the second example
    is equivalent to the first).
-   Components are specified by providing a combination of vectors and
    scalars. The respective values are used to initialize the components
    column by column. The arguments of the constructor must have at
    least as many components as the matrix that is initialized.

The following examples show how the values of a matrix can be accessed
to set or get the values:

    mat3 aMat3;
    aMat3[2][2] = 1.0;
    float aFloat = aMat3[2][2];

    aMat3[0] = vec3(1.0);
    vec3 aVec3 = aMat3[0];

The values of a matrix can be accessed component-wise or column by
column:

-   In the first example the bottom right component of a matrix is set
    to a float value.
-   In the second example a new variable of type float is initialized
    with the value of the bottom right component of a matrix.
-   In the third example the first column vector of a matrix is set with
    a vector.
-   In the fourth example a new variable of type float vector is
    initialized with the column vector.

* * * * *

4x4 floating point matrix {#4x4floatingpointmatrix}
=========================

    mat4 aMat4 = mat4(1.0, 0.0, 0.0, 0.0,  // 1. column
                      0.0, 1.0, 0.0, 0.0,  // 2. column
                      0.0, 0.0, 1.0, 0.0,  // 3. column
                      0.0, 0.0, 0.0, 1.0); // 4. column
    mat4 bMat4 = mat4(1.0);

    mat4 cMat4 = mat4(aVec4, bVec4, cVec4, dVec4);
    mat4 dMat4 = mat4(aVec4, aVec3, bVec4, cVec4, aFloat);

The data type **mat4** is used for floating point matrices with four
times four components in column major order. There are several ways to
initialize a matrix:

-   Components are specified by providing a scalar value for each
    component (first example). The matrix is filled column by column.
-   Components are specified by providing one scalar value. This value
    is used for the components on the main diagonal (the second example
    is equivalent to the first).
-   Components are specified by providing a combination of vectors and
    scalars. The respective values are used to initialize the components
    column by column. The arguments of the constructor must have at
    least as many components as the matrix that is initialized.

The following examples show how the values of a matrix can be accessed
to set or get the values:

    aMat4[3][3] = 1.0;
    float aFloat = aMat4[3][3];

    aMat4[0] = vec4(1.0);
    vec4 aVec4 = aMat4[0];

The values of a matrix can be accessed component-wise or column by
column:

-   In the first example the bottom right component of a matrix is set
    to a float value.
-   In the second example a new variable of type float is initialized
    with the value of the bottom right component of a matrix.
-   In the third example the first column vector of a matrix is set with
    a vector.
-   In the fourth example a new variable of type float vector is
    initialized with the column vector.

* * * * *

TEXTURE TYPES {#texturetypes}
=============

* * * * *

2D texture {#2dtexture}
==========

    uniform sampler2D texture;

The data type **sampler2D** is used to provide access to a 2D texture.
It can only be declared as a uniform variable since it is a reference to
data that has been loaded to a texture unit.

Side note: On iOS devices this data type can only be used in the
fragment shader since they don't have texture image units that can be
accessed by the vertex shader.

* * * * *

Cubemap texture {#cubemaptexture}
===============

    uniform samplerCube texture;

The data type **samplerCube** is used to provide access to a cubemap
texture. It can only be declared as a uniform variable since it is a
reference to data that has been loaded to a texture unit.

Side note: On iOS devices this data type can only be used in the
fragment shader since they don't have texture image units that can be
accessed by the vertex shader.

* * * * *

STRUCTURES AND ARRAYS {#structuresandarrays}
=====================

* * * * *

Structure
=========

    struct matStruct {
        vec4 ambientColor;
        vec4 diffuseColor;
        vec4 specularColor;
        float specularExponent;
    } newMaterial;

    newMaterial = matStruct(vec4(0.1, 0.1, 0.1, 1.0),
                            vec4(1.0, 0.0, 0.0, 1.0),
                            vec4(0.7, 0.7, 0.7, 1.0),
                            50.0);

The data type **struct** is used to declare custom data structures based
on standard types. A constructor for the structure with the same name is
created automatically. The declaration of a variable (in this case
"newMaterial") is optional.

Side note: There has to be an exact correspondence of the arguments of
the constructor and the elements of the structure.

    vec4 ambientColor = newMaterial.ambientColor;
    vec4 diffuseColor = newMaterial.diffuseColor;
    vec4 specularColor = newMaterial.specularColor;
    float specularExponent = newMaterial.specularExponent;

The elements of a structure can be accessed using the dot-operator.

* * * * *

Array
=====

    int newIntArray[9];
    vec3 newVec3Array[3];

The data type **array** is used to declare custom arrays based on
standard types. The following restrictions apply for arrays:

-   An array can contain all basic data types as well as structures.
-   An array can not be initialized at the time when it is declared.
-   The elements of an array have to be initialized one after the other.

The elements of an array are initialized and accessed using the index of
the respective element:

    newIntArray[0] = 5;
    newVec3Array[1] = vec3(1.0, 1.0, 1.0);

    int newInt = newIntArray[0];
    vec3 newVec3 = newVec3Array[1];

Side note: On iOS devices the elements of an array can not be accessed
using a variable index, i.e. the value of the index has to be a compile
time constant.

[](https://twitter.com/ShaderificApp "Shaderific for iOS")
