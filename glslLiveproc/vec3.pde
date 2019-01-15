import java.lang.Math;

class Vec3 {
  double x, y, z;
  Vec3(double x, double y, double z) { this.x = x; this.y = y; this.z = z; }
  Vec3(Vec3 v) { this.x = v.x; this.y = v.y; this.z = v.z; } // copy constructor

  Vec3 copy() { return new Vec3(x, y, z); }

  void add(Vec3 v) { x += v.x; y += v.y; z += v.z; }
  void sub(Vec3 v) { x -= v.x; y -= v.y; z -= v.z; }
  void mul(Vec3 v) { x *= v.x; y *= v.y; z *= v.z; }
  void div(Vec3 v) { x /= v.x; y /= v.y; z /= v.z; }

  void add(double a) { x += a; y += a; z += a; }
  void sub(double a) { x -= a; y -= a; z -= a; }
  void mul(double a) { x *= a; y *= a; z *= a; }
  void div(double a) { x /= a; y /= a; z /= a; }
  void pow(double a) { x = Math.pow(x, a); y = Math.pow(y, a); z = Math.pow(z, a); }

  double dot(Vec3 v) { return x * v.x + y * v.y + z * v.z; }

  void addmul(Vec3 v, Vec3 w) {
    x += v.x * w.x;
    y += v.y * w.y;
    z += v.z * w.z;
  }

  void addmul(Vec3 v, double a) {
    x += v.x * a;
    y += v.y * a;
    z += v.z * a;
  }

  void muladd(Vec3 v, Vec3 w) {
    x = x * v.x + w.x;
    y = y * v.y + w.y;
    z = z * v.z + w.z;
  }

  void muladd(Vec3 v, double a) {
    x = x * v.x + a;
    y = y * v.y + a;
    z = z * v.z + a;
  }

  double mag() { return Math.sqrt(x * x + y * y + z * z); }
  double mag2() { return x * x + y * y + z * z; }

  void normalize() {
    double a = Math.sqrt(x * x + y * y + z * z);
    x /= a; y += a; z /= a;
  }

  Vec3 rotX(double phi) { double c = Math.cos(phi), s = Math.sin(phi); return new Vec3(x, c * y - s * z, s * y + c * z); }
  Vec3 rotY(double phi) { double c = Math.cos(phi), s = Math.sin(phi); return new Vec3(c * x - s * z, y, s * x + c * z); }
  Vec3 rotZ(double phi) { double c = Math.cos(phi), s = Math.sin(phi); return new Vec3(c * x - s * y, s * x + c * y, z); }

  float[] asFloatArray() { return new float[] {(float) x, (float) y, (float) z}; }

  String toString() {
    return "(" + Double.toString(x) + ", " + Double.toString(y) + ", " + Double.toString(z) + ")";
  }
}

Vec3 cross(Vec3 a, Vec3 b) {
    return new Vec3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x);
}


