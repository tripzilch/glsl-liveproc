
Julia julia;
PGraphics buf_hi, buf_lo, buf;

void setup() {
  size(960, 480, P2D);
  colorMode(RGB, 1.0);

/*  textureMode(NORMAL);  // unsure if needed
  noStroke();           // unsure if needed*/

  buf_hi = createGraphics(width, height, P2D);
  buf_lo = createGraphics(width / 2, height / 2, P2D);
  buf = buf_lo;

  julia = new Julia("julia-woink2.frag", "tex/woink2.png");

  println(timestamp(), " ==== LIVEPROC == ", width + "x" + height, " ===");
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
      try {
        PShader new_frag = loadShader(frag_path);
        new_frag.set("zoom", zoom);
        if (new_frag != null) {
          this.frag = new_frag;
          this.frag_path = frag_path;
          this.par.setString("frag_path", frag_path);
          println(timestamp(), " === SHADER OK == ", frag_path);
        }
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
      julia.set("pix_size", 2 * (x1 - x0) / buf.width, 2 * (y1 - y0) / buf.height);
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

int reload_frame = 1, pmode = 1;
boolean paused = false, dirty = true;
int dirty_counter = 0;
float count = 0.0;
float Cr = -.7709787, Ci = -.08545, OCr = 0, OCi = 0;
float Px = 0.0, Py = 0.0;
float Mx = 0.0, My = 0.0, bw_threshold = 0.5;
float zoom = 2.0, tzoom = 1.0, czoom = 1.0, tangle = 0.0;
float min_iter = 0;

void draw() {
  float W = width, H = height;
  double now = millis() / 1000.0;
  if (focused && !paused) {
    count += 1.0;
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
    julia.set("bw_threshold", bw_threshold);
    julia.set("count", count);
    julia.set("alpha", 1.0);
    julia.set("jitter_amount", 1.0 / buf.height);

    boolean dirty_now = dirty || (pmouseX != mouseX) || (pmouseY != mouseY);
    dirty = false;
    if (!dirty_now) {
      dirty_counter++;
      julia.set("alpha", 4.0 / (dirty_counter + 4));
    } else {
      dirty_counter = 0;
    }
    julia.render(buf);
    image(buf, 0, 0, W, H);
  }
}

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
    zoom = 1.0;
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
  } else if (keyCode == 'S' /* 83 */) {
    int mul = 5;
    PGraphics pg = createGraphics(mul * width, mul * height, P2D);
    String filename = "qtrap_" + timestamp();
    String json_filename = "save/" + filename + ".json";
    String image_filename = "/tmp/" + filename + ".png";

    println(timestamp(), " === writing", json_filename);
    julia.par.setString("timestamp", timestamp());
    saveJSONObject(julia.par, json_filename);

    println(timestamp(), " === RENDERING *" + mul + " @ " + pg.width + "x" + pg.height);
    for (int i = 0; i < mul * mul; i++) {
      print("block", i, "/", mul * mul, "   ");
      print("pass ");
      // a/d = 4
      // a/(d+7) = 1
      //
      // a = d+7
      // 7/3 = d
      julia.set("pix_size", 1.0 / pg.height, 1.0 / pg.height);
      for(int pass = 0; pass < 12; pass++) {
        print(pass + ", ");
        julia.set("jitter_amount", (16.0 / (5.0 + pass)) / pg.height);
        julia.set("count", pass);
        julia.set("alpha", 1.0 / (pass + 1));
        julia.render(pg, mul, mul, i);
      }
      pg.loadPixels();
      println("L");
    }
    //println(timestamp(), " === Loading pixels.. ");
    println(timestamp(), " === writing", image_filename, "...");
    pg.save(image_filename);
    println(timestamp(), " === done. ");
  }
}
