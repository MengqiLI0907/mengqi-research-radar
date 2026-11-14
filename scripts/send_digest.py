#!/usr/bin/env python3
"""Optional weekly digest by SMTP. All credentials come from environment secrets."""
import datetime as dt
import json
import os
import smtplib
from email.message import EmailMessage
from pathlib import Path
from update_papers import score

ROOT = Path(__file__).resolve().parents[1]
NEEDED = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD', 'EMAIL_FROM', 'EMAIL_TO']


def main():
    missing = [k for k in NEEDED if not os.getenv(k)]
    if missing:
        print('Email not configured, skipping digest. Missing: ' + ', '.join(missing))
        return
    data = json.loads((ROOT / 'data' / 'papers.json').read_text(encoding='utf-8'))
    cutoff = dt.date.today() - dt.timedelta(days=8)
    papers = []
    for p in data.get('papers', []):
        try:
            if dt.date.fromisoformat(p.get('first_seen') or '') >= cutoff:
                papers.append(p)
        except ValueError:
            pass
    if not papers:
        print('No newly discovered literature in last 8 days; skipping nonessential email.')
        return
    papers.sort(key=lambda p: (score(p), p.get('date') or ''), reverse=True)
    selected = papers[:10]
    today = dt.date.today().isoformat()
    msg = EmailMessage()
    msg['From'] = os.environ['EMAIL_FROM']
    msg['To'] = os.environ['EMAIL_TO']
    msg['Subject'] = f'GeoAI Research Radar | {len(selected)} paper(s) | {today}'
    lines = [f'GeoAI Research Radar — Weekly literature digest ({today})', '',
             'Newly discovered in OpenAlex in the last 8 days. Ranking is based on thematic keywords and recency, not study quality.', '']
    for i, p in enumerate(selected, 1):
        lines += [f'{i}. {p.get("title")}', f'   {p.get("journal") or "Source unknown"} | {p.get("date")}',
                  f'   {p.get("url")}', '']
    lines += ['Generated from public OpenAlex metadata. Verify paper details before citing.']
    msg.set_content('\n'.join(lines))
    host, port = os.environ['SMTP_HOST'], int(os.environ.get('SMTP_PORT') or '465')
    if port == 465:
        with smtplib.SMTP_SSL(host, port, timeout=30) as smtp:
            smtp.login(os.environ['SMTP_USER'], os.environ['SMTP_PASSWORD'])
            smtp.send_message(msg)
    else:
        with smtplib.SMTP(host, port, timeout=30) as smtp:
            smtp.starttls()
            smtp.login(os.environ['SMTP_USER'], os.environ['SMTP_PASSWORD'])
            smtp.send_message(msg)
    print(f'Email sent: {len(selected)} papers to configured recipient')


if __name__ == '__main__':
    main()
