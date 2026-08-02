type Rect = Pick<DOMRect, "left" | "top" | "width" | "height">;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function getParallaxOffset(
  clientX: number,
  clientY: number,
  rect: Rect,
  maxOffset = 10,
) {
  if (rect.width <= 0 || rect.height <= 0) {
    return { x: 0, y: 0 };
  }

  const xRatio = ((clientX - rect.left) / rect.width - 0.5) * 2;
  const yRatio = ((clientY - rect.top) / rect.height - 0.5) * 2;

  return {
    x: Math.round(clamp(xRatio, -1, 1) * maxOffset * 100) / 100,
    y: Math.round(clamp(yRatio, -1, 1) * maxOffset * 100) / 100,
  };
}
