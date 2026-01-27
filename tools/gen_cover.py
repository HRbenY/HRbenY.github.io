from PIL import Image, ImageDraw, ImageFont
import math, hashlib, random
import os

def stable_color(s: str):
    h = hashlib.sha256(s.encode("utf-8")).digest()
    r, g, b = h[0], h[1], h[2]
    r = int(35 + (r/255)*135)
    g = int(35 + (g/255)*135)
    b = int(35 + (b/255)*135)
    return (r,g,b)

def contrasting_text(bg):
    r,g,b = bg
    lum = 0.2126*r + 0.7152*g + 0.0722*b
    return (245,245,245) if lum < 115 else (25,25,25)

TOOLS_DIR = os.path.dirname(__file__)
REPO_DIR = os.path.abspath(os.path.join(TOOLS_DIR, os.pardir))
DEFAULT_FONT_PATH = os.path.join(REPO_DIR, "assets", "fonts", "MapleMono-NF-CN-Regular.ttf")
FALLBACK_FONT_PATHS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "C:\\Windows\\Fonts\\msyh.ttc",
    "C:\\Windows\\Fonts\\arial.ttf",
]

def _resolve_font_path(bold=False, font_path=None, font_path_bold=None):
    candidates = []
    if bold and font_path_bold:
        candidates.append(font_path_bold)
    if font_path:
        candidates.append(font_path)
    if os.path.exists(DEFAULT_FONT_PATH):
        candidates.append(DEFAULT_FONT_PATH)
    candidates.extend(FALLBACK_FONT_PATHS)
    for path in candidates:
        if path and os.path.exists(path):
            return path
    return None

def pick_font(size, bold=False, font_path=None, font_path_bold=None):
    path = _resolve_font_path(bold=bold, font_path=font_path, font_path_bold=font_path_bold)
    if path:
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            pass
    return ImageFont.load_default()

def measure_tags(draw, tags, font):
    widths = [draw.textlength(t, font=font) for t in tags]
    # approximate height via bbox of representative
    bbox = draw.textbbox((0,0), max(tags, key=len) if tags else "#tag", font=font)
    h = bbox[3]-bbox[1]
    return widths, h

def draw_tag_unit(draw, x, y, tags, widths, font, fill, gap_px):
    """Draw tags sequentially with exact pixel gap, return unit width."""
    cx = x
    for t, w in zip(tags, widths):
        draw.text((cx, y), t, font=font, fill=fill)
        cx += w + gap_px
    unit_w = sum(widths) + gap_px*(len(tags)-1 if len(tags)>0 else 0)
    return unit_w

