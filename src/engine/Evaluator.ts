import { Chess, type Square } from 'chess.js';
import { MG_TABLES, EG_TABLES, PIECE_VALUES } from './pst';

// Game phase: 0 = endgame, 1 = middlegame
// Uses remaining non-pawn material to interpolate
const MG_PHASE_MAX = 24; // 4*1 + 4*1 + 4*2 + 2*4 = all non-pawn minor/piece material

function getGamePhase(chess: Chess): number {
  const fen = chess.fen().split(' ')[0];
  let phase = 0;
  for (const ch of fen) {
    switch (ch.toLowerCase()) {
      case 'n': phase += 1; break;
      case 'b': phase += 1; break;
      case 'r': phase += 2; break;
      case 'q': phase += 4; break;
    }
  }
  return Math.min(1, phase / MG_PHASE_MAX);
}

// Get PST index (0-63) for a square, from White's perspective
function pstIndex(square: Square, isWhite: boolean): number {
  const file = square.charCodeAt(0) - 97; // 'a'=0 ... 'h'=7
  const rank = parseInt(square[1]) - 1;    // '1'=0 ... '8'=7
  if (isWhite) {
    return (7 - rank) * 8 + file; // rank 8 at top (index 0), rank 1 at bottom (index 56)
  } else {
    return rank * 8 + file;      // mirrored: rank 1 at top, rank 8 at bottom
  }
}

/**
 * PeSTO-style tapered evaluation.
 * Returns score in centipawns from White's perspective.
 * Positive = White advantage, Negative = Black advantage.
 */
export function evaluate(chess: Chess): number {
  // Terminal states
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -99999 : 99999;
  }
  if (chess.isStalemate() || chess.isDraw() || chess.isThreefoldRepetition()) {
    return 0;
  }
  if (chess.isInsufficientMaterial()) {
    return 0;
  }

  const phase = getGamePhase(chess);
  let mgScore = 0;
  let egScore = 0;

  // Iterate over all squares
  for (let file = 0; file < 8; file++) {
    for (let rank = 0; rank < 8; rank++) {
      const sq = (String.fromCharCode(97 + file) + (rank + 1)) as Square;
      const piece = chess.get(sq);
      if (!piece) continue;

      const idx = pstIndex(sq, piece.color === 'w');
      const pieceType = piece.type;
      const value = PIECE_VALUES[pieceType] || 0;
      const mgPst = MG_TABLES[pieceType]?.[idx] ?? 0;
      const egPst = EG_TABLES[pieceType]?.[idx] ?? 0;

      if (piece.color === 'w') {
        mgScore += value + mgPst;
        egScore += value + egPst;
      } else {
        mgScore -= value + mgPst;
        egScore -= value + egPst;
      }
    }
  }

  // Tapered evaluation: interpolate between mg and eg scores
  const score = mgScore * phase + egScore * (1 - phase);

  // Check bonus (small bonus for giving check)
  if (chess.isCheck()) {
    const bonus = chess.turn() === 'w' ? -15 : 15; // penalty for being in check
    return score + bonus;
  }

  return Math.round(score);
}
