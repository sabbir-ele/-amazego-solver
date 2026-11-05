/**
 * Amaze GO & Arrow Puzzle Core Engine
 * Pure logic module for arrow representation, trajectory raycasting,
 * collision detection, dependency graph construction, and topological solving.
 */

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'UP_RIGHT' | 'UP_LEFT' | 'DOWN_RIGHT' | 'DOWN_LEFT';

export interface Point {
  x: number;
  y: number;
}

export interface ArrowItem {
  id: string;
  x: number;          // Center or grid X
  y: number;          // Center or grid Y
  direction: Direction;
  length?: number;     // Length of arrow body in grid units (default 1)
  isCurved?: boolean;
  curveTurn?: 'CLOCKWISE' | 'COUNTER_CLOCKWISE'; // 90-degree turn
  color?: string;
  label?: string;
}

export interface ExitRayPoint {
  x: number;
  y: number;
}

export interface DependencyGraphResult {
  dependencies: Record<string, string[]>; // arrowId -> list of arrowIds that block it
  blockedByCount: Record<string, number>;  // in-degree: how many arrows block this arrow
  blocksCount: Record<string, number>;     // how many other arrows this arrow blocks
  freeArrowIds: string[];                 // arrows with 0 blockers
  recommendedSequence: string[];          // optimal removal order
  isSolvable: boolean;
  cycleDetected: boolean;
  cycles?: string[][];
}

/**
 * Returns the unit vector direction [dx, dy]
 */
export function getDirectionVector(dir: Direction): [number, number] {
  switch (dir) {
    case 'UP': return [0, -1];
    case 'DOWN': return [0, 1];
    case 'LEFT': return [-1, 0];
    case 'RIGHT': return [1, 0];
    case 'UP_RIGHT': return [1, -1];
    case 'UP_LEFT': return [-1, -1];
    case 'DOWN_RIGHT': return [1, 1];
    case 'DOWN_LEFT': return [-1, 1];
    default: return [0, -1];
  }
}

/**
 * Returns the effective exit vector accounting for curved arrows
 */
export function getExitDirection(arrow: ArrowItem): Direction {
  if (!arrow.isCurved || !arrow.curveTurn) {
    return arrow.direction;
  }
  
  // 90-degree turn from initial direction
  const clockwiseMap: Record<Direction, Direction> = {
    'UP': 'RIGHT',
    'RIGHT': 'DOWN',
    'DOWN': 'LEFT',
    'LEFT': 'UP',
    'UP_RIGHT': 'DOWN_RIGHT',
    'DOWN_RIGHT': 'DOWN_LEFT',
    'DOWN_LEFT': 'UP_LEFT',
    'UP_LEFT': 'UP_RIGHT',
  };

  const counterMap: Record<Direction, Direction> = {
    'UP': 'LEFT',
    'LEFT': 'DOWN',
    'DOWN': 'RIGHT',
    'RIGHT': 'UP',
    'UP_RIGHT': 'UP_LEFT',
    'UP_LEFT': 'DOWN_LEFT',
    'DOWN_LEFT': 'DOWN_RIGHT',
    'DOWN_RIGHT': 'UP_RIGHT',
  };

  return arrow.curveTurn === 'CLOCKWISE' 
    ? clockwiseMap[arrow.direction] 
    : counterMap[arrow.direction];
}

/**
 * Computes all grid points occupied by an arrow's body
 */
export function getArrowOccupiedPoints(arrow: ArrowItem): Point[] {
  const points: Point[] = [{ x: Math.round(arrow.x), y: Math.round(arrow.y) }];
  const len = Math.max(1, Math.round(arrow.length || 1));
  
  if (len > 1) {
    const [dx, dy] = getDirectionVector(arrow.direction);
    // Body extends backwards from head or forwards
    for (let i = 1; i < len; i++) {
      points.push({
        x: Math.round(arrow.x - dx * i * 0.5),
        y: Math.round(arrow.y - dy * i * 0.5),
      });
    }
  }

  return points;
}

/**
 * Checks if arrow A's exit trajectory hits arrow B
 * @param a The arrow attempting to fly out
 * @param b The potential blocking arrow
 * @param boardBound Maximum grid coordinate for raycasting
 */
export function doesArrowCollide(a: ArrowItem, b: ArrowItem, boardBound: number = 20): boolean {
  if (a.id === b.id) return false;

  const exitDir = getExitDirection(a);
  const [dx, dy] = getDirectionVector(exitDir);
  const bPoints = getArrowOccupiedPoints(b);

  // Tolerance radius in grid coordinates
  const hitRadius = 0.48;

  // Step along arrow A's exit ray
  let currX = a.x + dx * 0.6;
  let currY = a.y + dy * 0.6;
  const maxSteps = boardBound * 2;

  for (let step = 0; step < maxSteps; step++) {
    // If ray has left the board bounds, it escapes freely
    if (currX < -1 || currX > boardBound + 1 || currY < -1 || currY > boardBound + 1) {
      break;
    }

    // Check distance to any occupied point of B
    for (const pt of bPoints) {
      const distSq = (currX - pt.x) ** 2 + (currY - pt.y) ** 2;
      if (distSq <= hitRadius * hitRadius) {
        return true;
      }
    }

    currX += dx * 0.5;
    currY += dy * 0.5;
  }

  return false;
}

