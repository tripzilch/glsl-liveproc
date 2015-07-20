void min4(in float a, inout vec4 heap) {
    // heap.x <= heap.y <= heap.z <= heap.w
    vec4 a4 = vec4(a);
    // xyzw, a   axyz  min(heap,a4) = aaaa  min(h,m) a
    // xyzw, a   xayz  min(heap,a4) = xaaa  min(h,m) x
    // xyzw, a   xyaz  min(heap,a4) = xyaa  min(h,m) x
    // xyzw, a   xyza  min(heap,a4) = xyza  min(h,m) x
    // xyzw, a   xyzw  min(heap,a4) = xyzw  min(h,m) x
    heap.x = min(heap.x, heap.a)
    heap.y = min(heap.y, heap.x)
    heap.z = min(heap.z, heap.w)
    heap.w = min(heap.w, heap.y)

    if (a <= heap.x) heap = vec4(a, heap.xyz);

}


/* Don’t use this:
float rand(vec2 co) {
   return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
} */

// Do use this:
highp float rand(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

/*

#ifndef __noise_hlsl_
#define __noise_hlsl_

// hash based 3d value noise
// function taken from https://www.shadertoy.com/view/XslGRr
// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// ported from GLSL to HLSL

float hash( float n )
{
    return frac(sin(n)*43758.5453);
}

float noise( float3 x )
{
    // The noise function returns a value in the range -1.0f -> 1.0f

    float3 p = floor(x);
    float3 f = frac(x);

    f       = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;

    return lerp(lerp(lerp( hash(n+0.0), hash(n+1.0),f.x),
                   lerp( hash(n+57.0), hash(n+58.0),f.x),f.y),
               lerp(lerp( hash(n+113.0), hash(n+114.0),f.x),
                   lerp( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
}

#endif

*/
