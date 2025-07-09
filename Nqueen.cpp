//concepts of Backtracking and recursion required
#include <iostream>
using namespace std;

const int N = 8;
int board[N][N];

bool isSafe(int row, int col) {
    for (int i = 0; i < col; i++)
        if (board[row][i]) return false;

    for (int i=row, j=col; i>=0 && j>=0; i--, j--)
        if (board[i][j]) return false;

    for (int i=row, j=col; i<N && j>=0; i++, j--)
        if (board[i][j]) return false;

    return true;
}

bool solveNQ(int col) {
    if (col >= N) return true;

    for (int i = 0; i < N; i++) {
        if (isSafe(i, col)) {
            board[i][col] = 1;

            if (solveNQ(col + 1))
                return true;

            board[i][col] = 0;
        }
    }

    return false;
}

int main() {
    if (!solveNQ(0)) {
        cout << "No solution exists";
        return 0;
    }

    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++)
            cout << (board[i][j] ? "Q " : ". ");
        cout << endl;
    }
    return 0;
}
