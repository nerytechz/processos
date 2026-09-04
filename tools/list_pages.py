"""Lista pages publicadas via REST. Sem insert."""
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


def main() -> int:
    env = load_env(ENV_PATH)
    url = (env.get("SUPABASE_URL") or os.environ.get("SUPABASE_URL") or "").rstrip("/")
    key = env.get("SUPABASE_ANON_KEY") or os.environ.get("SUPABASE_ANON_KEY") or ""
    if not url or not key:
        print("FALHA: SUPABASE_URL / SUPABASE_ANON_KEY ausentes")
        return 1

    endpoint = f"{url}/rest/v1/pages?select=id,slug,title,published,created_at&order=created_at.desc"
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Accept": "application/json",
    }
    req = urllib.request.Request(endpoint, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            body = res.read().decode("utf-8", errors="replace")
            print(f"OK HTTP {res.status}")
            print(body)
            return 0
    except urllib.error.HTTPError as err:
        print(f"FALHA HTTP {err.code} {err.read()[:300].decode('utf-8', errors='replace')}")
        return 2


if __name__ == "__main__":
    sys.exit(main())
