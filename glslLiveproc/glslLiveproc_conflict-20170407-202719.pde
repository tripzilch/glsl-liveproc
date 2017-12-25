
Julia julia;
PGraphics buf_hi, buf_lo, buf;

void setup() {
  size(1280, 720, P2D);
  colorMode(RGB, 1.0);

/*  textureMode(NORMAL);  // unsure if needed
  noStroke();           // unsure if needed*/ // unsure if needed! //

  buf_hi = createGraphics(width, height, P2D);
  buf_lo = createGraphics(width / 2, height / 2, P2D);
  buf = buf_hi; // buf_lo;

  julia = new Julia("j-trap-Xblend-nsample.frag", "tex/eyes2048.png");

  println(timestamp(), " ==== LIVEPROC == ", width + "x" + height, " ===");
  println(" ------ Commands:");
  println("          c   Mode C, adjust C parameter with mouse");
  println("          v   Mode V, adjust texture position with mouse");
  println("          f   Mode F, adjust nothing, \"freeze\", for panning and zooming");
  println("        [ ]   decrease/increase texture zoom factor");
  println("        ; '   increase/decrease bw_threshold (not used in most shaders)");
  println("        , .   rotate texture right/left");
  println("        - =   fine adjust zoom");
  println("        7 8   decrease/increase min_iter");
  println("        9 0   decrease/increase \"C zoom\" (finer precision on C parameter)");
  println(" mouse drag   pan ");
  println("scrollwheel   zoom");
  println("          z   reset zoom factors");
  println("          r   reload + recompile fragment shader from disk");
  println("          h   switch between hi/lo resolution renderbuffer");
  println("          s   save image in extra high resolution to /tmp, save parameters as JSON to ./save");
  println("          p   pause all rendering and output current parameters to stdout");
  println("          l   select + load new texture (JPG or PNG)");

}

class Julia {

    String frag_path = "safe.frag";
    PShader frag = loadShader(frag_path);
    String tex_path;
    PImage tex;
    JSONObject par;

    Julia (String frag_path, String tex_path) {
      par = new JSONObject();
      this.loadFrag(frag_path);
      this.loadTexture(tex_path);
    }

    void loadTexture(File f) { this.loadTexture(f.getAbsolutePath()); }
    void loadTexture(String tex_path) {
      this.tex = loadImage(tex_path);
      this.tex_path = tex_path;
      this.par.setString("tex_path", tex_path);
    }

    void loadFrag(String frag_path) {
      this.frag_path = frag_path;
      this.par.setString("frag_path", frag_path);
      try {
        PShader new_frag = loadShader(frag_path);
        PGraphics test_buf = createGraphics(32, 32, P2D);
        new_frag.set("zoom", zoom);
        test_buf.shader(new_frag);
        this.frag = new_frag;
        println(timestamp(), " === SHADER OK == ", frag_path);
      } catch (java.lang.RuntimeException e) {
        println(timestamp(), " === SHADER ERROR == ", frag_path);
        println(e.getMessage());
        println("== === === === === === ==");
      }
    }
    void reloadFrag() { this.loadFrag(this.frag_path); }

    private JSONArray JSONFromFloats(float... x) {
      FloatList lx = new FloatList(x);
      return new JSONArray(lx);
    }

    void set(String k, int x) {
      this.frag.set(k, x);
      this.par.setInt(k, x);
    }
    void set(String k, float x) {
      this.frag.set(k, x);
      this.par.setFloat(k, x);
    }
    void set(String k, float x, float y) {
      this.frag.set(k, x, y);
      this.par.setJSONArray(k, JSONFromFloats(x, y));
    }
    void set(String k, float x, float y, float z) {
      this.frag.set(k, x, y, z);
      this.par.setJSONArray(k, JSONFromFloats(x, y, z));
    }

    void render(PGraphics buf, float x0, float y0, float x1, float y1) {
      float W = buf.width, H = buf.height;
      buf.beginDraw();
        buf.shader(frag);
        buf.noStroke();
        buf.textureMode(NORMAL);
        buf.beginShape();
          buf.texture(tex);
          buf.vertex(x0, y0, (2 * x0 - W) / H, (2 * y0 - H) / H);
          buf.vertex(x0, y1, (2 * x0 - W) / H, (2 * y1 - H) / H);
          buf.vertex(x1, y1, (2 * x1 - W) / H, (2 * y1 - H) / H);
          buf.vertex(x1, y0, (2 * x1 - W) / H, (2 * y0 - H) / H);
        buf.endShape(CLOSE);
      buf.endDraw();
    }
    void render(PGraphics buf) {
      // renders whole buffer
      this.render(buf, 0, 0, buf.width, buf.height);
    }

