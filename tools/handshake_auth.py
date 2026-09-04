"""Login password grant do editor. Nao imprime access_token."""
from __future__ import annotations

import json
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
    email = env.get("EDITOR_EMAIL") or os.environ.get("EDITOR_EMAIL") or ""
    password = env.get("EDITOR_PASSWORD") or os.environ.get("EDITOR_PASSWORD") or ""

    if not url or not key:
        print("FALHA: SUPABASE_URL / SUPABASE_ANON_KEY ausentes")
        return 1
    if not email or not password:
        print("FALHA: defina EDITOR_EMAIL e EDITOR_PASSWORD no .env")
        print("Crie o user em Authentication > Users > Add user.")
        return 1

    endpoint = f"{url}/auth/v1/token?grant_type=password"
    payload = json.dumps({"email": email, "password": password}).encode("utf-8")
    headers = {
        "apikey": key,
        "Content-Type": "application/json",
    }
    req = urllib.request.Request(endpoint, data=payload, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            body = json.loads(res.read().decode("utf-8", errors="replace"))
            user = body.get("user") or {}
            uid = user.get("id", "")
            print(f"OK HTTP {res.status} user.id={uid}")
            return 0
    except urllib.error.HTTPError as err:
        raw = err.read()[:400].decode("utf-8", errors="replace")
        print(f"FALHA HTTP {err.code} {raw}")
        return 2


if __name__ == "__main__":
    sys.exit(main())
