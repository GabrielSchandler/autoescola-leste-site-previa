from pathlib import Path
from PIL import Image
import urllib.request
import re

root = Path(__file__).resolve().parent
assets = root / 'assets'
fonts = assets / 'fonts'
fonts.mkdir(parents=True, exist_ok=True)

sources = {
    'logo-oficial': Path(r'C:\Users\Gabriel\AppData\Local\Temp\codex-clipboard-c077d6c3-aa4c-437c-bbe9-0191fc99f081.png'),
    'poster-veiculos-oficial': Path(r'C:\Users\Gabriel\AppData\Local\Temp\codex-clipboard-a9df5fb9-cc77-41cd-ada3-0f53dcd5897d.png'),
    'poster-transito-oficial': Path(r'C:\Users\Gabriel\AppData\Local\Temp\codex-clipboard-c91a322d-dcf4-41d3-b18e-d765c1e6e10f.png'),
    'cena-carro-moto-ilustrativa': Path(r'C:\Users\Gabriel\.codex\generated_images\01a159e2-a8e9-7150-960f-8a37d29df655\exec-e8ed7d94-eaf7-4155-a57c-d25bc0835161.png'),
    'aula-carro-ilustrativa': Path(r'C:\Users\Gabriel\.codex\generated_images\01a159e2-a8e9-7150-960f-8a37d29df655\exec-972dc5e8-bc05-415e-bb91-f4912faefff8.png'),
    'aula-moto-ilustrativa': Path(r'C:\Users\Gabriel\.codex\generated_images\01a159e2-a8e9-7150-960f-8a37d29df655\exec-5d4ee411-96f5-49d7-9457-579457dc9a6b.png'),
}

for name, source in sources.items():
    im = Image.open(source).convert('RGB')
    for width in ([720, 1440, 1920] if 'ilustrativa' in name else [720]):
        target_width = min(width, im.width)
        target_height = round(im.height * target_width / im.width)
        resized = im.resize((target_width, target_height), Image.Resampling.LANCZOS)
        dest = assets / f'{name}-{width}.webp'
        resized.save(dest, 'WEBP', quality=83, method=6)
        print(dest.name, resized.size)

font_families = {
    'big-shoulders-latin.woff2': 'Big+Shoulders:wght@800',
    'public-sans-latin.woff2': 'Public+Sans:wght@400;600',
}
for filename, family in font_families.items():
    css_url = f'https://fonts.googleapis.com/css2?family={family}&display=swap'
    req = urllib.request.Request(css_url, headers={'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36'})
    css = urllib.request.urlopen(req, timeout=20).read().decode()
    latin = css.rsplit('/* latin */', 1)[-1]
    urls = re.findall(r'url\((https://[^)]+)\)', latin)
    if not urls:
        raise RuntimeError(f'No latin font URL for {family}')
    urllib.request.urlretrieve(urls[-1], fonts / filename)
    print(filename, (fonts / filename).stat().st_size)
