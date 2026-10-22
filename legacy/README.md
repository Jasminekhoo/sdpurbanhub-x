# Legacy / archived prototype (not part of the running app)

This folder holds the **first-iteration prototype** of UrbanHub-X (internal
codename "LivinCare"). It is kept for reference only.

## Why it is here

The current app has **three role consoles** driven by a single data layer:

| Role | Entry point | Data source |
| --- | --- | --- |
| Resident (user) | `src/views/resident/ResidentContainer.jsx` | `src/data/nightSafeData.js` |
| Security | `src/views/security/SecurityDashboard.jsx` | `src/data/nightSafeData.js` |
| Property | `src/views/property/PropertyDashboard.jsx` | `src/data/nightSafeData.js` |

All three read from one provider: `src/context/NightSafeContext.jsx`.

The files in `legacy/` belong to an **abandoned second data layer** that is not
imported anywhere — `src/main.jsx` only mounts `NightSafeProvider`, and
`AppProvider` / `useApp` had zero references across the whole repository.
Nothing in `legacy/` is rendered, no state is written from it, and it cannot
affect the UI.

## The problem it caused

`legacy/src/data/seedData.js` describes a completely different world from the
one the three consoles now show:

| | Legacy (`seedData.js`) | Current (`nightSafeData.js`) |
| --- | --- | --- |
| Resident | Alex Chen | Aina |
| Township | Aster Residence, Tower B · Unit 12-08 | City of Elmina (L-01 … L-08) |
| Access | NFC card `TK-8821-99B4` | Checkpoint lamps + duress PIN |
| Records | `LC-1001`, `FAC-201`, `SEC-…` | `HZ-1xx`, `AL-xxx`, `CP-3xx` |
| Storage keys | `livin_*` | `ns_*` |

Two databases with two casts of residents and two sets of IDs in one repo is
what made the UI data drift from the three features. Keeping the dead one out
of `src/` prevents it from being edited by mistake again.

## Contents

- `legacy/src/context/AppContext.jsx` — the retired provider (role `user` / `admin`).
- `legacy/src/data/seedData.js` — the retired seed data.
- `legacy/src/data/reportDetailsData.{js,json}` — retired hazard photo catalogue.
- `legacy/src/views/admin/*` — retired Property/Admin console (8 screens).
- `legacy/src/views/resident/*` — retired resident screens (11 screens).
- `legacy/src/views/{LoginView,WelcomeView}.jsx` — retired entry screens.
- `legacy/src/components/*` — components only the retired screens used.
- `legacy/public/*`, `legacy/pictures/*` — photos only `reportDetailsData` referenced.

## Bringing any of it back

Nothing here is deleted — it is only moved. To restore a file:

```bash
git mv legacy/src/views/admin/AdminDashboard.jsx src/views/admin/AdminDashboard.jsx
```

...then re-add the import. Note that legacy screens call `useApp()` from
`../../context/AppContext`, so restoring one means restoring
`legacy/src/context/AppContext.jsx` and `legacy/src/data/seedData.js` too, and
mounting `AppProvider` in `src/main.jsx`.

Do **not** restore both providers as-is: the legacy one has no schema
versioning and no cross-role synchronisation, which is what caused the drift in
the first place.
