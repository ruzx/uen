"""Original kawaii farm animals as SVG (400x400), one consistent style."""
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'packs', 'hayvannar/img')
O = '#3b2a22'          # outline
SW = 7

def svg(body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">'
            f'<g stroke="{O}" stroke-width="{SW}" stroke-linejoin="round" stroke-linecap="round">{body}</g></svg>')

def shadow(cx=200, cy=372, rx=120):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="14" fill="#000" opacity=".08" stroke="none"/>'

def eyes(x1, x2, y, r=17):
    s = ''
    for x in (x1, x2):
        s += (f'<circle cx="{x}" cy="{y}" r="{r}" fill="{O}" stroke="none"/>'
              f'<circle cx="{x+5}" cy="{y-6}" r="{r*0.38:.1f}" fill="#fff" stroke="none"/>'
              f'<circle cx="{x-5}" cy="{y+6}" r="{r*0.16:.1f}" fill="#fff" stroke="none"/>')
    return s

def cheeks(x1, x2, y, rx=20, ry=12):
    return ''.join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="#ff8fa3" opacity=".55" stroke="none"/>' for x in (x1, x2))

def legs(color, xs=(150, 250), y0=315, y1=362, w=40, hoof=None):
    s = ''
    for x in xs:
        s += f'<rect x="{x-w/2}" y="{y0}" width="{w}" height="{y1-y0}" rx="16" fill="{color}"/>'
        if hoof:
            s += f'<path d="M{x-w/2+1} {y1-14} H{x+w/2-1} V{y1-10} a16 16 0 0 1 -16 16 h{-(w-34)} a16 16 0 0 1 -16 -16 Z" fill="{hoof}" stroke="none"/>'
            s += f'<rect x="{x-w/2}" y="{y0}" width="{w}" height="{y1-y0}" rx="16" fill="none"/>'
    return s

def smile(cx, cy, w=16):
    return f'<path d="M{cx-w} {cy} q{w/2} {w*0.7} {w} 0 q{w/2} {w*0.7} {w} 0" fill="none" stroke-width="6"/>'

A = {}

# ---------------- dog (эт) ----------------
A['et'] = svg(
    shadow() +
    '<path d="M292 270 q55 -10 52 -75" fill="none" stroke-width="22"/>'
    '<path d="M292 270 q55 -10 52 -75" fill="none" stroke="#d99a5b" stroke-width="10"/>' +
    legs('#d99a5b', xs=(155, 245)) +
    '<ellipse cx="200" cy="285" rx="100" ry="68" fill="#d99a5b"/>'
    '<ellipse cx="200" cy="300" rx="52" ry="42" fill="#fff4e6" stroke="none"/>'
    '<circle cx="200" cy="165" r="108" fill="#d99a5b"/>'
    '<path d="M200 62 q-28 60 -18 100 q-55 25 -40 70 q20 38 58 38 q38 0 58 -38 q15 -45 -40 -70 q10 -40 -18 -100 Z" fill="#fff4e6" stroke="none"/>'
    '<ellipse cx="88" cy="175" rx="38" ry="72" fill="#8a5a33" transform="rotate(18 88 175)"/>'
    '<ellipse cx="312" cy="175" rx="38" ry="72" fill="#8a5a33" transform="rotate(-18 312 175)"/>' +
    eyes(158, 242, 160) + cheeks(130, 270, 205) +
    '<ellipse cx="200" cy="200" rx="22" ry="15" fill="' + O + '"/>'
    '<ellipse cx="194" cy="195" rx="7" ry="4" fill="#fff" stroke="none"/>'
    '<path d="M200 215 v12" stroke-width="6"/>'
    '<path d="M186 238 q0 30 14 30 q14 0 14 -30 Z" fill="#ff7a8a" stroke-width="5"/>' +
    smile(200, 228, 22)
)

