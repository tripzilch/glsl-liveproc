import java.util.Arrays;

Julia julia;
PGraphics buf;

static final double TAU = 6.283185307179586;
static final double igamma = 2.2, gamma = 1.0 / igamma;

static final float W = 720, H = 480;
static final int Wi = (int) W, Hi = (int) H;

void settings() {
  size(Wi, Hi, P2D);  
}

void setup() {
  colorMode(RGB, 1.0);
  buf = createGraphics(width, height, P2D);
  julia = new Julia("pathtrace.frag", "tex/old-industrial-hall4k.jpg");

  println(timestamp(), " ==== LIVEPROC == ", width + "x" + height, " ===");
  println(" ------ ");

// Vec3 p = new Vec3(0.,  0.,  1.);
// Vec3 q = new Vec3(1.,  2.,  3.);
// Vec3 r = new Vec3(5.,  8., 13.);
// println(p);
// println(q);
// println(r);
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
        new_frag.set("count", count);
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
    void set(String k, Vec3 v) {      
      this.frag.set(k, (float) v.x, (float) v.y, (float) v.z);
      this.par.setJSONArray(k, JSONFromFloats((float) v.x, (float) v.y, (float) v.z));
    }

    void render(PGraphics buf, float x0, float y0, float x1, float y1) {
      float W = buf.width, H = buf.height;
      this.frag.set("buf_size", W, H);
      this.frag.set("tex_size", float(tex.width), float(tex.height));
      this.frag.set("tile_rect", x0, y1, x1, y1);
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
      // renders the i-th tile of the buffer subdivided in xn columns and yn rows.
      int xi = i % xn, yi = i / xn;
      float xs = (float) buf.width / (float) xn;
      float ys = (float) buf.height / (float) yn;
      this.render(buf, xs * xi, ys * yi, xs * (xi + 1.0), ys * (yi + 1.0));
    }

}


Vec3 camera_pos = new Vec3(0.0, 2.5, -50.0);
double camera_xa = 0.0;
double camera_ya = 0.0;

Vec3 uu() { return (new Vec3(1.,  0.,  0.)).rotX(camera_xa).rotY(camera_ya); }
Vec3 vv() { return (new Vec3(0., -1.,  0.)).rotX(camera_xa).rotY(camera_ya); }
Vec3 ww() { return (new Vec3(0.,  0.,  1.)).rotX(camera_xa).rotY(camera_ya); }

int reload_frame = 1;
boolean paused = false, dirty = true;
int not_dirty_count = 0, count = 0, subs = 1, tile_i = 0;
int n_tiles = 1;
int[] acc_buf = new int[Wi * Hi * 3];
int acc_n = 0;

double prof_time = 0.0;