def generate_cover_v4(title, tags, out_path, size=(1200,630), angle_deg=-15,
                      gap_px=34, vgap=70, font_path=None, font_path_bold=None,
                      render_scale=1):
    """
    gap_px: ONE gap value used everywhere horizontally:
            - between tags inside unit
            - between units
    vgap: vertical spacing between rows
    """
    W,H = size
    base_w, base_h = 1200, 630
    layout_scale = min(W / base_w, H / base_h)
    render_scale = max(1, int(render_scale))
    draw_scale = layout_scale * render_scale
    DW,DH = int(round(W * render_scale)), int(round(H * render_scale))
    gap_px = int(round(gap_px * draw_scale))
    vgap = int(round(vgap * draw_scale))
    main = tags[0] if tags else "#tag"
    bg = stable_color(main)
    fg = contrasting_text(bg)

    img = Image.new("RGBA", (DW,DH), bg + (255,))

    pad = int(max(DW,DH)*0.7)
    PW,PH = DW+pad*2, DH+pad*2
    pat = Image.new("RGBA", (PW,PH), (0,0,0,0))
    dpat = ImageDraw.Draw(pat)

    seed = int(hashlib.md5((title+"|"+",".join(tags)).encode("utf-8")).hexdigest()[:8], 16)
    rnd = random.Random(seed)

    base_font_size = int(round(40 * draw_scale))
    pat_font = pick_font(base_font_size, bold=True, font_path=font_path, font_path_bold=font_path_bold)

    if not tags:
        tags = ["#tag"]

    widths, text_h = measure_tags(dpat, tags, pat_font)

    # exact unit width based on real widths + exact pixel gaps
    unit_w = sum(widths) + gap_px*(len(tags)-1)
    unit_h = text_h

    # IMPORTANT: external unit-to-unit gap is the same gap_px
    step_x = unit_w + gap_px
    step_y = unit_h + vgap

    pat_col = (fg[0], fg[1], fg[2], 22)  # subtle

    cols = math.ceil(PW / step_x) + 5
    rows = math.ceil(PH / step_y) + 5

    stagger = step_x * 0.45  # visual interest; spacing still uniform because step_x fixed

    for j in range(rows):
        y = j*step_y + rnd.randint(-2,2)
        row_offset = stagger if (j%2==1) else 0
        for i in range(cols):
            x = i*step_x + row_offset + rnd.randint(-3,3)
            draw_tag_unit(dpat, x, y, tags, widths, pat_font, pat_col, gap_px)

    pat = pat.rotate(angle_deg, resample=Image.Resampling.BICUBIC, expand=False)
    img.alpha_composite(pat, dest=(-pad, -pad))

    overlay = Image.new("RGBA", (DW,DH), (0,0,0,35))
    img = Image.alpha_composite(img, overlay)

    d = ImageDraw.Draw(img)
    margin = int(round(72 * draw_scale))
    title_font = pick_font(int(round(64 * draw_scale)), bold=True, font_path=font_path, font_path_bold=font_path_bold)
    small_font = pick_font(int(round(30 * draw_scale)), bold=False, font_path=font_path, font_path_bold=font_path_bold)
    shadow_offset = int(round(2 * draw_scale))

    def wrap_text(text, font, max_w):
        lines, cur = [], ""
        for ch in list(text):
            test = cur + ch
            if d.textlength(test, font=font) <= max_w:
                cur = test
            else:
                if cur:
                    lines.append(cur)
                cur = ch
        if cur:
            lines.append(cur)
        return lines

    lines = wrap_text(title, title_font, DW - margin*2)[:3]
    line_h = int(round(title_font.size * 1.18))
    y0 = int(round(DH*0.36 - (line_h*len(lines))/2))

    def center_x(text, font):
        bbox = d.textbbox((0,0), text, font=font)
        text_w = bbox[2] - bbox[0]
        return int((DW - text_w) / 2)

    shadow = (0,0,0,120) if fg==(245,245,245) else (255,255,255,90)
    for idx, line in enumerate(lines):
        x, y = center_x(line, title_font), y0 + idx*line_h
        d.text((x+shadow_offset,y+shadow_offset), line, font=title_font, fill=shadow)
        d.text((x,y), line, font=title_font, fill=fg + (255,))

    tags_text = "  ".join(tags[:6])
    tags_x = center_x(tags_text, small_font)
    tags_y = y0 + line_h*len(lines) + int(round(18 * draw_scale))
    d.text((tags_x, tags_y), tags_text,
           font=small_font, fill=(fg[0],fg[1],fg[2],220))

    img_rgb = img.convert("RGB")
    if render_scale > 1:
        img_rgb = img_rgb.resize((W, H), resample=Image.Resampling.LANCZOS)
    img_rgb.save(out_path, "PNG")
    return img_rgb

if __name__ == "__main__":
    out_path4 = os.path.join(REPO_DIR, "hexo_cover_demo_v4_equal_gap.png")
    generate_cover_v4(
        title="Tag Grid Demo",
        tags=["#lang/cpp", "#topic/transformer"],
        out_path=out_path4,
        angle_deg=-15,
        gap_px=38,
        vgap=70,
        font_path=DEFAULT_FONT_PATH,
        font_path_bold=DEFAULT_FONT_PATH,
        render_scale=1,
    )
    print(out_path4)

