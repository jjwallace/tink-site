# @nest/shared

Canonical home for assets used by more than one nest sibling (currently `site` and eventually `native` / `companion`).

```
shared/
└── assets/
    ├── sfx/          ← sound effects
    └── sphere/       ← T.I.N.K sphere visuals
```

## Usage

Apps resolve `@shared/*` via a Vite alias to this directory. Example:

```ts
import sphereSvg from "@shared/sphere/sphere.svg";
import hoverUrl from "@shared/sfx/sfx-orb-hover.mp3?url";
```

## Migration story

- **Site** (new): reads from here.
- **Native**: still has its own copies under `native/public/assets/` — unchanged for now. Next time native is touched, point its build at this folder and delete the duplicates.

When in doubt, edit here. Improvements propagate.
