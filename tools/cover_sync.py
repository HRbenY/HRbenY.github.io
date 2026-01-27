import os
import re
import sys
import hashlib

TOOLS_DIR = os.path.dirname(__file__)
ROOT_DIR = os.path.abspath(os.path.join(TOOLS_DIR, os.pardir))
sys.path.insert(0, TOOLS_DIR)

from gen_cover import generate_cover_v4

POSTS_DIR = os.path.join(ROOT_DIR, "source", "_posts")
OUT_DIR = os.path.join(ROOT_DIR, "source", "img", "covers", "auto")
AUTO_URL_PREFIX = "/img/covers/auto/"
FONT_PATH = os.path.join(ROOT_DIR, "assets", "fonts", "MapleMono-NF-CN-Regular.ttf")

IMAGE_SIZE = (2400, 1260)
RENDER_SCALE = 1
ANGLE_DEG = -15
GAP_PX = 38
VGAP = 70
TEMPLATE_VERSION = "v4.3"

KEY_RE = re.compile(r"^([A-Za-z0-9_-]+)\s*:\s*(.*)$")

def split_front_matter(text):
    lines = text.splitlines(keepends=True)
    if not lines or lines[0].strip() != "---":
        return None, text
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return lines[1:i], "".join(lines[i + 1 :])
    return None, text

def strip_quotes(value):
    if value is None:
        return None
    text = value.strip()
    if len(text) >= 2 and text[0] == text[-1] and text[0] in ("'", '"'):
        return text[1:-1]
    return text

def parse_inline_list(value):
    items = []
    raw = value.strip()
    if raw.startswith("[") and raw.endswith("]"):
        inner = raw[1:-1].strip()
        if not inner:
            return items
        for part in inner.split(","):
            item = strip_quotes(part.strip())
            if item:
                items.append(item)
    return items

def index_front_matter(lines):
    keys = {}
    i = 0
    while i < len(lines):
        raw = lines[i].rstrip("\r\n")
        match = KEY_RE.match(raw)
        if not match:
            i += 1
            continue
        key, rest = match.group(1), match.group(2)
        start = i
        if rest.strip():
            end = i + 1
        else:
            j = i + 1
            while j < len(lines):
                next_raw = lines[j].rstrip("\r\n")
                if KEY_RE.match(next_raw):
                    break
                j += 1
            end = j
        keys[key] = (start, end, rest)
        i = end
    return keys

def parse_tags(lines, block):
    start, end, rest = block
    rest = rest.strip()
    if rest:
        inline = parse_inline_list(rest)
        if inline:
            return inline
        return [strip_quotes(rest)]
    tags = []
    for line in lines[start + 1 : end]:
        stripped = line.strip()
        if stripped.startswith("- "):
            tag = strip_quotes(stripped[2:].strip())
            if tag:
                tags.append(tag)
    return tags

def parse_cover_value(rest):
    value = strip_quotes(rest)
    if value is None or value == "":
        return None
    low = value.lower()
    if low in ("false", "null", "none", "~"):
        return False
    return value

def parse_front_matter_data(lines):
    keys = index_front_matter(lines)
    data = {}
    if "title" in keys:
        data["title"] = strip_quotes(keys["title"][2])
    if "tags" in keys:
        data["tags"] = parse_tags(lines, keys["tags"])
    if "cover" in keys:
        data["cover"] = parse_cover_value(keys["cover"][2])
    return data, keys

def update_front_matter(lines, updates):
    keys = index_front_matter(lines)
    new_lines = []
    consumed = set()
    i = 0
    while i < len(lines):
        key_at_i = None
        for key, span in keys.items():
            if span[0] == i:
                key_at_i = key
                break
        if key_at_i:
            if key_at_i in updates:
                value = updates[key_at_i]
                consumed.add(key_at_i)
                i = keys[key_at_i][1]
                if value is None:
                    continue
                new_lines.append(f"{key_at_i}: {value}\n")
                continue
            span = keys[key_at_i]
            new_lines.extend(lines[span[0] : span[1]])
            i = span[1]
            continue
        new_lines.append(lines[i])
        i += 1
    for key, value in updates.items():
        if key in consumed or value is None:
            continue
        new_lines.append(f"{key}: {value}\n")
    return new_lines

