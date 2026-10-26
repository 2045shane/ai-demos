#!/usr/bin/env python3
"""Submit changed GitHub Pages HTML URLs to IndexNow.

The key is public on purpose: IndexNow verifies ownership by fetching
the key file from the site. A non-2xx response is logged and ignored so
this job cannot fail the Pages publish.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from urllib.parse import quote

BASE = "https://2045shane.github.io/ai-demos"
HOST = "2045shane.github.io"
KEY = "13ee8bfde5e7821dfb1ff9dfb3065ae3"
KEY_LOCATION = f"{BASE}/{KEY}.txt"
ENDPOINT = "https://api.indexnow.org/indexnow"
RETRYABLE_HTTP = {403, 408, 422, 429, 500, 502, 503, 504}
# Immediate try, then give Pages time to publish the key file.
RETRY_WAITS_SECONDS = (0, 30, 60, 90)


def git_lines(*args: str) -> list[str]:
    output = subprocess.check_output(["git", *args], text=True)
    return [line.strip() for line in output.splitlines() if line.strip()]


def changed_html_paths() -> list[str]:
    event = os.environ.get("EVENT_NAME", "")
    if event == "workflow_dispatch":
        print("workflow_dispatch: submitting every tracked HTML page.")
        return git_lines("ls-files", "*.html")

    before = os.environ.get("BEFORE", "")
    sha = os.environ.get("SHA") or "HEAD"
    if not before or set(before) == {"0"}:
        print("Push has no parent commit; submitting every tracked HTML page.")
        return git_lines("ls-files", "*.html")

    try:
        changed = git_lines(
            "diff",
            "--name-only",
            "--diff-filter=AMR",
            before,
            sha,
        )
    except subprocess.CalledProcessError as exc:
        print(
            f"::warning::Could not diff {before}..{sha} ({exc}). "
            "Submitting every tracked HTML page."
        )
        return git_lines("ls-files", "*.html")

    return [path for path in changed if path.lower().endswith(".html")]


def to_url(path: str) -> str | None:
    rel = path.replace("\\", "/").strip()
    if rel.startswith("./"):
        rel = rel[2:]
    if not rel.lower().endswith(".html"):
        return None
    if rel.startswith("/") or rel.startswith("../") or "/../" in f"/{rel}":
        print(f"::warning::Skipping unexpected path: {path}")
        return None
    if rel == "index.html":
        return f"{BASE}/"
    encoded = "/".join(quote(part, safe="") for part in rel.split("/"))
    return f"{BASE}/{encoded}"


def url_list() -> list[str]:
    urls: list[str] = []
    seen: set[str] = set()
    for path in changed_html_paths():
        url = to_url(path)
        if url and url not in seen:
            seen.add(url)
            urls.append(url)
    home = f"{BASE}/"
    if urls and home not in seen:
        urls.insert(0, home)
    return urls


def post(payload: dict) -> tuple[int, str]:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        ENDPOINT,
        data=body,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            text = response.read().decode("utf-8", "replace")
            return response.status, text
    except urllib.error.HTTPError as exc:
        text = exc.read().decode("utf-8", "replace")
        return exc.code, text


def main() -> int:
    urls = url_list()
    if not urls:
        print("No changed or new HTML pages. Skipping IndexNow.")
        return 0

    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }
    print(f"IndexNow endpoint: {ENDPOINT}")
    print(f"keyLocation: {KEY_LOCATION}")
    print("URL list:")
    for url in urls:
        print(f"  {url}")

    if os.environ.get("INDEXNOW_DRY_RUN") == "1":
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        print("INDEXNOW_DRY_RUN=1; not sending the request.")
        return 0

    last = "no response"
    for attempt, wait in enumerate(RETRY_WAITS_SECONDS, start=1):
        if wait:
            print(
                f"Waiting {wait}s before attempt {attempt}/{len(RETRY_WAITS_SECONDS)} "
                "(Pages may still be publishing the key file)."
            )
            time.sleep(wait)
        try:
            status, text = post(payload)
        except Exception as exc:  # noqa: BLE001 — fail soft on any transport error
            last = f"{type(exc).__name__}: {exc}"
            print(f"::warning::IndexNow request failed: {last}")
            continue

        body = text.strip() or "(empty body)"
        last = f"HTTP {status}: {body}"
        print(f"IndexNow attempt {attempt}: {last}")
        if 200 <= status < 300:
            print("IndexNow accepted the URL list.")
            return 0
        print(f"::warning::IndexNow returned {last}")
        if status not in RETRYABLE_HTTP:
            break

    print("::warning::IndexNow did not accept the URLs. GitHub Pages is unaffected.")
    print(f"Last result: {last}")
    print(
        "After "
        f"{KEY_LOCATION} is publicly reachable, rerun this workflow with "
        "workflow_dispatch."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
