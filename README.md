Description:
Developed a console-based 2-player chess game in C++ that simulates a standard chessboard with piece placement, turn-based logic, and move validation. Incorporated basic object-oriented design using Piece and ChessBoard classes. Integrated basic movement rules and input handling to support human vs. human play. The game includes basic features:
 1. Full Piece Setup
Initial setup mirrors a standard chess board.
All pieces are positioned correctly from START_POS.

 2. Click-to-Select & Move
Players can click on their pieces to:
Select a piece (now with yellow highlight).
See legal moves (now with center dots).
Move to a legal square by clicking on it.

 3. Legal Move Calculation
All standard piece movements are implemented:
Pawns (including double initial move & diagonal capture).
Rooks, Bishops, Queens (with directional movement).
Knights (L-shaped moves).
Kings (1-cell in all directions).
Illegal moves are filtered out.
Moves are blocked by other pieces unless capturing.

 4. Check & Checkmate Detection
isCheck() detects if the king is in check.
Game ends with alert on checkmate.
Ensures no move leaves king in check (i.e., self-check prevention).

 5. Turn-based Logic
Alternates between "w" and "b" each move.
Only allows the correct side to move on their turn.

6. Game Over Logic
Game ends when a king is captured or a player is checkmated.
gameOver flag prevents further interaction after game ends.

 7. Move Validation Preview
Before actually moving a piece, the game:
Tries the move virtually (tryMove) to check if it's legal.
Ensures no move results in self-check.

8. Image-Based Piece Rendering
Pieces rendered using img elements from pieces/ folder.
Nice visual representation.

 9. Board Rendering
Dynamically generates the 8×8 chess board.
Assigns light/dark square coloring (white and green)
