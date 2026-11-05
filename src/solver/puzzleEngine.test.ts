import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ArrowItem,
  getDirectionVector,
  getExitDirection,
  doesArrowCollide,
  buildDependencyGraph,
  solveRemovalSequence,
} from './puzzleEngine';

test('getDirectionVector returns correct coordinates', () => {
  assert.deepEqual(getDirectionVector('UP'), [0, -1]);
  assert.deepEqual(getDirectionVector('DOWN'), [0, 1]);
  assert.deepEqual(getDirectionVector('LEFT'), [-1, 0]);
  assert.deepEqual(getDirectionVector('RIGHT'), [1, 0]);
});

test('getExitDirection handles straight and curved arrows', () => {
  const straightArrow: ArrowItem = { id: 'a1', x: 2, y: 2, direction: 'UP' };
  assert.equal(getExitDirection(straightArrow), 'UP');

  const curvedClockwise: ArrowItem = {
    id: 'a2',
    x: 2,
    y: 2,
    direction: 'UP',
    isCurved: true,
    curveTurn: 'CLOCKWISE',
  };
  assert.equal(getExitDirection(curvedClockwise), 'RIGHT');

  const curvedCounter: ArrowItem = {
    id: 'a3',
    x: 2,
    y: 2,
    direction: 'UP',
    isCurved: true,
    curveTurn: 'COUNTER_CLOCKWISE',
  };
  assert.equal(getExitDirection(curvedCounter), 'LEFT');
});

test('doesArrowCollide detects blocker directly in front of arrow', () => {
  // Arrow A at (2, 4) pointing UP
  const arrowA: ArrowItem = { id: 'A', x: 2, y: 4, direction: 'UP' };
  // Arrow B at (2, 2) pointing RIGHT (occupies (2, 2), directly in A's path)
  const arrowB: ArrowItem = { id: 'B', x: 2, y: 2, direction: 'RIGHT' };
  // Arrow C at (4, 4) pointing UP (off to the side, doesn't block A)
  const arrowC: ArrowItem = { id: 'C', x: 4, y: 4, direction: 'UP' };

  assert.equal(doesArrowCollide(arrowA, arrowB), true, 'B should block A');
  assert.equal(doesArrowCollide(arrowA, arrowC), false, 'C should not block A');
  assert.equal(doesArrowCollide(arrowB, arrowA), false, 'A is behind B, does not block B');
});

test('buildDependencyGraph determines free arrows and correct solving sequence', () => {
  // Level layout:
  // Arrow 1 at (2, 4) pointing UP -> blocked by Arrow 2 at (2, 2)
  // Arrow 2 at (2, 2) pointing RIGHT -> clear path out of the board!
  // Arrow 3 at (0, 4) pointing RIGHT -> blocked by Arrow 1 at (2, 4)
  const arrows: ArrowItem[] = [
    { id: '1', x: 2, y: 4, direction: 'UP' },
    { id: '2', x: 2, y: 2, direction: 'RIGHT' },
    { id: '3', x: 0, y: 4, direction: 'RIGHT' },
  ];

  const graph = buildDependencyGraph(arrows, 10);
  
  assert.equal(graph.isSolvable, true);
  assert.equal(graph.cycleDetected, false);
  // Arrow 2 should have 0 blockers (free to fly out)
  assert.deepEqual(graph.freeArrowIds, ['2']);
  // Sequence should be 2, then 1, then 3!
  assert.deepEqual(graph.recommendedSequence, ['2', '1', '3']);
});

test('detects deadlock/cycle when arrows block each other in a circle', () => {
  // 4 arrows in a tight clockwise loop:
  // Top: (2, 1) pointing RIGHT -> hits (3, 1) or goes to (3, 2)
  // Right: (3, 2) pointing DOWN -> goes to (3, 3)
  // Bottom: (2, 3) pointing LEFT -> goes to (1, 3)
  // Left: (1, 2) pointing UP -> goes to (1, 1)
  const circularArrows: ArrowItem[] = [
    { id: 'top', x: 2, y: 2, direction: 'RIGHT' }, // points towards right (4, 2)
    { id: 'right', x: 4, y: 2, direction: 'DOWN' }, // points towards bottom (4, 4)
    { id: 'bottom', x: 4, y: 4, direction: 'LEFT' }, // points towards left (2, 4)
    { id: 'left', x: 2, y: 4, direction: 'UP' }, // points towards top (2, 2)
  ];

  const graph = buildDependencyGraph(circularArrows, 10);
  assert.equal(graph.isSolvable, false);
  assert.equal(graph.cycleDetected, true);
});
