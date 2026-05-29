import os, sys, textwrap, math
from PIL import Image, ImageDraw, ImageFont

try:
    import numpy as np
except ImportError:
    print("Install numpy: pip install numpy")
    sys.exit(1)

try:
    from moviepy import (
        VideoClip,
        AudioClip,
        concatenate_videoclips,
        CompositeVideoClip,
        TextClip,
    )
except ImportError:
    os.system("pip install moviepy")
    from moviepy import (
        VideoClip,
        AudioClip,
        concatenate_videoclips,
        CompositeVideoClip,
        TextClip,
    )


W, H = 1080, 1920
FPS = 30
DURATION_PER_CHAR = 0.12
BG = (10, 10, 15)
FG = (255, 255, 255)
ACCENT = (180, 140, 255)


def make_text_frame(
    text, width=900, font_size=52, color=FG, shadow=True, font_path=None
):
    font = None
    if font_path and os.path.exists(font_path):
        try:
            font = ImageFont.truetype(font_path, font_size)
        except Exception:
            font = None
    if font is None:
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except Exception:
            font = ImageFont.load_default()

    lines = textwrap.fill(text, width=30).split("\n")
    line_h = font_size + 12
    total_h = len(lines) * line_h + 40
    img = Image.new("RGBA", (width, total_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    for i, line in enumerate(lines):
        y = 20 + i * line_h
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
        x = (width - tw) // 2

        if shadow:
            draw.text((x + 2, y + 2), line, font=font, fill=(0, 0, 0, 160))
        draw.text((x, y), line, font=font, fill=color)

    return np.array(img)


def make_word_clip(word, duration, font_size=80, color=FG):
    arr = make_text_frame(word, width=900, font_size=font_size, color=color)
    pad_t, pad_b = 200, 200
    pad_l, pad_r = 90, 90

    def make_frame(t):
        if t >= duration * 0.85:
            return np.full((H, W, 4), [*BG, 255], dtype=np.uint8)
        fh, fw = arr.shape[:2]
        fh2, fw2 = fh + pad_t + pad_b, fw + pad_l + pad_r
        canvas = np.full((fh2, fw2, 4), [*BG, 255], dtype=np.uint8)
        canvas[pad_t : pad_t + fh, pad_l : pad_l + fw] = arr
        return canvas[:H, :W]

    return VideoClip(make_frame, duration=duration)


def generate(text, output="output.mp4"):
    words = text.strip().split()
    total_dur = sum(max(DURATION_PER_CHAR * len(w), 0.5) for w in words)
    total_dur += len(words) * 0.15
    total_dur = max(total_dur, 5)

    clips = []
    for i, word in enumerate(words):
        dur = max(DURATION_PER_CHAR * len(word), 0.5)
        color = ACCENT if i % 3 == 1 else FG
        clip = make_word_clip(word, dur, font_size=72, color=color)
        pause = VideoClip(
            lambda t: np.full((H, W, 4), [*BG, 255], dtype=np.uint8),
            duration=0.15,
        )
        clips.append(clip)
        clips.append(pause)

    from moviepy import AudioClip as AC

    silence = AC(lambda t: 0, duration=total_dur)
    video = concatenate_videoclips(clips, method="compose")
    video = video.with_audio(silence)
    video.write_videofile(output, fps=FPS, codec="libx264", audio_codec="aac")
    return output


if __name__ == "__main__":
    if len(sys.argv) > 1:
        text = sys.argv[1]
    else:
        text = "Dimple Estates Luxury Real Estate Find Your Dream Home Today Premium Properties Across the Country Expert Agents Trusted Service"

    out = sys.argv[2] if len(sys.argv) > 2 else "output.mp4"
    print(f"Generating video for: {text[:60]}...")
    result = generate(text, out)
    print(f"Done: {result}")
