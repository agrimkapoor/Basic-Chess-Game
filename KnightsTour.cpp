#include <iostream>
using namespace std;

const int N = 8;
int board[N][N];
int dx[] = {2, 1, -1, -2, -2, -1, 1, 2};
int dy[] = {1, 2, 2, 1, -1, -2, -2, -1};

bool isSafe(int x, int y) {
    return (x >= 0 && y >= 0 && x < N && y < N && board[x][y] == -1);
}

bool solveKT(int x, int y, int movei) {
    if (movei == N*N) return true;

    for (int k = 0; k < 8; k++) {
        int nx = x + dx[k], ny = y + dy[k];
        if (isSafe(nx, ny)) {
            board[nx][ny] = movei;
            if (solveKT(nx, ny, movei + 1)) return true;
            board[nx][ny] = -1;
        }
    }
    return false;
}

int main() {
    for (int i = 0; i < N; i++)
        fill(board[i], board[i]+N, -1);

    board[0][0] = 0;
    if (!solveKT(0, 0, 1)) {
        cout << "No solution\n";
        return 0;
    }

    for (int i = 0; i < N; i++, cout << endl)
        for (int j = 0; j < N; j++)
            cout << board[i][j] << "\t";
    return 0;
}
