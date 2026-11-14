# FIELDNOTES — GeoAI Research Radar

A lightweight, static, bilingual (简体中文 / English) with a persistent language switch literature discovery dashboard for research at the intersection of **wildfire smoke and PM₂.₅, human mobility, environmental justice, GeoAI, disaster resilience, and remote sensing**.

**This is an actual static website**, not a screenshot. Open `index.html` locally, or host the whole directory with GitHub Pages. It has a verifiable starter library of 20 research papers (DOIs/link-outs), and can retrieve new papers through OpenAlex.

## What's included

- **Overview** — curated papers ranked with transparent keyword/recency scores; topic coverage, open-access indicators, 90-day counters.
- **Discover** — keyword search, topic/date/OA filters, sort by match/date/citations, live OpenAlex search, CSV export.
- **My library** — save/unsave items (browser localStorage), export RIS for Zotero or CSV/JSON backups.
- **Journal matching** — abstract-driven heuristic shortlist of ten publication venues. This is **not an acceptance prediction** and does not use fabricated impact factors or live submission statistics.
- **Settings** — change subject weighting (0–5), customize live search query.
- **Scheduled refresh** — Python standard-library OpenAlex retriever + RSS generator + GitHub Actions daily run.
- **Weekly email (optional)** — SMTP digest of papers *newly discovered in the past eight days*. Will not send email until SMTP secrets have been configured.

## Cost & language

The public GitHub repository and GitHub Pages hosting are free. GitHub Actions is free for public repositories; OpenAlex has a free daily API budget. No paid service or payment information is required. The top-right language switch changes between 简体中文 and English, and stores the choice in the browser.

## 1. Open the website immediately

Unzip the project, then double-click `index.html`. The bundled 20-paper starter library works **offline**. Live search needs internet access to `https://api.openalex.org` and may be affected by browser/network restrictions or API quotas. Using a local web server is recommended if live search doesn't work from `file://`:

```bash
cd geoai-research-radar
python3 -m http.server 8000
```

Open <http://localhost:8000>.

## 2. Publish free on GitHub Pages

1. Create a new GitHub repository, `mengqi-research-radar`.
2. Upload all files in this folder **including `.github/workflows/update.yml`** (preserve folder structure). Or run `git init`, `git add -A`, commit, and push to the `main` branch.
3. Go to **Settings → Pages → Build and deployment → Source = GitHub Actions**, then save. The repository also includes `.github/workflows/pages.yml` to publish on each update.
4. The website should then be available at `https://mengqili0907.github.io/mengqi-research-radar/` (replace with your actual username/repository name). This is the intended public URL; confirm the Pages deployment has succeeded.
5. In **Actions**, enable workflows if needed; select **Update literature radar → Run workflow** for the first refresh. The daily schedule uses 11:23 UTC and may be delayed by GitHub.

> `Actions` needs repository write permission for the workflow to commit updated `data/papers.js`, `data/papers.json` and `feed.xml`. The included workflow has `permissions: contents: write`. Organization rules or branch protection can still block its push.

## 3. Recommended OpenAlex API key

