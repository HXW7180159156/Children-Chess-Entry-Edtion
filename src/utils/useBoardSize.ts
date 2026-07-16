import { useState, useEffect } from 'react'

/**
 * Returns an adaptive chessboard size (in px) that fits within the viewport.
 * Updates automatically when the browser window is resized.
 */
export function useBoardSize(): number {
  const compute = () => {
    const horizontal = window.innerWidth - 32; // account for px-4 side padding (16px × 2)
    const vertical = Math.round(window.innerHeight * 0.55); // leave room for UI chrome
    return Math.max(200, Math.min(horizontal, vertical, 560));
  };

  const [size, setSize] = useState(compute);

  useEffect(() => {
    const onResize = () => setSize(compute());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
}
