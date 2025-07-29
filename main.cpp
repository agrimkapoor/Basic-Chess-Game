#include <iostream>
#include <vector>
#include <string>
#include <cctype>

using namespace std;

const int SIZE = 8;
string board[SIZE][SIZE];
string turn = "w";

bool isInBounds(int r, int c) {
	return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

void initBoard() {
	string backRank[] = {"rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"};

	for (int i = 0; i < SIZE; ++i) {
		board[0][i] = "b_" + backRank[i];
		board[1][i] = "b_pawn";
		board[6][i] = "w_pawn";
		board[7][i] = "w_" + backRank[i];
	}

	for (int i = 2; i <= 5; ++i)
		for (int j = 0; j < SIZE; ++j)
			board[i][j] = "";
}

void printBoard() {
	cout << "\t ";
	for (int i = 0; i < SIZE; ++i)
		cout << i << "\t";
	cout << endl;

	for (int i = 0; i < SIZE; ++i) {
		cout << i << "\t|";
		for (int j = 0; j < SIZE; ++j) {
			if (board[i][j] == "")
				cout << ".\t";
			else
				cout << board[i][j][0] << board[i][j][2] << "\t";
		}
		cout << endl;
	}
}

string getColor(string piece) {
	if (piece.empty()) return "";
	return piece.substr(0, 1);
}

bool isOpponent(string piece, string color) {
	return !piece.empty() && getColor(piece) != color;
}

bool movePiece(int fromRow, int fromCol, int toRow, int toCol) {
	string piece = board[fromRow][fromCol];
	if (piece == "") return false;

	string color = getColor(piece);
	if (color != turn) return false;

	string type = piece.substr(2);
	vector<pair<int, int>> legalMoves;

	if (type == "pawn") {
		int dir = (color == "w") ? -1 : 1;
		if (isInBounds(fromRow + dir, fromCol) && board[fromRow + dir][fromCol] == "")
			legalMoves.emplace_back(fromRow + dir, fromCol);

		if ((color == "w" && fromRow == 6 || color == "b" && fromRow == 1) &&
			board[fromRow + dir][fromCol] == "" && board[fromRow + 2 * dir][fromCol] == "")
			legalMoves.emplace_back(fromRow + 2 * dir, fromCol);

		for (int dc : {-1, 1}) {
			int r = fromRow + dir, c = fromCol + dc;
			if (isInBounds(r, c) && isOpponent(board[r][c], color))
				legalMoves.emplace_back(r, c);
		}
	}

	else if (type == "knight") {
		int dr[] = {2, 1, -1, -2, -2, -1, 1, 2};
		int dc[] = {1, 2, 2, 1, -1, -2, -2, -1};
		for (int i = 0; i < 8; ++i) {
			int r = fromRow + dr[i], c = fromCol + dc[i];
			if (isInBounds(r, c) && (board[r][c] == "" || isOpponent(board[r][c], color)))
				legalMoves.emplace_back(r, c);
		}
	}

	else if (type == "rook") {
		for (int d = -1; d <= 1; d += 2) {
			for (int i = fromRow + d; isInBounds(i, fromCol); i += d) {
				if (board[i][fromCol] == "") legalMoves.emplace_back(i, fromCol);
				else {
					if (isOpponent(board[i][fromCol], color)) legalMoves.emplace_back(i, fromCol);
					break;
				}
			}
			for (int i = fromCol + d; isInBounds(fromRow, i); i += d) {
				if (board[fromRow][i] == "") legalMoves.emplace_back(fromRow, i);
				else {
					if (isOpponent(board[fromRow][i], color)) legalMoves.emplace_back(fromRow, i);
					break;
				}
			}
		}
	}

	for (auto p : legalMoves) {
        int r=p.first;
        int c=p.second;
		if (r == toRow && c == toCol) {
			if (board[toRow][toCol].find("king") != string::npos) {
				cout << "\nGame Over! " << turn << " wins!" << endl;
			}
			board[toRow][toCol] = piece;
			board[fromRow][fromCol] = "";
			turn = (turn == "w") ? "b" : "w";
			return true;
		}
	}

	return false;
}

int main() {
	initBoard();

	while (true) {
		printBoard();
		cout << "\n" << turn << "'s move (fromRow fromCol toRow toCol): ";
		int fr, fc, tr, tc;
		cin >> fr >> fc >> tr >> tc;
		if (!movePiece(fr, fc, tr, tc)) {
			cout << "Invalid move. Try again.\n";
		}
	}

	return 0;
}
