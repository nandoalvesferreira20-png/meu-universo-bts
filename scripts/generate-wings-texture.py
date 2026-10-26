"""Original charcoal/smoke texture, without text, photos or brand marks.
Rebuild with Python + Pillow + numpy. No input/reference image is read.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 941, 1672
rng = np.random.default_rng(72143)

def noise(scale):
    grid = rng.random((max(3, H // scale), max(3, W // scale))).astype('float32')
    return np.asarray(Image.fromarray(grid).resize((W, H), Image.Resampling.BICUBIC))

cloud = sum(noise(s) * a for s, a in [(180, .45), (85, .27), (36, .16), (15, .08), (6, .04)])
warp_x = (noise(110) - .5) * 75 + (noise(28) - .5) * 18
warp_y = (noise(130) - .5) * 68 + (noise(34) - .5) * 20
y, x = np.mgrid[:H, :W]
xx = np.clip((x + warp_x).astype(int), 0, W-1)
yy = np.clip((y + warp_y).astype(int), 0, H-1)

# Independent drifting smoke paths mapped to the approved composition's edges.
paths = [
    [(775,-90),(746,45),(718,83),(600,125),(558,210),(548,320),(580,420),(700,480),(831,510),(868,595),(830,700),(752,790),(616,868)],
    [(-70,550),(82,634),(47,727),(113,781),(259,825),(343,902),(321,999),(248,1085),(333,1205)],
    [(997,620),(878,725),(787,805),(655,854),(506,895),(320,866),(205,791),(76,777)],
    [(-70,1420),(72,1476),(165,1595),(290,1585),(395,1514),(482,1456),(624,1443),(798,1392),(1020,1293)],
    [(1010,1420),(860,1514),(705,1475),(614,1521),(575,1635),(615,1750)],
]
density = np.zeros((H,W), dtype=float)
for index, points in enumerate(paths):
    # Smooth a Catmull-Rom spline, retaining visible irregular smoke edges.
    smooth = []
    p = [points[0]] + points + [points[-1]]
    for i in range(1, len(p)-2):
        a,b,c,d = map(lambda q: np.array(q, dtype=float), p[i-1:i+3])
        for t in np.linspace(0,1,24):
            v = .5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t)
            smooth.append(tuple(v))
    for width, blur, intensity in [(80, 24, .25), (30, 9, .28), (5, 3, .13)]:
        mask = Image.new('L',(W,H)); ImageDraw.Draw(mask).line(smooth, fill=255, width=width, joint='curve')
        field = np.asarray(mask.filter(ImageFilter.GaussianBlur(blur)),dtype=float)/255
        field = field[yy,xx]
        ripples = np.power(np.clip(cloud * 1.6 - .25,0,1), 1.6)
        density += field * ripples * intensity

# Scattered fine dust and uneven charcoal are restrained enough for silver type.
grain = rng.normal(0, 1.2, (H,W))
charcoal = 12 + (cloud-.45)*7 + grain
light = np.clip(charcoal + density * 190, 0, 170)
rgb = np.repeat(light[:,:,None],3,axis=2).astype('uint8')
dust = rng.random((H,W)) < .0015
rgb[dust] = np.clip(rgb[dust].astype(int)+rng.integers(8,42,(dust.sum(),1)),0,255)
target = Path(__file__).resolve().parents[1] / 'public/images/army-pass/textures/wings-smoke.png'
target.parent.mkdir(parents=True,exist_ok=True)
Image.fromarray(rgb).save(target, optimize=True)
print(target)
