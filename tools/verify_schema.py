"""Confirma schema do caderno apos architecture/schema-caderno.sql."""
from __future__ import annotations

import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENV_PATH = ROOT / ".env"


def load_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.is_file():
        return values
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        values[key.strip()] = val.strip().strip('"').strip("'")
    return values


def get(url: str, headers: dict[str, str], timeout: float = 15.0) -> tuple[int, str]:
    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as res:
            body = res.read().decode("utf-8", errors="replace")
            return res.status, body
    except urllib.error.HTTPError as err:
        body = err.read().decode("utf-8", errors="replace")
        return err.code, body


def main() -> int:
    env = load_env(ENV_PATH)
    url = (env.get("SUPABASE_URL") or os.environ.get("SUPABASE_URL") or "").rstrip("/")
    key = env.get("SUPABASE_ANON_KEY") or os.environ.get("SUPABASE_ANON_KEY") or ""
    if not url or not key:
        print("FALHA: SUPABASE_URL / SUPABASE_ANON_KEY ausentes no .env")
        return 1

    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Accept": "application/json",
    }

    pages_status, pages_body = get(f"{url}/rest/v1/pages?select=id&limit=1", headers)
    audio_status, audio_body = get(f"{url}/storage/v1/bucket/audio", headers)
    images_status, images_body = get(f"{url}/storage/v1/bucket/images", headers)

    pages_ok = pages_status == 200
    audio_ok = audio_status == 200
    images_ok = images_status == 200

    print(("OK" if pages_ok else "FALHA") + f" pages HTTP {pages_status} {pages_body[:160].replace(chr(10), ' ')}")
    print(("OK" if audio_ok else "FALHA") + f" bucket audio HTTP {audio_status} {audio_body[:160].replace(chr(10), ' ')}")
    print(("OK" if images_ok else "FALHA") + f" bucket images HTTP {images_status} {images_body[:160].replace(chr(10), ' ')}")

    if pages_ok and audio_ok and images_ok:
        print("SCHEMA OK")
        return 0

    if pages_ok and not (audio_ok and images_ok):
        print("TABELAS OK - rode architecture/schema-buckets.sql no SQL Editor.")
        return 2

    print("SCHEMA AUSENTE - rode architecture/schema-caderno.sql no SQL Editor.")
    return 2


if __name__ == "__main__":
    sys.exit(main())