# ---------------- cat (песи) ----------------
A['pesi'] = svg(
    shadow() +
    '<path d="M290 290 q70 0 60 -70 q-5 -30 -30 -25" fill="none" stroke-width="24"/>'
    '<path d="M290 290 q70 0 60 -70 q-5 -30 -30 -25" fill="none" stroke="#f4a259" stroke-width="10"/>' +
    legs('#f4a259', xs=(160, 240)) +
    '<ellipse cx="200" cy="288" rx="95" ry="66" fill="#f4a259"/>'
    '<ellipse cx="200" cy="300" rx="48" ry="40" fill="#fff4e6" stroke="none"/>'
    '<path d="M108 120 L100 30 L175 72 Z" fill="#f4a259"/><path d="M292 120 L300 30 L225 72 Z" fill="#f4a259"/>'
    '<path d="M118 100 L114 52 L158 78 Z" fill="#ffb3c1" stroke="none"/><path d="M282 100 L286 52 L242 78 Z" fill="#ffb3c1" stroke="none"/>'
    '<ellipse cx="200" cy="168" rx="112" ry="100" fill="#f4a259"/>'
    '<path d="M185 72 v26 M200 70 v30 M215 72 v26" stroke="#c9752f" stroke-width="7"/>'
    '<ellipse cx="200" cy="215" rx="58" ry="40" fill="#fff4e6" stroke="none"/>' +
    eyes(155, 245, 165, 18) + cheeks(125, 275, 205) +
    '<path d="M190 196 h20 l-10 11 Z" fill="#ff7a8a" stroke-width="5"/>' +
    smile(200, 212, 18) +
    '<path d="M150 205 l-62 -8 M150 217 l-60 10 M250 205 l62 -8 M250 217 l60 10" stroke-width="4"/>'
)

# ---------------- cow (сыер) ----------------
A['syer'] = svg(
    shadow() +
    '<path d="M295 280 q40 10 40 50" fill="none" stroke-width="8"/>'
    '<path d="M328 322 q8 18 16 10 q-2 -14 -16 -10 Z" fill="' + O + '"/>' +
    legs('#fbfaf5', xs=(150, 250), hoof='#5a4235') +
    '<ellipse cx="200" cy="285" rx="105" ry="70" fill="#fbfaf5"/>'
    '<path d="M130 255 q25 -20 45 5 q-5 30 -35 25 q-20 -10 -10 -30 Z" fill="' + O + '" stroke="none"/>'
    '<path d="M240 300 q30 -15 45 10 q-10 25 -35 20 q-15 -10 -10 -30 Z" fill="' + O + '" stroke="none"/>'
    '<path d="M140 70 q-20 -10 -25 -40 q25 5 35 30 Z" fill="#f3e3b5"/><path d="M260 70 q20 -10 25 -40 q-25 5 -35 30 Z" fill="#f3e3b5"/>'
    '<ellipse cx="72" cy="130" rx="45" ry="22" fill="#fbfaf5" transform="rotate(-18 72 130)"/>'
    '<ellipse cx="328" cy="130" rx="45" ry="22" fill="#fbfaf5" transform="rotate(18 328 130)"/>'
    '<ellipse cx="72" cy="132" rx="26" ry="10" fill="#ffb3c1" stroke="none" transform="rotate(-18 72 132)"/>'
    '<ellipse cx="328" cy="132" rx="26" ry="10" fill="#ffb3c1" stroke="none" transform="rotate(18 328 132)"/>'
    '<ellipse cx="200" cy="165" rx="110" ry="102" fill="#fbfaf5"/>'
    '<path d="M215 66 q40 -5 60 30 q-10 30 -45 25 q-25 -20 -15 -55 Z" fill="' + O + '" stroke="none"/>' +
    eyes(150, 250, 150, 17) + cheeks(115, 285, 190) +
    '<ellipse cx="200" cy="222" rx="78" ry="45" fill="#ffb3c1"/>'
    '<ellipse cx="172" cy="218" rx="10" ry="13" fill="' + O + '" stroke="none"/><ellipse cx="228" cy="218" rx="10" ry="13" fill="' + O + '" stroke="none"/>' +
    smile(200, 245, 14) +
    '<circle cx="200" cy="292" r="20" fill="#ffd23f"/><path d="M190 300 h20" stroke-width="5"/>'
)

# ---------------- sheep (сарык) ----------------
wool = ''
for (x, y, r) in [(120, 270, 45), (160, 240, 48), (215, 235, 50), (265, 255, 46), (290, 295, 42), (250, 325, 45),
                  (190, 330, 48), (130, 315, 42), (200, 285, 60)]:
    wool += f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fffdf7"/>'
wool_fill = ''.join(f'<circle cx="{x}" cy="{y}" r="{r-6}" fill="#fffdf7" stroke="none"/>' for (x, y, r) in
                    [(120, 270, 45), (160, 240, 48), (215, 235, 50), (265, 255, 46), (290, 295, 42), (250, 325, 45),
                     (190, 330, 48), (130, 315, 42), (200, 285, 60)])
cap = ''
for (x, y, r) in [(150, 85, 32), (185, 68, 34), (222, 70, 34), (255, 90, 30)]:
    cap += f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fffdf7"/>'
