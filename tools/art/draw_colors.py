"""Kawaii paint-drop characters for the colours pack (Төсләр), SVG 400x400, house style.

Run:  python tools/art/draw_colors.py   → writes packs/tosler/img/*.svg
The colour of each drop must match "color" in packs/tosler/pack.json (the balloons game uses it).
"""
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'packs', 'tosler', 'img')
O = '#3b2a22'          # outline
SW = 7

# id: (fill colour, name) — keep in sync with pack.json
COLORS = {
    'kyzyl':       '#e53935',  # кызыл – красный
    'sary':        '#fdd835',  # сары – жёлтый
    'yashel':      '#43a047',  # яшел – зелёный
    'zanggar':     '#1e88e5',  # зәңгәр – синий / голубой
    'ak':          '#ffffff',  # ак – белый
    'kara':        '#26211f',  # кара – чёрный
    'shamaha':     '#8e24aa',  # шәмәхә – фиолетовый
    'kyzgylt_sary': '#fb8c00', # кызгылт сары – оранжевый
    'koran':       '#8d5a3b',  # көрән – коричневый
    'al':          '#f78fb3',  # ал – розовый
    'sory':        '#9e9e9e',  # соры – серый
}


def svg(body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">'
            f'<g stroke="{O}" stroke-width="{SW}" stroke-linejoin="round" stroke-linecap="round">{body}</g></svg>')


def shadow(cx=200, cy=372, rx=110):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="14" fill="#000" opacity=".08" stroke="none"/>'


def shade(hex_color, k):
    """k<1 darker, k>1 lighter (towards white)."""
    r, g, b = (int(hex_color[i:i + 2], 16) for i in (1, 3, 5))
    if k <= 1:
        r, g, b = (int(c * k) for c in (r, g, b))
    else:
        t = k - 1
        r, g, b = (int(c + (255 - c) * t) for c in (r, g, b))
    return f'#{r:02x}{g:02x}{b:02x}'


def eyes(x1, x2, y, r=17, ring=False):
    s = ''
    for x in (x1, x2):
        if ring:  # dark body: white rim so the eyes stay visible
            s += f'<circle cx="{x}" cy="{y}" r="{r + 7}" fill="#fff" stroke="none"/>'
        s += (f'<circle cx="{x}" cy="{y}" r="{r}" fill="{O}" stroke="none"/>'
              f'<circle cx="{x+5}" cy="{y-6}" r="{r*0.38:.1f}" fill="#fff" stroke="none"/>'
              f'<circle cx="{x-5}" cy="{y+6}" r="{r*0.16:.1f}" fill="#fff" stroke="none"/>')
    return s


def cheeks(x1, x2, y, rx=20, ry=12):
    return ''.join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="#ff8fa3" opacity=".6" stroke="none"/>'
                   for x in (x1, x2))


def smile(cx, cy, w=16, color=O):
    return (f'<path d="M{cx-w} {cy} q{w/2} {w*0.7} {w} 0 q{w/2} {w*0.7} {w} 0" fill="none" '
            f'stroke="{color}" stroke-width="6"/>')


DROP = 'M200 40 C238 98 330 140 330 228 A130 130 0 0 1 70 228 C70 140 162 98 200 40 Z'


def drop(color):
    dark = color in ('#26211f',)
    feet_c = shade(color, 0.8) if color != '#ffffff' else '#e6e2da'
    if dark:
        feet_c = '#4a403b'
    s = shadow()
    # feet
    s += ''.join(f'<ellipse cx="{x}" cy="352" rx="34" ry="20" fill="{feet_c}"/>' for x in (155, 245))
    # little arms
    s += f'<ellipse cx="74" cy="250" rx="20" ry="32" fill="{color}" transform="rotate(30 74 250)"/>'
    s += f'<ellipse cx="326" cy="250" rx="20" ry="32" fill="{color}" transform="rotate(-30 326 250)"/>'
    # body
    s += f'<path d="{DROP}" fill="{color}"/>'
    # glossy highlight
    s += ('<path d="M150 120 q-40 45 -42 95" fill="none" stroke="#fff" stroke-width="16" opacity=".55"/>'
          '<circle cx="114" cy="248" r="9" fill="#fff" opacity=".55" stroke="none"/>')
    s += eyes(158, 242, 218, 18, ring=dark)
    s += cheeks(124, 276, 258)
    s += smile(200, 262, 16, '#fff' if dark else O)
    return svg(s)


def palette():
    """Cover: a painter's palette with a blob of every colour and a happy face."""
    s = shadow(rx=150)
    s += ('<path d="M200 60 C300 60 370 120 370 200 C370 260 330 290 290 280 C255 272 245 300 262 325 '
          'C278 350 250 370 200 370 C100 370 30 300 30 210 C30 120 100 60 200 60 Z" fill="#f3d9a7"/>')
    s += '<circle cx="292" cy="230" r="24" fill="#fbf8ec"/>'  # thumb hole
    dots = [(110, 140), (165, 105), (230, 100), (290, 125), (330, 175),
            (80, 200), (85, 265), (130, 315), (195, 330)]
    cols = list(COLORS.values())
    for (x, y), c in zip(dots, cols):
        s += f'<circle cx="{x}" cy="{y}" r="24" fill="{c}" stroke-width="5"/>'
    s += eyes(175, 235, 205, 14) + cheeks(150, 262, 240, 15, 9) + smile(205, 242, 12)
    return svg(s)


os.makedirs(OUT, exist_ok=True)
files = {k: drop(c) for k, c in COLORS.items()}
files['palitra'] = palette()
for name, s in files.items():
    with open(os.path.join(OUT, f'{name}.svg'), 'w', encoding='utf-8') as f:
        f.write(s)
print('wrote', list(files))
