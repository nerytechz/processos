"""Handshake mínimo: Supabase Auth + REST. Sem CRUD."""
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


def rest_ok(name: str, status: int, body: str) -> bool:
    if "Invalid API key" in body:
        return False
    if name == "auth_health":
        return 200 <= status < 300
    if name == "rest":
        # 404 = PostgREST no ar, tabela ainda nao criada (esperado na Fase L)
        return status in {200, 206, 404, 406}
    if name == "storage":
        return 200 <= status < 300
    return 200 <= status < 300


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
        print("FALHA: defina SUPABASE_URL e SUPABASE_ANON_KEY em .env")
        print("Copie .env.example para .env e preencha com o projeto Supabase.")
        return 1

    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
    }

    checks = [
        ("auth_health", f"{url}/auth/v1/health", {}),
        (
            "rest",
            f"{url}/rest/v1/pages",
            {"Accept": "application/json", "Range": "0-0"},
        ),
        ("storage", f"{url}/storage/v1/bucket", {}),
    ]

    ok = True
    for name, endpoint, extra in checks:
        status, body = get(endpoint, {**headers, **extra})
        snippet = body[:180].replace("\n", " ")
        passed = rest_ok(name, status, body)
        ok = ok and passed
        mark = "OK" if passed else "FALHA"
        print(f"{mark} {name} HTTP {status} {endpoint}")
        if snippet:
            print(f"     {snippet}")

    if ok:
        print("LINK OK - Auth, REST e Storage responderam.")
        return 0

    print("LINK QUEBRADO - nao seguir para logica completa.")
    return 2


if __name__ == "__main__":
    sys.exit(main())