cap_fill = ''.join(f'<circle cx="{x}" cy="{y}" r="{r-6}" fill="#fffdf7" stroke="none"/>' for (x, y, r) in
                   [(150, 85, 32), (185, 68, 34), (222, 70, 34), (255, 90, 30)])
A['saryk'] = svg(
    shadow() + legs('#5b4636', xs=(155, 245), y0=330) + wool + wool_fill +
    '<ellipse cx="95" cy="150" rx="40" ry="20" fill="#e9c9a8" transform="rotate(-25 95 150)"/>'
    '<ellipse cx="305" cy="150" rx="40" ry="20" fill="#e9c9a8" transform="rotate(25 305 150)"/>'
    '<ellipse cx="200" cy="165" rx="88" ry="92" fill="#f5dcc0"/>' + cap + cap_fill +
    eyes(165, 235, 165, 16) + cheeks(140, 260, 200, 17, 10) +
    '<path d="M190 195 q10 8 20 0" fill="#c98b7a" stroke-width="5"/>' + smile(200, 210, 14)
)

# ---------------- goat (кәҗә) ----------------
A['kaja'] = svg(
    shadow() +
    '<path d="M292 258 q28 -20 30 -40" fill="none" stroke-width="16"/><path d="M292 258 q28 -20 30 -40" fill="none" stroke="#f1ebdf" stroke-width="5"/>' +
    legs('#f1ebdf', xs=(152, 248), hoof='#6b5546') +
    '<ellipse cx="200" cy="285" rx="100" ry="66" fill="#f1ebdf"/>'
    '<path d="M150 82 q-30 -50 -75 -40 q35 5 50 55 Z" fill="#a58d74"/>'
    '<path d="M250 82 q30 -50 75 -40 q-35 5 -50 55 Z" fill="#a58d74"/>'
    '<ellipse cx="78" cy="150" rx="52" ry="20" fill="#f1ebdf" transform="rotate(20 78 150)"/>'
    '<ellipse cx="322" cy="150" rx="52" ry="20" fill="#f1ebdf" transform="rotate(-20 322 150)"/>'
    '<ellipse cx="80" cy="152" rx="32" ry="9" fill="#ffc9b8" stroke="none" transform="rotate(20 80 152)"/>'
    '<ellipse cx="320" cy="152" rx="32" ry="9" fill="#ffc9b8" stroke="none" transform="rotate(-20 320 152)"/>'
    '<ellipse cx="200" cy="160" rx="92" ry="100" fill="#f1ebdf"/>'
    '<path d="M178 246 q22 78 44 0 Z" fill="#d8ccb8"/>'
    '<path d="M168 70 q32 -18 64 0 q-10 22 -32 22 q-22 0 -32 -22 Z" fill="#d8ccb8" stroke="none"/>' +
    eyes(158, 242, 150, 16) + cheeks(130, 270, 190, 17, 10) +
    '<ellipse cx="200" cy="215" rx="48" ry="32" fill="#ffd6c9"/>'
    '<ellipse cx="185" cy="210" rx="6" ry="8" fill="' + O + '" stroke="none"/><ellipse cx="215" cy="210" rx="6" ry="8" fill="' + O + '" stroke="none"/>' +
    smile(200, 228, 12)
)

# ---------------- horse (ат) ----------------
A['at'] = svg(
    shadow() +
    '<path d="M290 265 q60 10 50 90 q-25 -15 -30 -40 q-20 10 -35 -10 Z" fill="#5b3a22"/>' +
    legs('#b86b34', xs=(152, 248), hoof='#4a3020') +
    '<ellipse cx="200" cy="285" rx="100" ry="66" fill="#b86b34"/>'
    '<path d="M138 72 L128 18 L172 52 Z" fill="#b86b34"/><path d="M262 72 L272 18 L228 52 Z" fill="#b86b34"/>'
    '<path d="M140 60 L136 34 L158 52 Z" fill="#f2b38a" stroke="none"/><path d="M260 60 L264 34 L242 52 Z" fill="#f2b38a" stroke="none"/>'
    '<ellipse cx="200" cy="160" rx="90" ry="108" fill="#b86b34"/>'
    '<path d="M165 58 q35 -30 75 -5 q-5 30 -30 40 q5 -20 -10 -25 q-10 25 -35 25 q10 -15 0 -35 Z" fill="#5b3a22"/>'
    '<path d="M285 120 q30 40 10 110 q-15 -30 -25 -40 Z" fill="#5b3a22"/>' +
    eyes(155, 245, 150, 17) + cheeks(122, 278, 185, 18, 11) +
    '<ellipse cx="200" cy="225" rx="62" ry="42" fill="#f2c9a5"/>'
    '<ellipse cx="178" cy="218" rx="8" ry="10" fill="' + O + '" stroke="none"/><ellipse cx="222" cy="218" rx="8" ry="10" fill="' + O + '" stroke="none"/>' +
    smile(200, 240, 16)
)

