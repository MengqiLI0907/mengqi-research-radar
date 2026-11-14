#!/usr/bin/env python3
"""Fetch OpenAlex papers and generate the static research radar data + RSS feed.

Requires Python 3.10+; uses only standard library.
OPENALEX_API_KEY is optional for small-scale usage; a free key is recommended.
"""
import datetime as dt
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data' / 'papers.json'
JS = ROOT / 'data' / 'papers.js'
FEED = ROOT / 'feed.xml'
CONFIG = ROOT / 'config' / 'topics.json'

PATTERNS = {
    'smoke': r'wildfire|smoke|pm\s*2\.?5|particulate|air quality|air pollution|fire-induced',
    'mobility': r'mobilit|movement|evacuat|travel|transport|smartphone location|commut|traffic|trip pattern',
    'justice': r'equity|inequalit|disparit|vulnerab|environmental justice|socioeconomic|demographic|population group|health burden',
    'geoai': r'geoai|geospatial artificial|foundation model|deep learning|geographic artificial|spatial machine learning|multimodal model',
    'resilience': r'resilien|recover|disaster|hazard|spatial model|urban system|spatial association|emergency response',
    'remote': r'remote sensing|satellite|earth observation|landsat|sentinel-2|imagery|raster|sensor network|purpleair',
}


def classify(title, abstract):
    text = title + ' ' + abstract
    return [name for name, regex in PATTERNS.items() if re.search(regex, text, re.I)] or ['resilience']


def parse_abstract(inverted):
    if not isinstance(inverted, dict):
        return ''
    words = []
    for word, positions in inverted.items():
        if isinstance(positions, list):
            for pos in positions:
                if isinstance(pos, int) and 0 <= pos < 2000:
                    words.append((pos, word))
    words.sort()
    return ' '.join(x[1] for x in words[:420])


def normalize(raw):
    title = (raw.get('title') or raw.get('display_name') or '').strip()
    if not title:
        return None
    doi = (raw.get('doi') or '').replace('https://doi.org/', '').strip()
    pid = 'doi:' + doi.lower() if doi else (raw.get('id') or '')
    if not pid:
        return None
    source = ((raw.get('primary_location') or {}).get('source') or {}).get('display_name') or 'Preprint / source unavailable'
    oa = raw.get('open_access') or {}
    location = raw.get('best_oa_location') or {}
    url = 'https://doi.org/' + doi if doi else raw.get('id')
    if not url or not url.startswith('https://'):
        return None
    abstract = parse_abstract(raw.get('abstract_inverted_index'))
    return {
        'id': pid, 'title': title,
        'authors': [a.get('author', {}).get('display_name') for a in (raw.get('authorships') or [])[:8] if (a.get('author') or {}).get('display_name')],
        'journal': source, 'date': raw.get('publication_date') or '',
        'doi': doi or None, 'url': url,
        'oa_url': location.get('pdf_url') or location.get('landing_page_url') or oa.get('oa_url'),
        'is_oa': bool(oa.get('is_oa')),
        'citations': raw.get('cited_by_count'),
        'type': raw.get('type') or 'article',
        'abstract': abstract,
        'categories': classify(title, abstract),
        'source': 'openalex',
    }


def fetch(query, cutoff, per_page, api_key=None):
    params = {
        'search': query,
        'filter': 'from_publication_date:' + cutoff,
        'sort': 'publication_date:desc',
        'per_page': min(100, int(per_page)),
        'select': 'id,title,doi,publication_date,authorships,primary_location,open_access,best_oa_location,cited_by_count,abstract_inverted_index,type'
    }
    url = 'https://api.openalex.org/works?' + urllib.parse.urlencode(params)
    headers = {'User-Agent': 'GeoAIResearchRadar/1.0 (personal academic literature tracker)', 'Accept': 'application/json'}
    if api_key:
        headers['Authorization'] = 'Bearer ' + api_key
    for retry in range(3):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=25) as response:
                return json.load(response).get('results', [])
        except urllib.error.HTTPError as e:
            msg = e.read(400).decode('utf-8', errors='replace')
            if e.code in (429, 502, 503, 504) and retry < 2:
                delay = min(30, int(e.headers.get('Retry-After', '4') or '4'))
                print(f'  retry HTTP {e.code}; wait {delay}s', flush=True)
                time.sleep(delay)
                continue
            raise RuntimeError(f'HTTP {e.code}: {msg[:200]}') from e
        except (urllib.error.URLError, TimeoutError) as e:
            if retry < 2:
                time.sleep(4)
                continue
            raise RuntimeError(str(e)) from e


