// axe reports table cells that a horizontal Table scroller partly clips as "incomplete" color-contrast
// ("partially obscured by another element"): it cannot sample a background that is scrolled out of view.
// This happens when the table is wider than its scroller, as with Linux's wider fallback fonts in CI.
// Accept such a node only when it is a cell inside a scrolling .dmf-table-scroll and its text measures at
// least 4.5:1 against its nearest opaque background. Every other incomplete result is returned unchanged.
export async function reviewScrolledTableCells(page, incomplete) {
  const reviews = await page.evaluate(incomplete => incomplete.map(rule => ({
    ...rule,
    nodes: rule.nodes.map(node => {
      const element = node.target.length === 1 ? document.querySelector(node.target[0]) : null;
      const scroller = element?.closest('.dmf-table-scroll');
      const cell = element?.closest('td,th');
      if (rule.id !== 'color-contrast' || !node.summary?.includes('partially obscured') || !cell || !scroller || scroller.scrollWidth <= scroller.clientWidth) return { ...node, accepted: false };
      const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
      const rgba = color => { context.clearRect(0, 0, 1, 1); context.fillStyle = color; context.fillRect(0, 0, 1, 1); return [...context.getImageData(0, 0, 1, 1).data]; };
      let background = null;
      for (let current = element; current && !background; current = current.parentElement) { const color = rgba(getComputedStyle(current).backgroundColor); if (color[3] === 255) background = color; }
      const foreground = rgba(getComputedStyle(element).color);
      if (!background || foreground[3] !== 255) return { ...node, accepted: false };
      const luminance = color => color.slice(0, 3).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
      const a = luminance(foreground), b = luminance(background), ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
      return { ...node, ratio: Math.round(ratio * 100) / 100, accepted: ratio >= 4.5 };
    }),
  })), incomplete);
  return reviews.map(rule => ({ ...rule, nodes: rule.nodes.filter(node => !node.accepted) })).filter(rule => rule.nodes.length);
}
