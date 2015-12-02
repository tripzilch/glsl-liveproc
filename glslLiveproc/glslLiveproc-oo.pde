Julia julia;
PGraphics buf_hi, buf_lo;

void setup() {
  size(768, 512, P2D);
  colorMode(RGB, 1.0);

  textureMode(NORMAL);  // unsure if needed
  noStroke();           // unsure if needed

  buf_hi = createGraphics(width, height, P2D);
  buf_lo = createGraphics(width / 2, height / 2, P2D);

  julia = new Julia("jtrap.frag", "tex/splats3.png");

  println(timestamp(), " ==== LIVEPROC == ", width + "x" + height, " ===");
}

class Julia {
  String frag_path = "safe.frag";
  PShader frag = loadShader("safe.frag");
  String tex_path;
  PImage tex;

  Julia (String frag_path, String tex_path) {
    this.loadShader(frag_path);
    this.loadTexture(tex_path);
  }

  void loadTexture(File f) { this.loadTexture(f.getAbsolutePath()); }
  void loadTexture(String tex_path) {
    this.tex_path = tex_path;
    this.tex = loadImage(tex_path);
  }

  void loadShader(String frag_path) {
    try {
      PShader new_frag = loadShader(frag_path);
      new_frag.set("zoom", zoom);
      println("--- SHADER OK --------");
      if (new_frag != null) {
        this.frag = new_frag;
        this.frag_path = frag_path;
        println(timestamp(), " === SHADER OK == ", frag_path);
      }
    } catch (java.lang.RuntimeException e) {
      println(timestamp(), " === SHADER ERROR == ", frag_path);
      println(e.getMessage());
      println("== === === === === === ==");
    }
  }

  void render(PGraphics buf) {
  }


}

int reload_frame = 1, pmode = 1;
boolean paused = false;
float Cr = -.71, Ci = .22, OCr = 0, OCi = 0;
float Px = 0.0, Py = 0.0;
float Mx = 0.0, My = 0.0;
float zoom = 2.0, tzoom = 1.0, czoom = 1.0;
void draw() {
  double now = millis() / 1000.0;
  if (focused && !paused) {
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
    }

    frag.set("C", OCr + czoom * Cr, OCi + czoom * Ci);
    frag.set("P", Px, Py);
    frag.set("M", Mx, My);
    frag.set("zoom", zoom);
    frag.set("tzoom", tzoom);
    frag.set("time", millis() * 0.001);

    backbuf.beginDraw();
      backbuf.shader(frag);
      backbuf.scale(backbuf.height);
      backbuf.noStroke();
      backbuf.textureMode(NORMAL);
      backbuf.beginShape();
        backbuf.texture(tex);
        backbuf.vertex(0, 0, -aspect, -1);
        backbuf.vertex(0, 1, -aspect,  1);
        backbuf.vertex(aspect, 1,  aspect,  1);
        backbuf.vertex(aspect, 0,  aspect, -1);
      backbuf.endShape(CLOSE);
    backbuf.endDraw();
    image(backbuf, 0, 0, width, height);
  }
}

String timestamp() {
  return nf(year(), 4) + "-" + nf(month(), 2) + "-" + nf(day(), 2) + "_" +nf(hour(), 2) + "." +nf(minute(), 2) + "." + nf(second(), 2);
}

void reloadShader() {
  try {
    PShader new_frag = loadShader(frag_path);
    new_frag.set("C", Cr, Ci);
    println("--- SHADER OK --------");
    if (new_frag != null) frag = new_frag;
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
    if (new_tex != null) {
      tex_path = f.getAbsolutePath();
      tex = new_tex;
    }
    println("--- TEXTURE OK --------");
  } catch (java.lang.RuntimeException e) {
    println("--- TEX LOAD ERROR ----");
    println(e.getMessage());
    println("-----------------------");
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
    useNativeSelect = true;
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
  } else if (keyCode == 'H' /* 86 */) {
    int divisor = (backbuf.height < height) ? 1 : 2;
    backbuf = createGraphics(width / divisor, height / divisor, P2D);
  } else if (keyCode == 'S' /* 83 */) {
    int mul = 5;
    PGraphics pg = createGraphics(mul * width, mul * height, P2D);
    JSONObject par = new JSONObject();
    String filename = "qtrap_" + timestamp();
    String json_filename = "save/" + filename + ".json";
    String image_filename = "/tmp/" + filename + ".png";

    println(timestamp(), " === writing", json_filename);
    par.setString("tex_path", tex_path);
    par.setString("frag_path", frag_path);
    par.setFloat("Cr", OCr + czoom * Cr);
    par.setFloat("Ci", OCi + czoom * Ci);
    par.setFloat("Px", Px);
    par.setFloat("Py", Py);
    par.setFloat("Mx", Mx);
    par.setFloat("My", My);
    par.setFloat("zoom", zoom);
    par.setFloat("tzoom", tzoom);
    saveJSONObject(par, json_filename);

    println("RENDERING *" + mul + " @ " + pg.width + "x" + pg.height);
    pg.beginDraw();
    pg.background(0);
    pg.shader(frag);
    pg.scale(pg.height);
    pg.noStroke();
    pg.textureMode(NORMAL);
    pg.beginShape();
      pg.texture(tex);
      pg.vertex(0, 0, -aspect, -1);
      pg.vertex(0, 1, -aspect,  1);
      pg.vertex(aspect, 1,  aspect,  1);
      pg.vertex(aspect, 0,  aspect, -1);
    pg.endShape(CLOSE);
    print("endshape. ");
    pg.endDraw();
    print("endDraw. ");
    pg.loadPixels();
    print("Loaded pixels. ");
    println(timestamp(), " === writing", image_filename, "...");
    pg.save(image_filename);
    println("done. ");
  }
}
    // println("preRENDERING x" + mul);
    // pg.beginDraw();
    // pg.shader(frag);
    // pg.scale(pg.height);
    // pg.noStroke();
    // pg.textureMode(NORMAL);
    // pg.beginShape();
    //   pg.texture(tex);
    //   pg.vertex(0, 0, -aspect, -1);
    //   pg.vertex(0, 1, -aspect,  1);
    //   pg.vertex(aspect, 1,  aspect,  1);
    //   pg.vertex(aspect, 0,  aspect, -1);
    // pg.endShape(CLOSE);
    // print("endshape. saving tmp ..");
    // pg.save("/tmp/tmp.png");
    // print("done.");
    // pg.endDraw();
    // print("endDraw. saving tmp2 ..");
    // pg.save("/tmp/tmp2.png");
    // println("done.");