    void render(PGraphics buf, int xn, int yn, int i) {
      // renders the i-th block of the buffer subdivided in xn columns and yn rows.
      int xi = i % xn, yi = i / xn;
      float xs = (float) buf.width / (float) xn;
      float ys = (float) buf.height / (float) yn;
      this.render(buf, xs * xi, ys * yi, xs * (xi + 1.0), ys * (yi + 1.0));
    }

}

int reload_frame = 1, pmode = 0;
boolean paused = false, dirty = true;
int not_dirty_count = 0, count = 0, subs = 1, sub_i = 0;
float Cr = 0.38276052,
      Ci = -0.05781254,
      min_iter = 0,
      zoom = 0.8711997270584106,
      Mx = 0.084953114,
      My = 0.01834692,
      Px = 0.0,
      Py = 0.0,
      tangle = 0.0,
      bw_threshold = 0.5,
      dissolve = 0.5,
      tzoom =  1.0,
      czoom = 1.0,
      OCr = 0, OCi = 0;
int   n_samples = 1;

void draw() {
  float W = width, H = height;
  double now = millis() / 1000.0;
  if (focused && !paused) {
    count += 1;
    if (reload_frame == 0) { tint(1.0); }
    if (reload_frame == 1) { julia.reloadFrag(); dirty = true; }
    if (reload_frame >= 1) { tint(0.5); reload_frame--; }

    if (pmode == 1) {
      Cr = lerp(-2.2, 1.2, (1.0 * mouseX) / W);
      Ci = lerp(-1.5, 1.5, (1.0 * mouseY) / H);
    }
    if (pmode == 2) {
      Px = 3 * (2.0 * mouseX - W) / H;
      Py = 3 * (2.0 * mouseY - H) / H;
    }

    julia.set("C", OCr + czoom * Cr, OCi + czoom * Ci);
    julia.set("P", Px, Py);
    julia.set("min_iter", min_iter);
    julia.set("M", Mx, My);
    julia.set("zoom", zoom);
    julia.set("tex_angle", tangle);
    julia.set("tex_zoom", tzoom);
    julia.set("count", (float) count);
    julia.set("alpha", 1.0);
    julia.set("jitter_amount", 0.5 / buf.height);

    not_dirty_count++;
    boolean dirty_now = dirty || (pmouseX != mouseX) || (pmouseY != mouseY);
    dirty = false;
    if (dirty_now) not_dirty_count = 0;

    buf = buf_hi;
    julia.set("N_SAMPLES", 32);
    julia.render(buf);
    image(buf, 0, 0, W, H);

  }
}

//    // adaptive subdivs
//    if (not_dirty_count == 0) {
//      buf = buf_lo;
//      subs = 1; n_samples = subs * subs;
//      sub_i = 0;
//      println("");
//      print("LO N = ", subs * subs);
//    } else if (not_dirty_count == 1) {
//      buf = buf_hi;
//      subs = 1; n_samples = subs * subs;
//      sub_i = 0;
//      print("|| HI N = ", subs * subs);
//    } else if (sub_i < subs * subs) {
//      sub_i++;
//      print(", ", subs * subs - sub_i);
//    } else if (subs > 0 && subs < 8) {
//      subs *= 2; n_samples = subs * subs;
//      sub_i = 0;
//      print("|| HI N = ", subs * subs);
//    } else {
//      subs = 0;
//    }
//    julia.set("N_SAMPLES", n_samples);
//    if (subs > 0) {
//      julia.render(buf, subs, subs, sub_i);
//      image(buf, 0, 0, W, H);
//    }


String timestamp() {
  return nf(year(), 4) + "-" + nf(month(), 2) + "-" + nf(day(), 2) + "_" +nf(hour(), 2) + "." +nf(minute(), 2) + "." + nf(second(), 2);
}

void mouseWheel(MouseEvent event) {
  float e = event.getCount();
  adjustZoom(e);
  dirty = true;
}

float pix2coord_x(float x) { return zoom * (2.0 * x - width) / height + Mx; }
float pix2coord_y(float y) { return zoom * (2.0 * y - height) / height + My; }

float pan_x=0, pan_y=0, Mx0=0, My0=0;
void mousePressed(MouseEvent event) {
  float W = width, H = height;
  pan_x = pix2coord_x(mouseX);
  pan_y = pix2coord_y(mouseY);
  Mx0 = Mx;
  My0 = My;
}
void mouseDragged(MouseEvent event) {
  float px = pix2coord_x(mouseX), py = pix2coord_y(mouseY); // px = q + mx
  Mx = Mx + pan_x - px;  // mx = mx + panx - q - mx = panx - q
  My = My + pan_y - py;
  pan_x = pix2coord_x(mouseX); // pan_x = px;
  pan_y = pix2coord_y(mouseY); // pan_y = py;
}

