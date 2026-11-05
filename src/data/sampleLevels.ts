import { ArrowItem } from '../solver/puzzleEngine';

export interface LevelDefinition {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  boardSize: number; // e.g. 6x6 or 8x8
  description: string;
  arrows: ArrowItem[];
}

export const SAMPLE_LEVELS: LevelDefinition[] = [
  {
    id: 'lvl-1',
    name: 'Level 1: Straight Clearance',
    difficulty: 'Easy',
    boardSize: 6,
    description: 'Straight orthogonal arrows with sequential escape paths.',
    arrows: [
      { id: 'a1', x: 2, y: 1, direction: 'UP', color: '#38bdf8', label: 'A1' },
      { id: 'a2', x: 2, y: 3, direction: 'UP', color: '#f43f5e', label: 'A2' },
      { id: 'a3', x: 4, y: 3, direction: 'LEFT', color: '#10b981', label: 'A3' },
      { id: 'a4', x: 4, y: 5, direction: 'UP', color: '#fbbf24', label: 'A4' },
      { id: 'a5', x: 1, y: 3, direction: 'LEFT', color: '#a855f7', label: 'A5' },
    ],
  },
  {
    id: 'lvl-2',
    name: 'Level 2: 90° Curved Arrows',
    difficulty: 'Medium',
    boardSize: 6,
    description: 'Features curved arrows that turn 90 degrees around obstacles.',
    arrows: [
      { id: 'c1', x: 1, y: 1, direction: 'UP', isCurved: true, curveTurn: 'CLOCKWISE', color: '#ec4899', label: 'C1' }, // Exits RIGHT
      { id: 'c2', x: 4, y: 1, direction: 'RIGHT', color: '#06b6d4', label: 'C2' }, // Exits RIGHT
      { id: 'c3', x: 4, y: 3, direction: 'UP', isCurved: true, curveTurn: 'COUNTER_CLOCKWISE', color: '#eab308', label: 'C3' }, // Exits LEFT
      { id: 'c4', x: 2, y: 4, direction: 'DOWN', color: '#8b5cf6', label: 'C4' }, // Exits DOWN
      { id: 'c5', x: 2, y: 2, direction: 'DOWN', color: '#10b981', label: 'C5' }, // Blocked by C4
    ],
  },
  {
    id: 'lvl-3',
    name: 'Level 3: Multi-Layer Overlap',
    difficulty: 'Hard',
    boardSize: 8,
    description: 'Dense interlocking grid requiring multi-step cascading resolution.',
    arrows: [
      { id: 'm1', x: 2, y: 2, direction: 'UP', color: '#ef4444', label: 'M1' },
      { id: 'm2', x: 4, y: 2, direction: 'UP', color: '#3b82f6', label: 'M2' },
      { id: 'm3', x: 2, y: 4, direction: 'RIGHT', color: '#10b981', label: 'M3' },
      { id: 'm4', x: 4, y: 4, direction: 'DOWN', color: '#f59e0b', label: 'M4' },
      { id: 'm5', x: 6, y: 4, direction: 'RIGHT', color: '#8b5cf6', label: 'M5' },
      { id: 'm6', x: 2, y: 6, direction: 'LEFT', color: '#06b6d4', label: 'M6' },
      { id: 'm7', x: 4, y: 6, direction: 'UP', color: '#ec4899', label: 'M7' },
      { id: 'm8', x: 6, y: 2, direction: 'RIGHT', color: '#84cc16', label: 'M8' },
    ],
  },
  {
    id: 'lvl-4',
    name: 'Level 4: Spiral Labyrinth',
    difficulty: 'Hard',
    boardSize: 8,
    description: 'Concentric arrows pointing towards external perimeters.',
    arrows: [
      { id: 's1', x: 1, y: 2, direction: 'LEFT', color: '#38bdf8', label: 'S1' },
      { id: 's2', x: 3, y: 2, direction: 'LEFT', color: '#ec4899', label: 'S2' },
      { id: 's3', x: 5, y: 2, direction: 'UP', isCurved: true, curveTurn: 'CLOCKWISE', color: '#10b981', label: 'S3' },
      { id: 's4', x: 5, y: 4, direction: 'RIGHT', color: '#f59e0b', label: 'S4' },
      { id: 's5', x: 3, y: 4, direction: 'DOWN', color: '#a855f7', label: 'S5' },
      { id: 's6', x: 3, y: 6, direction: 'DOWN', color: '#ef4444', label: 'S6' },
      { id: 's7', x: 5, y: 6, direction: 'RIGHT', color: '#06b6d4', label: 'S7' },
    ],
  },
  {
    id: 'lvl-5',
    name: 'Level 5: Deadlock Safety Test',
    difficulty: 'Extreme',
    boardSize: 6,
    description: 'Unsolvable cyclic loop designed to test emergency safety detection.',
    arrows: [
      { id: 'd1', x: 2, y: 2, direction: 'RIGHT', color: '#ef4444', label: 'D1' },
      { id: 'd2', x: 4, y: 2, direction: 'DOWN', color: '#f59e0b', label: 'D2' },
      { id: 'd3', x: 4, y: 4, direction: 'LEFT', color: '#3b82f6', label: 'D3' },
      { id: 'd4', x: 2, y: 4, direction: 'UP', color: '#10b981', label: 'D4' },
    ],
  },
];
