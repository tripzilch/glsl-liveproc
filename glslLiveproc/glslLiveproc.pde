PImage tex;
PShader frag;
PShape bufq;
PGraphics buf;
int R;

void setup() {
  int W = 640, H = 480;
  float aspect = float(W) / float(H);

  size(W, H, P2D);
  buf = createGraphics(W, H, P2D);
  colorMode(RGB, 1.0);

  R = H;

  textureMode(NORMAL);
  PImage tex = loadImage("tex/ditherflare512.png");

  bufq = createShape();
  bufq.beginShape();
  bufq.noStroke();
  bufq.texture(tex);
  float w = 1.0;
  bufq.vertex(0, 0, -aspect*w, -w);
  bufq.vertex(0, 1, -aspect*w,  w);
  bufq.vertex(aspect, 1,  aspect*w,  w);
  bufq.vertex(aspect, 0,  aspect*w, -w);
  bufq.endShape(CLOSE);
}

void reloadShader() {
  try {
    PShader new_frag = loadShader("jtrap.frag");
    new_frag.set("C", Cr, Ci);
    println("--- SHADER OK --------");
    frag = new_frag;
  } catch (java.lang.RuntimeException e) {
    println("--- ERROR ------------");
    println(e.getMessage());
    println("----------------------");
  }
}

int reload_frame = 1, pmode = 1;
boolean paused = false;
float Cr = -.71, Ci = .22;
float Px = 0.0, Py = 0.0;
float Mx = 0.0, My = 0.0;
float zoom = 1.66;
void draw() {
  if (!paused) {
    if (reload_frame == 0) tint(1.0);
    if (reload_frame == 1) reloadShader();
    if (reload_frame >= 1) {
      tint(0.5);
      reload_frame--;
    }

    if (pmode == 1) {
      Cr = lerp(-2.0, 1.0, (1.0 * mouseX) / width);
      Ci = lerp(-1.5, 1.5, (1.0 * mouseY) / height);
    }
    if (pmode == 2) {
      Px = lerp(-2.5, 2.5, (1.0 * mouseX) / width);
      Py = lerp(-2.5, 2.5, (1.0 * mouseY) / height);
    }

    frag.set("C", Cr, Ci);
    frag.set("P", Px, Py);
    frag.set("M", Mx, My);
    frag.set("zoom", zoom);
    buf.beginDraw();
    buf.shader(frag);
    buf.scale(R);
    buf.shape(bufq);
    buf.endDraw();
    image(buf, 0, 0);
  }
}

void mouseWheel(MouseEvent event) {
  float e = event.getCount();
  float factor = pow(1.09, e);
  // calc mouse location in complex plane
  float x = zoom * lerp(-2.0, 2.0, (1.0 * mouseX) / width) + Mx;
  float y = zoom * lerp(-1.0, 1.0, (1.0 * mouseY) / height) + My;
  // calc new centre point P
  float drag = 1.333; // 1.0 = zoom around mouse loc, >1 = drag to centre
  Mx = (Mx - x) * pow(factor, drag) + x;
  My = (My - y) * pow(factor, drag) + y;
  // adjust zooom
  zoom *= factor;
  println(nfs(Mx,1,4),nfs(My,1,4),nfs(Cr,1,4),nfs(Ci,1,4),nfs(zoom,4,5));
}

void keyReleased() {
  if (keyCode == 82 /* R */) {
    reload_frame = 2;
  } else if (keyCode == 90 /* Z */) {
    Mx = 0.0;
    My = 0.0;
    zoom = 1.0;
  } else if (keyCode == 80 /* P */) {
    paused = !paused;
  } else if (keyCode == 70 /* F */) {
    pmode = 0;
  } else if (keyCode == 67 /* C */) {
    pmode = 1;
  } else if (keyCode == 86 /* V */) {
    pmode = 2;
  } else if (keyCode == 83 /* S */) {
    int mul = 5;
    PGraphics pg = createGraphics(mul * width, mul * height, P2D);
    pg.beginDraw();
    pg.shader(frag);
    pg.scale(R * mul);
    pg.shape(bufq);
    pg.save("/tmp/tmp.png");
    pg.endDraw();

    pg.beginDraw();
    pg.shader(frag);
    pg.scale(R * mul);
    pg.shape(bufq);
    pg.save("/tmp/jtrap"+nf(int(random(99999)), 5)+".png");
    pg.endDraw();
  }
}
