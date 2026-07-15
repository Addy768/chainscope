"""Static country reference data used by the pure-Python risk model.

Sources:
- WGI Political Stability (2023, standardised) — World Bank, CC-BY 4.0
- Distance from a US primary port (Long Beach, LB=33.7°N/-118.2°W) — Haversine
- Free-zone flag — public trade classifications

Kept static + auditable so the risk model runs without training data.
"""
from __future__ import annotations

import math
from typing import Iterable

# (country, lat, lon, political_stability_-2.5_to_2.5, tariff_pct_electronics, free_zone)
_ROWS: list[tuple[str, float, float, float, float, bool]] = [
    ("China",         35.0,  103.0, -0.30,  7.5, False),
    ("Taiwan",        23.6,  121.0,  0.90,  0.0, False),
    ("South Korea",   35.9,  127.7,  0.55,  0.0, False),
    ("Japan",         36.2,  138.3,  1.00,  0.0, False),
    ("Vietnam",       14.1,  108.3,  0.15,  9.0, False),
    ("Malaysia",       4.2,  101.9,  0.30,  4.5, False),
    ("Singapore",      1.4,  103.8,  1.40,  0.0, True),
    ("Hong Kong",     22.3,  114.1,  0.65,  0.0, True),
    ("Thailand",      15.9,  100.9, -0.35,  5.5, False),
    ("Philippines",   12.9,  121.8, -0.50,  6.0, False),
    ("India",         20.6,   78.9, -0.75, 12.0, False),
    ("Indonesia",     -0.8,  113.9, -0.20,  8.0, False),
    ("Germany",       51.1,   10.5,  0.75,  1.5, False),
    ("United States", 39.7,  -95.0,  0.20,  0.0, False),
    ("Mexico",        23.6, -102.5, -0.90,  3.0, False),
    ("Brazil",       -14.2,  -51.9, -0.30, 14.0, False),
    ("UAE",           23.4,   53.8,  0.45,  0.0, True),
]

_PORT = (33.7, -118.2)  # Long Beach, CA


def _haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = p2 - p1
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def all_countries() -> list[str]:
    return [r[0] for r in _ROWS]


def lookup(name: str) -> dict:
    """Look up a country's static features (case-insensitive)."""
    key = name.strip().lower()
    for country, lat, lon, wgi, tariff, fz in _ROWS:
        if country.lower() == key:
            return {
                "country": country,
                "lat": lat,
                "lon": lon,
                "distance_km": round(_haversine(lat, lon, *_PORT), 1),
                # Country risk: 0 (safest) to 1 (riskiest) — inverse of WGI, scaled.
                "country_risk": round(min(1.0, max(0.0, (1.0 - (wgi + 2.5) / 5.0))), 4),
                "tariff_pct": tariff,
                "free_zone_flag": fz,
            }
    return {}


def known(name: str) -> bool:
    return bool(lookup(name))


def enrich(names: Iterable[str]) -> list[dict]:
    return [lookup(n) for n in names if lookup(n)]