Basic OpenAlex API queries currently work without a key, but the free key provides a larger daily budget. Apply from [OpenAlex Settings](https://openalex.org/settings/api) after signing in. Do **not** place this key inside frontend JavaScript or commit it to your public repository.

Add a repository secret under **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
| --- | --- |
| `OPENALEX_API_KEY` | Your own free API key (recommended; optional for lightweight requests) |

The Python script automatically reads it from the runner environment. Browser-initiated live search uses the anonymous OpenAlex endpoint, so it doesn't need a user key.

## 4. Optional Monday email digest

The included GitHub Action runs an additional Monday job and sends an email **only if** these secrets are all configured:

| Secret | Description |
| --- | --- |
| `SMTP_HOST` | Your SMTP server hostname |
| `SMTP_PORT` | `465` for SSL, or `587` for STARTTLS |
| `SMTP_USER` | SMTP login username |
| `SMTP_PASSWORD` | App password or SMTP-specific credential — **not your normal account password** |
| `EMAIL_FROM` | Verified sender address accepted by your SMTP service |
| `EMAIL_TO` | Recipient address for the digest |

The digest only includes papers first encountered by the updater within eight days. No recipient address or credentials are included in the repository.

You can also subscribe to the hosted `feed.xml` in Zotero-compatible RSS readers, Feedly, or other RSS tools. For RSS, use your actual GitHub Pages URL plus `/feed.xml`.

**No email is sent from a local copy** of the site. The site itself also does not store SMTP credentials. GitHub Actions (or another server-side runner) is necessary for unattended updates or emails.

## 5. Customize the research topics

Edit `config/topics.json` to modify the server-side daily queries. Initial queries cover:

- wildfire smoke, PM₂.₅ exposure and environmental justice;
- mobility and disaster evacuation;
- mobility-adjusted exposure assessment;
- GeoAI, foundation models and remote sensing;
- urban resilience and spatially varying methods;
- recent Los Angeles wildfire studies.

Your **browser settings and saved papers are local-only**. They do *not* modify the GitHub Action's configuration. To apply scheduled query changes, commit the updated `config/topics.json` to the repository.

## 6. Run the updater locally

Python 3.10+, no third-party packages required:

```bash
# optional: export OPENALEX_API_KEY="your-key-here"
python3 scripts/update_papers.py
python3 -m http.server 8000
```

The script queries OpenAlex, merges existing papers, deduplicates by DOI/OpenAlex ID, and writes `data/papers.js` (used by the site), `data/papers.json` (machine-readable), and `feed.xml` (RSS). Rate limits and network errors are handled by retries; if all queries fail, it leaves existing files untouched and exits with an error. Depending on OpenAlex metadata completeness, abstracts/authors/citation counts may be absent for some records.

## 7. What the score means

The on-screen score uses a **transparent heuristic**: overlaps with the topic categories in your Settings, modest bonuses for strongly related topic combinations, and a recency bonus. This is not an LLM semantic relevance model or a peer-review assessment. A high score only suggests the paper is worth *considering* for your research; it says nothing reliable about quality, methodological rigor or publication probability.

Journal matching is also a keyword/subject-area rule set — read the current journal scope and editorial policies before submitting. The system doesn't infer impact factor, quartile, APC, turnaround time or acceptance rate.

## File structure

```text
geoai-research-radar/
├── index.html                 # main dashboard, runs offline with starter data
├── assets/
│   ├── style.css              # responsive design
│   └── app.js                 # filters, live search, saves, exports and journal matching
├── data/
│   ├── papers.js              # starter/live papers embedded for file:// use
│   └── papers.json            # machine-readable papers and update metadata
├── config/topics.json         # scheduled search configuration
├── scripts/
│   ├── update_papers.py       # OpenAlex data fetch + RSS
│   └── send_digest.py         # optional SMTP digest
├── .github/workflows/update.yml
├── feed.xml
└── README.md
```

## Privacy and limitations

- No third-party user analytics or tracking scripts.
- The browser saves preferences, favorite papers and recent live-search results in `localStorage`. It does **not** sync devices. Export backups periodically.
- Links can point to paywalled papers; OA labels reflect public metadata and may contain errors.
- Starter summaries are short original orientation notes, **not verbatim article abstracts**. Once OpenAlex metadata is fetched, the site shows the reconstructed public abstract when available.
- OpenAlex may not index every new publication immediately. `publication_date` is not the same as ingestion date. Regular scheduled keyword searches are not a guarantee of complete literature surveillance.
- Data fetching cannot be verified from this offline construction environment; the app includes real API handling and fallback starter data, but live OpenAlex availability depends on your connection, API limits, and the service status.

### Credits

Paper metadata is retrieved from [OpenAlex](https://openalex.org/) and the starter bibliographic references are grounded in DOI/publisher records. External publication logos, publisher PDFs and paper full text are **not** hosted or republished by this app.