# ---------------- pig (дуңгыз) ----------------
A['dunggyz'] = svg(
    shadow() +
    '<path d="M298 275 q30 -5 25 -25 q-5 -15 -15 -5 q-5 15 20 15 q20 0 22 -20" fill="none" stroke-width="7"/>' +
    legs('#f7a8b8', xs=(152, 248), hoof='#d6788c') +
    '<ellipse cx="200" cy="285" rx="105" ry="70" fill="#f7a8b8"/>'
    '<path d="M110 105 L95 40 L165 75 Z" fill="#f7a8b8"/><path d="M290 105 L305 40 L235 75 Z" fill="#f7a8b8"/>'
    '<path d="M118 90 L110 55 L148 75 Z" fill="#e57f97" stroke="none"/><path d="M282 90 L290 55 L252 75 Z" fill="#e57f97" stroke="none"/>'
    '<ellipse cx="200" cy="170" rx="112" ry="100" fill="#f7a8b8"/>' +
    eyes(150, 250, 150, 16) + cheeks(115, 285, 200) +
    '<ellipse cx="200" cy="205" rx="48" ry="33" fill="#f48aa3"/>'
    '<ellipse cx="183" cy="205" rx="9" ry="13" fill="#b5506a" stroke="none"/><ellipse cx="217" cy="205" rx="9" ry="13" fill="#b5506a" stroke="none"/>' +
    smile(200, 248, 14)
)

# ---------------- hen (тавык) ----------------
def bird(body, belly, wing, comb, wattle, tail):
    return svg(
        shadow(rx=100) +
        tail +
        '<path d="M170 330 v35 M155 368 h30 M230 330 v35 M215 368 h30" stroke="#f08c1a" stroke-width="9"/>' +
        f'<path d="M200 60 c95 0 135 90 120 170 c-15 80 -70 110 -120 110 c-50 0 -105 -30 -120 -110 c-15 -80 25 -170 120 -170 Z" fill="{body}"/>'
        f'<ellipse cx="200" cy="270" rx="70" ry="60" fill="{belly}" stroke="none"/>' +
        comb +
        f'<path d="M250 230 q55 -10 60 45 q-45 30 -75 -5 Z" fill="{wing}"/>'
        f'<path d="M250 260 q25 0 35 20 M255 275 q20 5 25 15" fill="none" stroke-width="4"/>' +
        eyes(165, 235, 150, 16) + cheeks(138, 262, 182, 16, 10) +
        '<path d="M185 170 L215 170 L200 196 Z" fill="#ffb21a"/>' +
        wattle
    )

A['tavyk'] = bird('#e09a52', '#fbe3c2', '#c8783a',
                  '<path d="M168 70 q-5 -35 22 -28 q10 -25 30 -5 q25 -10 22 25 Z" fill="#ef3b3b"/>',
                  '<path d="M192 196 q8 22 16 0 Z" fill="#ef3b3b" stroke-width="5"/>',
                  '<path d="M105 235 q-70 -25 -62 -110 q32 28 52 52 q-8 -62 32 -92 q4 66 16 100 Z" fill="#b8692e"/>')

A['atach'] = bird('#e8622c', '#f9c66a', '#9c3d1d',
                  '<path d="M152 78 q-15 -50 22 -40 q5 -35 35 -15 q20 -25 40 5 q35 -5 22 50 Z" fill="#e01e2e"/>',
                  '<path d="M190 196 q10 38 20 0 Z" fill="#e01e2e" stroke-width="5"/>',
                  '<path d="M115 255 q-100 -25 -95 -165 q45 45 65 100 q-35 -100 30 -165 q12 95 32 150 q12 -80 65 -105 q-28 75 -22 150 Z" fill="#1f8a70"/>'
                  '<path d="M95 225 q-55 -45 -48 -125" fill="none" stroke="#2a5fb0" stroke-width="14"/>'
                  '<path d="M120 215 q-20 -60 10 -120" fill="none" stroke="#f2b134" stroke-width="10"/>')

os.makedirs(OUT, exist_ok=True)
for name, s in A.items():
    open(os.path.join(OUT, f'{name}.svg'), 'w').write(s)
print('wrote', list(A))
