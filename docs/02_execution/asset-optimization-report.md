# Asset Optimization Report

Updated: 2026-07-05

## Summary

- Manifest-tracked source/download assets: 54 files, 264.42 MB
- Proposed scroll tile size: 1024px
- Proposed scroll tile levels: 100%, 50%, 25%
- Display WebP derivatives: 51 files, 26.46 MiB
- Current `app/assets` total after derivatives: 105 files, 290.88 MiB

## Implemented Display Derivatives

- Generated WebP display derivatives with `npm run assets:optimize:display`.
- Original display inputs: 170.61 MiB.
- Optimized display outputs: 26.46 MiB.
- Estimated browser payload reduction for optimized display images: 144.16 MiB.
- Runtime display paths now prefer `app/assets/optimized/**.webp` for landing, map, header, scroll, and cold-knowledge images.
- Original PNG/JPG files and ZIP download packs remain in place for source fidelity and download behavior.

## Manifest Asset Size By Group

| Group | Files | Size |
| --- | --- | --- |
| cold-knowledge | 40 | 94.54 MB |
| downloads | 3 | 93.81 MB |
| scroll | 3 | 61.94 MB |
| header | 5 | 7.69 MB |
| landing | 2 | 4.31 MB |
| map | 1 | 2.13 MB |

## Manifest Asset Size By Extension

| Extension | Files | Size |
| --- | --- | --- |
| .png | 48 | 108.67 MB |
| .zip | 3 | 93.81 MB |
| .jpg | 3 | 61.94 MB |

## Largest Manifest Files

| File | Size |
| --- | --- |
| downloads/西湖繁胜冷识集-湖山岁时-24张.zip | 56.46 MB |
| downloads/西湖繁胜冷识集-湖上烟火-12张.zip | 26.17 MB |
| scroll/north-bank/葛岭寺观平章第.jpg | 21.15 MB |
| scroll/north-bank/巨石山下大石佛.jpg | 20.75 MB |
| scroll/north-bank/孤山四圣延祥观.jpg | 20.04 MB |
| downloads/西湖繁胜冷识集-卷中微识-4张.zip | 11.17 MB |
| cold-knowledge/juanzhong-weishi/02.png | 3.01 MB |
| cold-knowledge/juanzhong-weishi/04.png | 2.87 MB |
| cold-knowledge/juanzhong-weishi/01.png | 2.86 MB |
| cold-knowledge/hushan-sui-shi/13.png | 2.81 MB |
| cold-knowledge/juanzhong-weishi/03.png | 2.71 MB |
| cold-knowledge/hushan-sui-shi/12.png | 2.63 MB |

## Scroll Tile Plan

| Segment | Source | Levels | Tiles |
| --- | --- | --- | --- |
| sisheng-yanxiang-guan | 9449x2480 | 100%:10x3<br>50%:5x2<br>25%:3x1 | 43 |
| geling-pingzhang-di | 9449x2480 | 100%:10x3<br>50%:5x2<br>25%:3x1 | 43 |
| volume-dashifo-yuan | 9449x2480 | 100%:10x3<br>50%:5x2<br>25%:3x1 | 43 |

## Recommendations

- Done: WebP display derivatives now cover landing, map, header, scroll, and cold-knowledge images while keeping original PNG/JPG files and ZIP packs.
- Next priority: generate and wire 1024px scroll tiles at 100%, 50%, and 25% levels. This makes the scroll view eligible for true viewport-level lazy loading instead of loading full-width scroll images.
- Optional: evaluate AVIF for cold-knowledge cards after confirming visual fidelity against the current WebP outputs.
- Keep the confirmed `app/index.html` presentation unchanged until the tiled renderer has its own E2E coverage.
