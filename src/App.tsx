import { useState, useEffect, useCallback } from 'react';

const GEMS = ['💎', '💠', '🔴', '🟢', '🟡', '🟣', '🟠'];
const COLS = 8;
const ROWS = 8;

function makeGrid() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => GEMS[Math.floor(Math.random() * GEMS.length)])
  );
}

function crush(grid: string[][], r: number, c: number): string[][] {
  const newGrid = grid.map(row => [...row]);
  const gem = newGrid[r][c];
  if (!gem) return newGrid;
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (newGrid[i][j] === gem) newGrid[i][j] = '';
    }
  }
  for (let c2 = 0; c2 < COLS; c2++) {
    const col = [];
    for (let r2 = ROWS - 1; r2 >= 0; r2--) {
      if (newGrid[r2][c2]) col.push(newGrid[r2][c2]);
    }
    while (col.length < ROWS) col.unshift('');
    for (let r2 = 0; r2 < ROWS; r2++) newGrid[r2][c2] = col[r2];
  }
  return newGrid;
}

export default function App() {
  const [grid, setGrid] = useState<string[][]>([]);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<[number,number] | null>(null);

  const init = useCallback(() => { setGrid(makeGrid()); setScore(0); setSelected(null); }, []);
  useEffect(() => { init(); }, [init]);

  const handleClick = (r: number, c: number) => {
    if (!grid[r][c]) return;
    if (!selected) { setSelected([r, c]); return; }
    const [pr, pc] = selected;
    if (pr === r && pc === c) { setSelected(null); return; }
    const newGrid = crush(grid, r, c);
    setGrid(newGrid);
    setScore(s => s + 10);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-black flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-2">💎 Gem Burst Rush</h1>
      <p className="text-blue-300 mb-4">Score: {score}</p>
      <button onClick={init} className="mb-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold">New Game</button>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(' + COLS + ', 1fr)' }}>
        {grid.map((row, r) => row.map((gem, c) => (
          <button key={r+'-'+c} onClick={() => handleClick(r, c)}
            className={'w-10 h-10 sm:w-12 sm:h-12 rounded-lg text-2xl flex items-center justify-center transition-all ' +
              (gem ? 'bg-slate-800 hover:bg-slate-700 shadow-md' : 'bg-slate-800/50') +
              (selected && selected[0]===r && selected[1]===c ? ' ring-4 ring-yellow-400' : '')}>
            {gem}
          </button>
        )))}
      </div>
      <p className="text-slate-400 text-sm mt-4">Tap a gem to crush all matching gems!</p>
    </div>
  );
}
