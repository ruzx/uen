"""Kawaii family figures (400x400 SVG), clothes/colours follow pub_145448.pdf."""
import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'packs', 'gaile/img')
O = '#3b2a22'; SW = 6
SKIN = '#fcd9bd'

def svg(body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="22 20 356 356">'
            f'<g stroke="{O}" stroke-width="{SW}" stroke-linejoin="round" stroke-linecap="round">{body}</g></svg>')

def shadow(rx=95):
    return f'<ellipse cx="200" cy="378" rx="{rx}" ry="12" fill="#000" opacity=".08" stroke="none"/>'

def kid(body):  # children are smaller, standing on the same ground
    return f'<g transform="translate(200 378) scale(.84) translate(-200 -378)">{body}</g>'

def limb(x1, y1, x2, y2, color, w=26):
    return (f'<path d="M{x1} {y1} L{x2} {y2}" stroke-width="{w+12}"/>'
            f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{color}" stroke-width="{w}"/>')

def hand(x, y, r=13):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{SKIN}"/>'

def shoe(x, y, color, flip=False):
    dx = -1 if flip else 1
    return f'<path d="M{x-16*dx} {y-8} q{20*dx} -10 {36*dx} 4 q{4*dx} 10 -4 12 h{-34*dx} q-6 0 -4 -8 Z" fill="{color}"/>'

def eyes(x1, x2, y, r=12):
    s = ''
    for x in (x1, x2):
        s += (f'<circle cx="{x}" cy="{y}" r="{r}" fill="{O}" stroke="none"/>'
              f'<circle cx="{x+4}" cy="{y-4}" r="{r*.4:.1f}" fill="#fff" stroke="none"/>'
              f'<circle cx="{x-3}" cy="{y+4}" r="{r*.17:.1f}" fill="#fff" stroke="none"/>')
    return s

def face(cy=118, r=72, old=False, smile=True):
    s = f'<circle cx="200" cy="{cy}" r="{r}" fill="{SKIN}"/>'
    s += eyes(172, 228, cy + 8, 11 if not old else 10)
    s += ''.join(f'<ellipse cx="{x}" cy="{cy+30}" rx="13" ry="8" fill="#ff8fa3" opacity=".5" stroke="none"/>' for x in (155, 245))
    s += f'<path d="M196 {cy+24} q4 4 8 0" fill="none" stroke-width="4"/>'
    if smile:
        s += f'<path d="M186 {cy+36} q14 14 28 0" fill="#e86a6a" stroke-width="5"/>'
    if old:
        s += (f'<path d="M160 {cy-6} q12 -6 24 0 M216 {cy-6} q12 -6 24 0" fill="none" stroke="#bbb" stroke-width="5"/>'
              f'<path d="M150 {cy+14} q-6 4 -4 10 M250 {cy+14} q6 4 4 10" fill="none" stroke="#d9a98a" stroke-width="3"/>')
    return s

F = {}

# ---------- әни: brown bob, pink vest over white blouse, navy skirt, pink shoes ----------
F['ani'] = svg(
    shadow() +
    '<path d="M122 128 q-4 -92 78 -94 q82 2 78 94 l4 62 q-22 14 -42 0 l-4 -40 h-72 l-4 40 q-20 14 -42 0 Z" fill="#7a4a2c"/>' +
    limb(172, 300, 172, 352, SKIN, 22) + limb(228, 300, 228, 352, SKIN, 22) +
    shoe(170, 362, '#ec5b8f', flip=True) + shoe(230, 362, '#ec5b8f') +
    '<rect x="188" y="182" width="24" height="24" fill="' + SKIN + '"/>' +
    limb(146, 214, 128, 286, SKIN, 20) + limb(254, 214, 272, 286, SKIN, 20) + hand(127, 292) + hand(273, 292) +
    '<ellipse cx="140" cy="220" rx="24" ry="20" fill="#fff"/><ellipse cx="260" cy="220" rx="24" ry="20" fill="#fff"/>'
    '<path d="M150 204 q50 -12 100 0 l8 90 h-116 Z" fill="#fff"/>'
    '<path d="M158 208 h24 l18 30 l18 -30 h24 l6 86 h-96 Z" fill="#d6457a"/>'
    '<path d="M168 222 v60 M232 222 v60 M166 282 h68" fill="none" stroke="#f9b8cf" stroke-width="4" stroke-dasharray="7 6"/>'
    '<path d="M182 204 l18 22 l18 -22" fill="#fff" stroke-width="5"/>'
    '<path d="M144 290 h112 l10 54 h-132 Z" fill="#26304f"/><path d="M228 316 v28" stroke-width="4"/>' +
    face() +
    '<path d="M128 122 q2 -78 74 -80 q70 2 72 80 q-28 -22 -50 -46 q-30 40 -96 46 Z" fill="#7a4a2c"/>'
)

# ---------- әти: dark short hair, moustache, yellow sweater, blue jeans, brown shoes ----------
F['ati'] = svg(
    shadow() +
    limb(176, 290, 172, 352, '#3f6fb5', 30) + limb(224, 290, 228, 352, '#3f6fb5', 30) +
    shoe(168, 364, '#9a5b2e', flip=True) + shoe(232, 364, '#9a5b2e') +
    '<rect x="186" y="182" width="28" height="26" fill="' + SKIN + '"/>' +
    limb(146, 216, 124, 284, '#f5c636', 30) + limb(254, 216, 276, 284, '#f5c636', 30) + hand(122, 296) + hand(278, 296) +
    '<path d="M146 206 q54 -16 108 0 l10 92 h-128 Z" fill="#f5c636"/>'
    '<path d="M180 202 l20 18 l20 -18 l12 8 l-32 22 l-32 -22 Z" fill="#f5c636"/>'
    '<path d="M190 206 l10 10 l10 -10 Z" fill="#3b2a22"/><circle cx="200" cy="236" r="3" fill="' + O + '"/><circle cx="200" cy="250" r="3" fill="' + O + '"/>'
    '<path d="M138 286 h124 l2 12 h-128 Z" fill="#e9b52a"/>' +
    face() +
    '<path d="M184 147 q16 -9 32 0 q-8 6 -16 3 q-8 3 -16 -3 Z" fill="#4a3426" stroke-width="3"/>'
    '<path d="M130 112 q-2 -72 72 -72 q70 2 70 70 q-10 -12 -18 -18 q-40 10 -96 -2 q-14 8 -28 22 Z" fill="#3e2c22"/>'
)

# ---------- әби: white headscarf, green vest, crimson long dress, embroidered shoes ----------
F['abi'] = svg(
    shadow() +
    '<path d="M126 110 q0 -86 74 -86 q74 0 74 86 l18 170 q-92 26 -184 0 Z" fill="#fff"/>' +
    shoe(170, 362, '#a43a2a', flip=True) + shoe(230, 362, '#a43a2a') +
    '<path d="M164 360 l10 -6 M226 360 l10 -6" stroke="#f2c14e" stroke-width="5"/>'
    '<path d="M150 230 l-14 124 h128 l-14 -124 Z" fill="#b1245f"/>' +
    limb(150, 220, 132, 288, '#b1245f', 26) + limb(250, 220, 268, 288, '#b1245f', 26) +
    '<path d="M122 286 h20 M258 286 h20" stroke="#f2c14e" stroke-width="5"/>' + hand(130, 300) + hand(270, 300) +
    '<path d="M150 210 q50 -14 100 0 l8 100 h-116 Z" fill="#b1245f"/>'
    '<path d="M150 212 l32 -6 l6 104 h-46 Z M250 212 l-32 -6 l-6 104 h46 Z" fill="#1f8a6e"/>'
    '<path d="M182 210 l6 100 M218 210 l-6 100" fill="none" stroke="#f7b3c8" stroke-width="4"/>'
    '<path d="M180 200 q20 14 40 0" fill="none" stroke="#f2c14e" stroke-width="5" stroke-dasharray="2 7"/>' +
    face(old=True) +
    '<path d="M142 96 q10 -44 58 -46 q48 2 58 46 q-30 -16 -58 -16 q-28 0 -58 16 Z" fill="#d9d9d9"/>'
    '<path d="M134 100 q-4 -76 66 -78 q70 2 66 78 q-6 -40 -66 -48 q-60 8 -66 48 Z" fill="#fff"/>'
    '<path d="M148 64 q52 -24 104 0" fill="none" stroke-width="14"/>'
    '<path d="M148 64 q52 -24 104 0" fill="none" stroke="#1f8a6e" stroke-width="7"/>'
    '<path d="M160 58 l0 0 M180 52 l0 0 M200 50 l0 0 M220 52 l0 0 M240 58 l0 0" stroke="#f2c14e" stroke-width="7"/>'
    '<path d="M126 110 q-10 80 -16 120 M274 110 q10 80 16 120" fill="none"/>'
)

# ---------- бабай: embroidered кәләпүш, grey hair & beard, white shirt, orange vest, dark trousers ----------
F['babai'] = svg(
    shadow() +
    limb(176, 290, 174, 352, '#34383f', 30) + limb(224, 290, 226, 352, '#34383f', 30) +
    shoe(170, 364, '#2b3550', flip=True) + shoe(230, 364, '#2b3550') +
    limb(146, 216, 126, 284, '#fff', 28) + limb(254, 216, 274, 284, '#fff', 28) + hand(124, 296) + hand(276, 296) +
    '<path d="M146 206 q54 -14 108 0 l10 92 h-128 Z" fill="#fff"/>'
    '<path d="M150 210 l30 -6 l20 40 l20 -40 l30 6 l12 88 h-124 Z" fill="#e8522a"/>'
    '<path d="M160 230 v60 M240 230 v60" fill="none" stroke="#c63f1c" stroke-width="5"/>'
    '<path d="M186 206 l14 30 l14 -30" fill="none" stroke-width="5"/>' +
    face(old=True, smile=False) +
    '<path d="M150 150 q8 50 50 54 q42 -4 50 -54 q-20 18 -50 18 q-30 0 -50 -18 Z" fill="#eeeeee"/>'
    '<path d="M178 150 q22 -12 44 0 q-8 10 -22 6 q-14 4 -22 -6 Z" fill="#dcdcdc" stroke-width="3"/>'
    '<path d="M188 168 q12 8 24 0" fill="#e86a6a" stroke-width="4"/>'
    '<path d="M130 116 q-6 -40 20 -54 M270 116 q6 -40 -20 -54" fill="none" stroke-width="18"/>'
    '<path d="M130 116 q-6 -40 20 -54 M270 116 q6 -40 -20 -54" fill="none" stroke="#dddddd" stroke-width="8"/>'
    '<path d="M144 70 q56 -46 112 0 v6 h-112 Z" fill="#7a1f2b"/>'
    '<path d="M150 70 q50 -10 100 0" fill="none" stroke="#f2c14e" stroke-width="4" stroke-dasharray="10 6"/>'
    '<path d="M176 52 q24 -10 48 0" fill="none" stroke="#fff" stroke-width="4"/>'
)

# ---------- кыз: bob, red sarafan with embroidery, white blouse with red dots, red shoes ----------
F['kyz'] = svg(shadow(80) + kid(
    '<path d="M124 126 q-4 -90 76 -92 q80 2 76 92 l2 44 q-18 10 -36 0 l-2 -30 h-80 l-2 30 q-18 10 -36 0 Z" fill="#a8693f"/>' +
    limb(176, 300, 176, 350, SKIN, 22) + limb(224, 300, 224, 350, SKIN, 22) +
    '<rect x="164" y="336" width="24" height="16" fill="#fff" stroke-width="4"/><rect x="212" y="336" width="24" height="16" fill="#fff" stroke-width="4"/>' +
    shoe(172, 364, '#e23c3c', flip=True) + shoe(228, 364, '#e23c3c') +
    limb(150, 216, 134, 282, SKIN, 20) + limb(250, 216, 266, 282, SKIN, 20) + hand(133, 290) + hand(267, 290) +
    '<ellipse cx="144" cy="220" rx="22" ry="18" fill="#fff"/><ellipse cx="256" cy="220" rx="22" ry="18" fill="#fff"/>'
    '<circle cx="138" cy="216" r="3" fill="#e23c3c" stroke="none"/><circle cx="150" cy="226" r="3" fill="#e23c3c" stroke="none"/>'
    '<circle cx="250" cy="216" r="3" fill="#e23c3c" stroke="none"/><circle cx="262" cy="226" r="3" fill="#e23c3c" stroke="none"/>'
    '<path d="M160 206 h80 l40 104 q-80 18 -160 0 Z" fill="#e23c3c"/>'
    '<path d="M164 226 h72" fill="none" stroke="#f2a33a" stroke-width="8"/>'
    '<circle cx="182" cy="226" r="6" fill="#ffd23f" stroke-width="3"/><circle cx="200" cy="226" r="7" fill="#fff" stroke-width="3"/><circle cx="218" cy="226" r="6" fill="#ffd23f" stroke-width="3"/>'
    '<path d="M180 200 q20 16 40 0" fill="#fff" stroke-width="5"/>' +
    face() +
    '<path d="M130 120 q2 -76 70 -78 q68 2 70 78 q-14 -28 -36 -36 q-20 18 -68 16 q-24 6 -36 20 Z" fill="#a8693f"/>'
))

# ---------- малай: short brown hair, white shirt with yellow/blue stripes, teal trousers, navy shoes ----------
F['malai'] = svg(shadow(80) + kid(
    limb(178, 290, 176, 352, '#2c8c8c', 30) + limb(222, 290, 224, 352, '#2c8c8c', 30) +
    shoe(170, 364, '#27346b', flip=True) + shoe(230, 364, '#27346b') +
    limb(148, 216, 130, 282, '#fff', 28) + limb(252, 216, 270, 282, '#fff', 28) + hand(128, 294) + hand(272, 294) +
    '<path d="M148 206 q52 -14 104 0 l8 88 h-120 Z" fill="#fff"/>'
    '<path d="M144 238 h112 M143 252 h114" fill="none" stroke-width="11"/>'
    '<path d="M144 238 h112" fill="none" stroke="#f5c636" stroke-width="7"/><path d="M143 252 h114" fill="none" stroke="#3aa0e0" stroke-width="7"/>'
    '<path d="M184 204 l16 20 l16 -20" fill="none" stroke="#3aa0e0" stroke-width="6"/>'
    '<path d="M138 286 h124 l2 12 h-128 Z" fill="#2c8c8c"/><circle cx="200" cy="292" r="4" fill="#fff" stroke-width="3"/>' +
    face() +
    '<path d="M128 116 q-6 -78 72 -80 q76 2 72 80 q-8 -18 -20 -26 l-6 14 l-14 -20 l-14 16 l-16 -18 l-16 18 l-14 -14 l-10 16 q-18 4 -34 14 Z" fill="#6b4226"/>'
))

os.makedirs(OUT, exist_ok=True)
for n, s in F.items():
    open(os.path.join(OUT, f'{n}.svg'), 'w').write(s)
print('wrote', list(F))