/**
 * Computes the full dependency graph for a collection of arrows
 */
export function buildDependencyGraph(arrows: ArrowItem[], boardSize: number = 10): DependencyGraphResult {
  const arrowMap = new Map<string, ArrowItem>();
  arrows.forEach(a => arrowMap.set(a.id, a));

  const dependencies: Record<string, string[]> = {};
  const blockedByCount: Record<string, number> = {};
  const blocksCount: Record<string, number> = {};

  arrows.forEach(a => {
    dependencies[a.id] = [];
    blockedByCount[a.id] = 0;
    blocksCount[a.id] = 0;
  });

  // For each pair of arrows (A, B), check if B blocks A
  for (const a of arrows) {
    for (const b of arrows) {
      if (a.id === b.id) continue;
      if (doesArrowCollide(a, b, boardSize)) {
        dependencies[a.id].push(b.id);
        blockedByCount[a.id] += 1;
        blocksCount[b.id] = (blocksCount[b.id] || 0) + 1;
      }
    }
  }

  // Free arrows: in-degree == 0 (no arrows in its way)
  const freeArrowIds = arrows.filter(a => blockedByCount[a.id] === 0).map(a => a.id);

  // Solve sequence using Kahn's algorithm with priority heuristics
  const { sequence, isSolvable, cycleDetected, cycles } = solveRemovalSequence(arrows, dependencies);

  return {
    dependencies,
    blockedByCount,
    blocksCount,
    freeArrowIds,
    recommendedSequence: sequence,
    isSolvable,
    cycleDetected,
    cycles,
  };
}

/**
 * Solves the optimal removal sequence using Kahn's Algorithm + Backtracking DFS fallback
 */
export function solveRemovalSequence(
  arrows: ArrowItem[],
  dependencies: Record<string, string[]>
): {
  sequence: string[];
  isSolvable: boolean;
  cycleDetected: boolean;
  cycles?: string[][];
} {
  const remaining = new Set(arrows.map(a => a.id));
  const currentInDegree: Record<string, number> = {};
  
  // in-degree of arrow A is how many remaining blockers it has
  arrows.forEach(a => {
    currentInDegree[a.id] = dependencies[a.id].length;
  });

  const sequence: string[] = [];

  while (remaining.size > 0) {
    // Find all arrows currently unblocked
    const available = Array.from(remaining).filter(id => currentInDegree[id] === 0);

    if (available.length === 0) {
      // Deadlock / Cycle detected
      return {
        sequence,
        isSolvable: false,
        cycleDetected: true,
        cycles: detectCycles(Array.from(remaining), dependencies),
      };
    }

    // Heuristic: Pick the arrow that unblocks the most other arrows
    available.sort((a, b) => {
      let unblocksA = 0;
      let unblocksB = 0;
      for (const remId of remaining) {
        if (dependencies[remId].includes(a)) unblocksA++;
        if (dependencies[remId].includes(b)) unblocksB++;
      }
      return unblocksB - unblocksA;
    });

    const chosenId = available[0];
    sequence.push(chosenId);
    remaining.delete(chosenId);

    // Update in-degrees of remaining arrows
    for (const remId of remaining) {
      if (dependencies[remId].includes(chosenId)) {
        currentInDegree[remId] = Math.max(0, currentInDegree[remId] - 1);
      }
    }
  }

  return {
    sequence,
    isSolvable: true,
    cycleDetected: false,
  };
}

/**
 * Detects cycles among locked arrows for debugging and diagnostics
 */
export function detectCycles(arrowIds: string[], dependencies: Record<string, string[]>): string[][] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycles: string[][] = [];

  function dfs(curr: string, path: string[]) {
    visited.add(curr);
    recursionStack.add(curr);
    path.push(curr);

    const blockers = dependencies[curr] || [];
    for (const blocker of blockers) {
      if (!arrowIds.includes(blocker)) continue;

      if (!visited.has(blocker)) {
        dfs(blocker, [...path]);
      } else if (recursionStack.has(blocker)) {
        const cycleStartIndex = path.indexOf(blocker);
        if (cycleStartIndex !== -1) {
          cycles.push(path.slice(cycleStartIndex));
        }
      }
    }

    recursionStack.delete(curr);
  }

  for (const id of arrowIds) {
    if (!visited.has(id)) {
      dfs(id, []);
    }
  }

  return cycles;
}
