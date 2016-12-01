PGraphics buf;
PShader frag;
PImage tex;

void setup() {
  size(960, 480, P2D);
  colorMode(RGB, 1.0);
  tex = loadImage("scn1000c.png");

  frag = loadShader("red.frag");
  // frag = loadShader("xypattern.frag");
  // frag = loadShader("sinblobs1.frag");
  // frag = loadShader("sinblobs2.frag");
  // frag = loadShader("sinblobs3.frag");
}

void draw() {
  float W = width, H = height;
  float aspect = W / H;

  shader(frag);
  noStroke();
  textureMode(NORMAL);
  beginShape();
  texture(tex);
    vertex( 0,  0, -aspect, -1);
    vertex( 0,  H, -aspect,  1);
    vertex( W,  H,  aspect,  1);
    vertex( W,  0,  aspect, -1);
  endShape(CLOSE);
}

