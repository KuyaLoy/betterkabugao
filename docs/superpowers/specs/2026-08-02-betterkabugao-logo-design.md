# BetterKabugao Logo Design

- **Status:** Approved direction; awaiting written-spec review
- **Brand:** BetterKabugao
- **Primary use:** Website header, favicon, social profiles, and project documentation

## Direction

The logo will follow the visual language used by BetterLGU projects without copying another portal's mark. It will combine a simplified silhouette of Kabugao with a small three-ray sunrise and a bold, friendly wordmark.

The Kabugao silhouette will be traced from the municipality highlighted in the map supplied by the project owner. It should remain recognizable while using few enough points to stay clear at small sizes. The sunrise will use three rays rather than a government-style sun emblem. The logo must not resemble an official municipal seal.

## Color

The primary palette follows the recurring BetterLGU blue and yellow:

- Civic blue: `#0032A0`
- Sunrise yellow: `#F2C81D`
- Ink for supporting text: `#111827`
- White: `#FFFFFF`

The main mark will use civic blue for the Kabugao silhouette and sunrise yellow for the rays. A one-color version must also work in solid blue or solid white.

## Logo System

The implementation will provide three SVG assets:

1. `betterkabugao-logo.svg` — horizontal mark and wordmark.
2. `betterkabugao-mark.svg` — standalone Kabugao symbol for compact placements.
3. `favicon.svg` — simplified square-safe mark tested at 16, 24, 32, and 48 pixels.

The website header will use the standalone mark beside real HTML text for the name. This keeps the name accessible, responsive, and easy to edit. The horizontal SVG remains available for social graphics and documents.

## SVG Construction

- Use an explicit `viewBox` and scalable vector paths.
- Keep the municipality outline, sunrise, and wordmark in named groups.
- Store colors in a short internal style block so they are easy to change.
- Use flat fills only: no gradients, shadows, filters, clipping effects, or 3D treatment.
- Do not embed PNG, JPEG, base64 data, external fonts, or external stylesheets.
- Include a concise `<title>` and `<desc>` in the horizontal logo.
- Use live text in the editable horizontal master with a safe sans-serif font stack.
- Keep the mark readable on white and dark blue backgrounds.

## Shape Rules

- Preserve the broad proportions and distinctive lower and right edges of the Kabugao map silhouette.
- Simplify minor boundary noise that disappears at favicon size.
- Place three short yellow rays behind the upper portion of the silhouette.
- Do not add a river, road, mountain, or cultural pattern unless its meaning is verified later.
- Avoid map pins, shields, circular seals, flags, and official insignia.

## Validation

The final assets must:

- parse as valid XML;
- contain no embedded raster images or external resource references;
- render without cropping at favicon, header, and social-logo sizes;
- retain a recognizable silhouette in one color;
- maintain clear contrast on light and dark backgrounds; and
- match the approved blue and yellow values exactly.

Temporary PNG previews may be generated for visual review, but SVG files are the source of truth.