void adjustZoom(float e) {
  float factor = pow(1.09, e);
  // calc mouse location in complex plane
  float W = width, H = height;
  float x = pix2coord_x(mouseX);
  float y = pix2coord_y(mouseY);
  //float x = zoom * (2 * mouseX - W) / H + Mx;
  //float y = zoom * (2 * mouseY - H) / H + My;
  // calc new centre point P
  float drag = 1.333; // 1.0 = zoom around mouse loc, >1 = drag to centre
  Mx = (Mx - x) * pow(factor, drag) + x;
  My = (My - y) * pow(factor, drag) + y;
  // adjust zooom
  zoom *= factor;
  //println(nfs(Mx,1,4),nfs(My,1,4),nfs(Cr,1,4),nfs(Ci,1,4),nfs(zoom,4,5));
}

void adjustCZoom(float e) {
  float factor = pow(2.0, e);
  OCr -= (factor - 1) * czoom * Cr;
  OCi -= (factor - 1) * czoom * Ci;
  czoom *= factor;
}

void reloadTexture(File f) { julia.loadTexture(f.getAbsolutePath()); }

void keyPressed() {
  dirty = true;
  if (keyCode == 'R' /* 82 */) {
    reload_frame = 2;
  } else if (keyCode == 'L' /* 76 */) {
    useNativeSelect = true;
    selectInput("Select a texture to load (PNG/JPG):", "reloadTexture");
  } else if (keyCode == 'Z' /* 90 */) {
    Mx = 0.0;
    My = 0.0;
    zoom = 1.5;
    Cr = OCr + czoom * Cr;
    Ci = OCi + czoom * Ci;
    OCr = OCi = 0.0;
    czoom = 1.0;
  } else if (keyCode == '[' /* 91 */) {
    tzoom *= 1.05;
  } else if (keyCode == ']' /* 93 */) {
    tzoom /= 1.05;
  } else if (keyCode == ';' /* 91 */) {
    bw_threshold = 0.9 * bw_threshold + 0.1;
  } else if (keyCode == '\'' /* 93 */) {
    bw_threshold = 0.9 * bw_threshold + 0.0;
  } else if (keyCode == ',' /* 91 */) {
    tangle -= .13;
  } else if (keyCode == '.' /* 93 */) {
    tangle += .16;
  } else if (keyCode == '-' /* 45 */) {
    adjustZoom(0.3);
  } else if (keyCode == '=' /* 61 */) {
    adjustZoom(-0.3);
  } else if (keyCode == '7') {
    min_iter--;
  } else if (keyCode == '8') {
    min_iter++;
  } else if (keyCode == '9') {
    adjustCZoom(1.0);
  } else if (keyCode == '0') {
    adjustCZoom(-1.0);
  } else if (keyCode == 'P' /* 80 */) {
    paused = !paused;
    println(julia.par.format(4));
  } else if (keyCode == 'F' /* 70 */) {
    pmode = 0;
  } else if (keyCode == 'C' /* 67 */) {
    pmode = 1;
  } else if (keyCode == 'V' /* 86 */) {
    pmode = 2;
  } else if (keyCode == 'H' /* 86 */) {
    buf = (buf == buf_lo) ? buf_hi : buf_lo;
    //dissolve = (dissolve > 0.5) ? 0.5 : 1.0;
  } else if (keyCode == 'S' /* 83 */) {
    int mul = 6;
    int W1 = width * mul, H1 = height * mul;
    PGraphics pg = createGraphics(W1, H1, P2D);
    String filename = "qtrap_" + timestamp();
    String json_filename = "save/" + filename + ".json";
    String image_filename = "/tmp/" + filename + ".png";

    println(timestamp(), " === writing", json_filename);
    julia.par.setString("timestamp", timestamp());
    saveJSONObject(julia.par, json_filename);

    println(timestamp(), " === RENDERING *" + mul + " @ " + pg.width + "x" + pg.height);
    julia.set("jitter_amount", 0.5 / pg.height);
    julia.set("alpha", 1.0);
    julia.set("N_SAMPLES", 64);
    int subs = 10, sub_i = 0;
    int blocks = subs * subs;
    print(blocks, "blocks.. ");
    for (int i = 0; i < blocks; i++) {
      print(i, ", ");
      julia.set("count", (float) (i + 23523));
      julia.render(pg, subs, subs, i);
      pg.loadPixels();
    }
    println(timestamp(), " === writing", image_filename, "...");
    pg.save(image_filename);
    println(timestamp(), " === done. ");
  }
}