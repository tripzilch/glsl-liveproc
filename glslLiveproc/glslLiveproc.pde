PImage tex;
PShader frag;
PShape bufq;
PGraphics buf;
int R;
float aspect;

void setup() {
  int W = 768, H = 512;
  aspect = float(W) / float(H);

  size(W, H, P2D);
  buf = createGraphics(W, H, P2D);
  colorMode(RGB, 1.0);

  R = H;

  textureMode(NORMAL);
  PImage tex = loadImage("tex/botter1615k.png");

  bufq = createShape();
  bufq.beginShape();
  bufq.noStroke();
  bufq.texture(tex);
  bufq.vertex(0, 0, -aspect, -1);
  bufq.vertex(0, 1, -aspect,  1);
  bufq.vertex(aspect, 1,  aspect,  1);
  bufq.vertex(aspect, 0,  aspect, -1);
  bufq.endShape(CLOSE);

  println("==== LIVEPROC ==", timestamp());
  println("SIZE = (", W, ",", H, ")");
}

String timestamp() {
  return nf(year(), 4) + "-" + nf(month(), 2) + "-" + nf(day(), 2) + "_" +nf(hour(), 2) + "." +nf(minute(), 2) + "." + nf(second(), 2);
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

void reloadTexture(File f) {
  if (f == null) return;
  try {
    PImage new_tex = loadImage(f.getAbsolutePath());
    tex = new_tex;
      bufq = createShape();
      bufq.beginShape();
      bufq.noStroke();
      bufq.texture(tex);
      bufq.vertex(0, 0, -aspect, -1);
      bufq.vertex(0, 1, -aspect,  1);
      bufq.vertex(aspect, 1,  aspect,  1);
      bufq.vertex(aspect, 0,  aspect, -1);
      bufq.endShape(CLOSE);
    println("--- TEXTURE OK --------");
  } catch (java.lang.RuntimeException e) {
    println("--- TEX LOAD ERROR ----");
    println(e.getMessage());
    println("-----------------------");
  }
}

int reload_frame = 1, pmode = 1;
boolean paused = false;
float Cr = -.71, Ci = .22, OCr = 0, OCi = 0;
float Px = 0.0, Py = 0.0;
float Mx = 0.0, My = 0.0;
float zoom = 2.0, tzoom = 1.0, czoom = 1.0;
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
      Px = 2.0 * lerp(-aspect, aspect, (1.0 * mouseX) / width);
      Py = 2.0 * lerp(-1.0, 1.0, (1.0 * mouseY) / height);
      // Px = lerp(-2.5, 2.5, (1.0 * mouseX) / width);
      // Py = lerp(-2.5, 2.5, (1.0 * mouseY) / height);
    }

    frag.set("C", OCr + czoom * Cr, OCi + czoom * Ci);
    frag.set("P", Px, Py);
    frag.set("M", Mx, My);
    frag.set("zoom", zoom);
    frag.set("tzoom", tzoom);
    frag.set("time", millis() * 0.001);


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
  adjustZoom(e);
}

void adjustZoom(float e) {
  float factor = pow(1.09, e);
  // calc mouse location in complex plane
  float x = zoom * lerp(-aspect, aspect, (1.0 * mouseX) / width) + Mx;
  float y = zoom * lerp(-1.0, 1.0, (1.0 * mouseY) / height) + My;
  // calc new centre point P
  float drag = 1.333; // 1.0 = zoom around mouse loc, >1 = drag to centre
  Mx = (Mx - x) * pow(factor, drag) + x;
  My = (My - y) * pow(factor, drag) + y;
  // adjust zooom
  zoom *= factor;
  println(nfs(Mx,1,4),nfs(My,1,4),nfs(Cr,1,4),nfs(Ci,1,4),nfs(zoom,4,5));
}

void adjustCZoom(float e) {
  float factor = pow(2.0, e);
  OCr -= (factor - 1) * czoom * Cr;
  OCi -= (factor - 1) * czoom * Ci;
  czoom *= factor;
}

void keyReleased() {
  if (keyCode == 'R' /* 82 */) {
    reload_frame = 2;
  } else if (keyCode == 'L' /* 76 */) {
    selectInput("Select a texture to load (PNG/JPG):", "reloadTexture");
  } else if (keyCode == 'Z' /* 90 */) {
    Mx = 0.0;
    My = 0.0;
    zoom = 2.0;
    tzoom = 1.0;
    Cr = OCr + czoom * Cr;
    Ci = OCi + czoom * Ci;
    OCr = OCi = 0.0;
    czoom = 1.0;
  } else if (keyCode == '[' /* 91 */) {
    tzoom *= 1.05;
  } else if (keyCode == ']' /* 93 */) {
    tzoom /= 1.05;
  } else if (keyCode == '-' /* 45 */) {
    adjustZoom(0.3);
  } else if (keyCode == '=' /* 61 */) {
    adjustZoom(-0.3);
  } else if (keyCode == '9') {
    adjustCZoom(1.0);
  } else if (keyCode == '0') {
    adjustCZoom(-1.0);
  } else if (keyCode == 'P' /* 80 */) {
    paused = !paused;
  } else if (keyCode == 'F' /* 70 */) {
    pmode = 0;
  } else if (keyCode == 'C' /* 67 */) {
    pmode = 1;
  } else if (keyCode == 'V' /* 86 */) {
    pmode = 2;
  } else if (keyCode == 'S' /* 83 */) {
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
    pg.save("/home/ritz/gfx/botter-images/2015 jaarboek/frac/btrap_" + timestamp() + ".png");
    pg.endDraw();
  }
}