def slugify(value):
    text = value.replace("\\", "/")
    text = re.sub(r"[^A-Za-z0-9]+", "-", text)
    return text.strip("-").lower()

def build_cover_filename(post_rel, title, tags):
    slug_base = slugify(post_rel)
    if not slug_base:
        slug_base = "post"
    tag_part = ",".join(tags)
    payload = f"{post_rel}|{title}|{tag_part}|{TEMPLATE_VERSION}"
    digest = hashlib.sha256(payload.encode("utf-8")).hexdigest()[:10]
    return f"{slug_base}-{digest}.png"

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def load_text(path):
    with open(path, "r", encoding="utf-8") as handle:
        return handle.read()

def write_text(path, text):
    with open(path, "w", encoding="utf-8", newline="\n") as handle:
        handle.write(text)

def build_tags_for_image(tags):
    result = []
    for tag in tags:
        if not tag:
            continue
        if tag.startswith("#"):
            result.append(tag)
        else:
            result.append(f"#{tag}")
    return result

def process_post(path, referenced):
    text = load_text(path)
    front_lines, body = split_front_matter(text)
    if front_lines is None:
        return {"skipped": 1}

    data, _ = parse_front_matter_data(front_lines)
    title = data.get("title") or os.path.splitext(os.path.basename(path))[0]
    tags = data.get("tags") or []
    cover = data.get("cover")

    if cover is False:
        return {"skipped": 1}

    is_auto = isinstance(cover, str) and cover.startswith(AUTO_URL_PREFIX)
    if cover and not is_auto:
        return {"skipped": 1}

    post_rel = os.path.relpath(path, POSTS_DIR).replace(os.sep, "/")
    cover_filename = build_cover_filename(post_rel, title, tags)
    cover_url = f"{AUTO_URL_PREFIX}{cover_filename}"
    cover_path = os.path.join(OUT_DIR, cover_filename)
    referenced.add(cover_path)

    updates = {}
    if cover != cover_url:
        updates["cover"] = cover_url

    generated = 0
    if not os.path.exists(cover_path) or cover != cover_url:
        ensure_dir(OUT_DIR)
        image_tags = build_tags_for_image(tags)
        generate_cover_v4(
            title=title,
            tags=image_tags,
            out_path=cover_path,
            size=IMAGE_SIZE,
            angle_deg=ANGLE_DEG,
            gap_px=GAP_PX,
            vgap=VGAP,
            font_path=FONT_PATH,
            font_path_bold=FONT_PATH,
            render_scale=RENDER_SCALE,
        )
        generated = 1

    updated = 0
    if updates:
        new_front = update_front_matter(front_lines, updates)
        new_text = "---\n" + "".join(new_front) + "---\n" + body
        if new_text != text:
            write_text(path, new_text)
            updated = 1

    return {"generated": generated, "updated": updated}

def cleanup_unreferenced(referenced):
    removed = 0
    if not os.path.isdir(OUT_DIR):
        return removed
    for name in os.listdir(OUT_DIR):
        if not name.lower().endswith(".png"):
            continue
        path = os.path.join(OUT_DIR, name)
        if path not in referenced:
            os.remove(path)
            removed += 1
    return removed

def main():
    if not os.path.isdir(POSTS_DIR):
        print(f"cover_sync: posts dir not found: {POSTS_DIR}")
        return 1

    referenced = set()
    counts = {"scanned": 0, "updated": 0, "generated": 0, "skipped": 0}

    for root, _, files in os.walk(POSTS_DIR):
        for filename in files:
            if not filename.lower().endswith(".md"):
                continue
            counts["scanned"] += 1
            path = os.path.join(root, filename)
            result = process_post(path, referenced)
            counts["generated"] += result.get("generated", 0)
            counts["updated"] += result.get("updated", 0)
            counts["skipped"] += result.get("skipped", 0)

    removed = cleanup_unreferenced(referenced)
    print(
        "cover_sync: scanned {scanned}, generated {generated}, updated {updated}, "
        "skipped {skipped}, removed {removed}".format(removed=removed, **counts)
    )
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