def score(p):
    weights = {'smoke': 5, 'mobility': 5, 'justice': 4, 'geoai': 4, 'resilience': 3, 'remote': 3}
    cats = p.get('categories') or []
    val = 35 + min(43, sum(weights.get(c, 0) for c in cats) * 2.85)
    if 'smoke' in cats and 'mobility' in cats:
        val += 8
    if 'smoke' in cats and 'justice' in cats:
        val += 5
    try:
        days = (dt.date.today() - dt.date.fromisoformat(p['date'])).days
        val += max(0, 11 - max(days, 0) / 90 * 1.5)
    except (TypeError, ValueError, KeyError):
        pass
    return min(99, round(val))


def write_rss(papers, generated_at):
    ET.register_namespace('', '')
    rss = ET.Element('rss', {'version': '2.0'})
    channel = ET.SubElement(rss, 'channel')
    for label, value in [
        ('title', 'GeoAI Research Radar — Personal Literature Feed'),
        ('description', 'New papers on wildfire smoke, mobility, environmental justice and GeoAI, curated from OpenAlex.'),
        ('link', 'https://openalex.org/'),
        ('language', 'en'),
        ('lastBuildDate', generated_at),
    ]:
        ET.SubElement(channel, label).text = value
    for p in sorted(papers, key=lambda x: (x.get('date') or ''), reverse=True)[:70]:
        item = ET.SubElement(channel, 'item')
        for label, value in [
            ('title', p.get('title')),
            ('link', p.get('url')),
            ('guid', p.get('id')),
            ('description', (p.get('journal') or '') + ' — ' + (p.get('abstract') or '')[:600]),
        ]:
            if value:
                ET.SubElement(item, label).text = str(value)
        try:
            published = dt.datetime.fromisoformat(p['date']).replace(tzinfo=dt.timezone.utc)
            ET.SubElement(item, 'pubDate').text = published.strftime('%a, %d %b %Y %H:%M:%S GMT')
        except (TypeError, ValueError, KeyError):
            pass
    ET.indent(rss, space='  ')
    FEED.write_bytes(ET.tostring(rss, encoding='utf-8', xml_declaration=True))


def run():
    settings = json.loads(CONFIG.read_text(encoding='utf-8'))
    prev = json.loads(DATA.read_text(encoding='utf-8')) if DATA.exists() else {'papers': []}
    previous_by_id = {p['id']: p for p in prev['papers'] if p.get('id')}
    queries = settings['queries']
    cutoff = (dt.date.today() - dt.timedelta(days=settings.get('lookback_days', 730))).isoformat()
    api_key = os.environ.get('OPENALEX_API_KEY') or None
    fetched = {}
    failures = 0
    for i, query in enumerate(queries, 1):
        print(f'[{i}/{len(queries)}] {query}', flush=True)
        try:
            papers = fetch(query, cutoff, settings.get('results_per_query', 45), api_key)
            n = 0
            for raw in papers:
                item = normalize(raw)
                if item and item.get('type') not in ('book', 'dataset', 'paratext', 'editorial', 'peer-review'):
                    fetched[item['id']] = item
                    n += 1
            print(f'  received {n} relevant metadata records', flush=True)
        except Exception as e:
            failures += 1
            print(f'  WARN: {e}', file=sys.stderr, flush=True)
        time.sleep(0.25)
    if not fetched:
        raise RuntimeError('No OpenAlex records fetched: preserve existing data and fail this workflow.')
    now = dt.datetime.now(dt.timezone.utc)
    today = now.date().isoformat()
    # Merge curated starter papers and previously fetched papers. OpenAlex metadata is preferred.
    merged = dict(previous_by_id)
    merged.update(fetched)
    first_seen = set(previous_by_id)
    new_ids = []
    for pid, p in merged.items():
        old = previous_by_id.get(pid, {})
        p['first_seen'] = old.get('first_seen') or (today if pid not in first_seen else prev.get('meta', {}).get('generated_at', today)[:10])
        if pid not in first_seen:
            new_ids.append(pid)
    # Limit the automatic corpus; retain curated starter records and saved records in the UI independently.
    keep = sorted(merged.values(), key=lambda p: (score(p), p.get('date') or ''), reverse=True)
    selected = keep[:int(settings.get('max_papers', 550))]
    # Keep a stable subset of hand-curated examples as anchors.
    seen = {p['id'] for p in selected}
    for p in previous_by_id.values():
        if p.get('source') == 'curated' and p['id'] not in seen:
            selected.append(p)
            seen.add(p['id'])
    stamp = now.isoformat(timespec='seconds').replace('+00:00', 'Z')
    out = {
        'meta': {'generated_at': stamp, 'mode': 'openalex_sync', 'source': 'OpenAlex',
                 'query_count': len(queries), 'failed_queries': failures,
                 'new_ids': [pid for pid in new_ids if pid in seen]},
        'papers': selected
    }
    DATA.write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    JS.write_text('window.RADAR_DATA = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
    write_rss(selected, now.strftime('%a, %d %b %Y %H:%M:%S GMT'))
    print(f'Done. {len(selected)} papers, {len(out["meta"]["new_ids"])} newly discovered, {failures} query failures')


if __name__ == '__main__':
    run()
