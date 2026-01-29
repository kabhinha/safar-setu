# Sikkim Demo Seed Data

This document describes the `seed_sikkim_demo` management command, which populates the database with a Sikkim-themed demo dataset for the Kiosk pilot.

## Overview

The command replaces existing demo data with a consistent set of:
- **Hotspots**: 16-24 locations across Gangtok, Namchi, Gyalshing, and Mangan.
- **Sights**: Monasteries, Viewpoints, and Heritage sites.
- **Commerce**: Local products (Tea, Handicrafts) and vendors.
- **Safety**: Broadcast messages, District restrictions, and Emergency contacts.
- **Crowd**: Simulated crowd density aggregates.

## Usage

### Reset and Seed
To completely reset seed data (flush old seed data and recreate):

```bash
# Windows PowerShell
$env:ALLOW_SEED_RESET="true"; python manage.py seed_sikkim_demo --reset

# Linux/Mac
ALLOW_SEED_RESET=true python manage.py seed_sikkim_demo --reset
```

> [!WARNING]
> The `--reset` flag will delete all data created by the seed bot (`sikkim_seed_bot`) and specific seed vendors/districts. Run with caution.

### Seed Only (No Deletion)
To add missing seed data without deleting existing:

```bash
python manage.py seed_sikkim_demo
```

## Data Coverage

| Module | Items | Description |
|os|---|---|
| **Districts** | 4 | Gangtok, Namchi, Gyalshing, Mangan |
| **Hotspots** | ~12 | Scenic spots like MG Marg, Temi Tea Garden |
| **Sights** | ~8 | Monasteries, Startues, Viewpoints |
| **Products** | 10 | Local items linked to vendors 5001-5004 |
| **Safety** | ~5 | Active alerts and emergency numbers |

## Safety Mechanisms

The command includes a safety guard to prevent accidental data loss in production.
- Unless `DEBUG=True` (Dev env), you must verify the intention by setting `ALLOW_SEED_RESET=true`.
