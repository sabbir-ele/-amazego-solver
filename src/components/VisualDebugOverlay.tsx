import React from 'react';
import { ArrowItem, DependencyGraphResult, getDirectionVector, getExitDirection } from '../solver/puzzleEngine';

interface VisualDebugOverlayProps {
  arrows: ArrowItem[];
  graph: DependencyGraphResult;
  boardSize: number;
  tileSize: number;
  enabled: boolean;
}

export const VisualDebugOverlay: React.FC<VisualDebugOverlayProps> = ({
  arrows,
  graph,
  boardSize,
  tileSize,
  enabled,
}) => {
  if (!enabled) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-20 w-full h-full"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <marker
          id="debug-arrow-head"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#ef4444" opacity="0.8" />
        </marker>
        <marker
          id="exit-ray-head"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#10b981" />
        </marker>
      </defs>

      {/* Render Exit Rays */}
      {arrows.map((arrow) => {
        const exitDir = getExitDirection(arrow);
        const [dx, dy] = getDirectionVector(exitDir);
        const isFree = graph.freeArrowIds.includes(arrow.id);
        const x1 = arrow.x * tileSize + tileSize / 2;
        const y1 = arrow.y * tileSize + tileSize / 2;
        // Project ray out
        const rayLength = isFree ? boardSize * tileSize : tileSize * 1.5;
        const x2 = x1 + dx * rayLength;
        const y2 = y1 + dy * rayLength;

        return (
          <g key={`ray-${arrow.id}`}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isFree ? '#10b981' : '#f59e0b'}
              strokeWidth="2"
              strokeDasharray={isFree ? 'none' : '4 4'}
              opacity={isFree ? 0.8 : 0.4}
              markerEnd={isFree ? 'url(#exit-ray-head)' : undefined}
            />
          </g>
        );
      })}

      {/* Render Dependency blocker links */}
      {arrows.map((arrow) => {
        const blockers = graph.dependencies[arrow.id] || [];
        const x1 = arrow.x * tileSize + tileSize / 2;
        const y1 = arrow.y * tileSize + tileSize / 2;

        return blockers.map((blockerId) => {
          const blocker = arrows.find((a) => a.id === blockerId);
          if (!blocker) return null;
          const x2 = blocker.x * tileSize + tileSize / 2;
          const y2 = blocker.y * tileSize + tileSize / 2;

          return (
            <line
              key={`dep-${arrow.id}-${blockerId}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.6"
              markerEnd="url(#debug-arrow-head)"
            />
          );
        });
      })}

      {/* Render Bounding Rectangles & Sequence badges */}
      {arrows.map((arrow) => {
        const x = arrow.x * tileSize;
        const y = arrow.y * tileSize;
        const isFree = graph.freeArrowIds.includes(arrow.id);
        const seqIdx = graph.recommendedSequence.indexOf(arrow.id);

        return (
          <g key={`box-${arrow.id}`}>
            {/* CV Bounding Box */}
            <rect
              x={x + 4}
              y={y + 4}
              width={tileSize - 8}
              height={tileSize - 8}
              fill="none"
              stroke={isFree ? '#10b981' : '#f43f5e'}
              strokeWidth="1.5"
              strokeDasharray="2 2"
              rx="6"
              opacity="0.75"
            />

            {/* Sequence Badge if solvable */}
            {seqIdx !== -1 && (
              <g transform={`translate(${x + tileSize - 14}, ${y + 6})`}>
                <circle r="9" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                <text
                  textAnchor="middle"
                  dy="3.5"
                  fontSize="9"
                  fontWeight="bold"
                  fill="#38bdf8"
                >
                  {seqIdx + 1}
                </text>
              </g>
            )}

            {/* In-degree / Blocked count */}
            {graph.blockedByCount[arrow.id] > 0 && (
              <g transform={`translate(${x + 10}, ${y + 10})`}>
                <circle r="7" fill="#ef4444" />
                <text
                  textAnchor="middle"
                  dy="2.5"
                  fontSize="8"
                  fontWeight="bold"
                  fill="#ffffff"
                >
                  {graph.blockedByCount[arrow.id]}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};