void draw() {
  double now = millis() / 1000.0;
  if (focused && !paused) {
    surface.setTitle("Pathtracer@" + nf(frameRate, 2, 1) + "fps ");
    count += 1;
    if (reload_frame == 0) { tint(1.0); }
    if (reload_frame == 1) { julia.reloadFrag(); dirty = true; }
    if (reload_frame >= 1) { tint(0.5); reload_frame--; }

    if (keyPressed && key == 'w' /* 70 */) {
      camera_pos.addmul(ww(), 0.25); dirty = true;
    } else if (keyPressed && key == 's' /* 70 */) {
      camera_pos.addmul(ww(), -0.25); dirty = true;
    } else if (keyPressed && key == 'a' /* 67 */) {
      camera_pos.addmul(uu(), -0.25); dirty = true;
    } else if (keyPressed && key == 'd' /* 86 */) {
      camera_pos.addmul(uu(), 0.25); dirty = true;
    }

    if (dirty) {
      acc_n = 0;
      Arrays.fill(acc_buf, 0);
    }

    julia.set("N_SAMPLES", 64);
    julia.set("count", (float) count);
    julia.set("alpha", 1.0);
    julia.set("camera_pos", camera_pos);
    julia.set("uu", uu());
    julia.set("vv", vv());
    julia.set("ww", ww());
    double before = millis() / 1000.0;    
    julia.render(buf, 1, 1, 0);
    buf.loadPixels();        
    prof_time += millis() / 1000.0 - before;
    loadPixels();
    acc_n++;
    dirty = false;
    double ndiv = 255. / acc_n;
    for (int i = 0, j = 0; i < Wi * Hi; i++) {
      int c = buf.pixels[i];
      int b = (acc_buf[j++] += c & 0xff);
      c >>= 8;
      int g = (acc_buf[j++] += c & 0xff);
      c >>= 8;
      int r = (acc_buf[j++] += c & 0xff);
      // float r = ndiv * Math.sqrt(acc_buf[j++] += (c & 0x00ff0000) / (256. * 256. * 255.));
      // float g = ndiv * Math.sqrt(acc_buf[j++] += (c & 0x0000ff00) / (256. * 255.));
      // float b = ndiv * Math.sqrt(acc_buf[j++] += (c & 0x000000ff) / 255.);
      // pixels[i] = 0xff000000 | 
      //   | (((int) b));
      //   | (((int) g) << 8)
      //   | (((int) r) << 16)        
      pixels[i] = ((((0xff00 
                    | SquareRoot.fastSqrt(r * 255 / acc_n)) << 8) 
                    | SquareRoot.fastSqrt(g * 255 / acc_n)) << 8) 
                    | SquareRoot.fastSqrt(b * 255 / acc_n);
      // sqrt(r) * 255 / sqrt(255 * N)
      // sqrt(r * 255 / N)
    }
    if (frameCount % 256 == 0) {
      println("prof_time: ", 1000 * prof_time / 256, "ms");
      prof_time = 0.0;
    }
    updatePixels();
    //image(buf, 0, 0, W, H);
    // not_dirty_count++;
    // boolean dirty_now = dirty || (pmouseX != mouseX) || (pmouseY != mouseY);
    // dirty = false;
    // if (dirty_now) not_dirty_count = 0;

//    if (not_dirty_count == 0) {
//      subs = 1; n_tiles = subs * subs;
//      tile_i = 0;
//    } else if (tile_i < subs * subs) {
//      tile_i++;
//    } else if (subs > 0 && subs < 8) {
//      subs *= 2; n_tiles = subs * subs;
//      tile_i = 0;
//    } else {
//      subs = 0;
//    }
//
//    julia.set("N_SAMPLES", (n_tiles + 4) * 64);
//    if (subs > 0) {
//      julia.render(buf, subs, subs, tile_i);
//      image(buf, 0, 0, W, H);
//    }
  }
}

String timestamp() {
  return nf(year(), 4) + "-" + nf(month(), 2) + "-" + nf(day(), 2) + "_" +nf(hour(), 2) + "." +nf(minute(), 2) + "." + nf(second(), 2);
}

void mouseWheel(MouseEvent event) {
  float e = event.getCount();
  // adjustZoom(e);
  // dirty = true;
}

float pan_x=0, pan_y=0;
void mousePressed(MouseEvent event) {
  float W = width, H = height;
  pan_x = (2 * mouseX - W) / H;
  pan_y = (2 * mouseY - H) / H;
}
void mouseDragged(MouseEvent event) {
  float W = width, H = height;
  float px = (2 * mouseX - W) / H;
  float py = (2 * mouseY - H) / H;
  float dx = px - pan_x;
  float dy = py - pan_y;
  // process dx,dy
  camera_ya = (camera_ya + TAU + 1.0 * dx) % TAU;
  camera_xa = (camera_xa + TAU + 1.0 * dy) % TAU;
  // println("cxa = " + camera_xa + " cya = " + camera_ya);
  // println("dx, dy = " + dx + ", " + dy);
  pan_x = px;
  pan_y = py;
}

void reloadTexture(File f) { julia.loadTexture(f.getAbsolutePath()); }

void keyPressed() {
  dirty = true;
  if (keyCode == 'R' /* 82 */) {
    reload_frame = 2;
  } else if (keyCode == 'Q' /* 82 */) {
    exit();
  } else if (keyCode == 'L' /* 76 */) {
    useNativeSelect = true;
    selectInput("Select a texture to load (PNG/JPG):", "reloadTexture");
  } else if (keyCode == 'Z' /* 90 */) {
  } else if (keyCode == 'P' /* 80 */) {
    paused = !paused;
    println(julia.par.format(4));
    println(nf(frameRate, 2, 1) + "fps -- " + nf(frameCount, 3) + " frames");
  } else if (keyCode == 'O' /* 83 */) {
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
    // julia.set("N_SAMPLES", 64);
    int subs = 10, tile_i = 0;
    int n_tiles = subs * subs;
    print(n_tiles, "tiles.. ");
    for (int i = 0; i < n_tiles; i++) {
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
