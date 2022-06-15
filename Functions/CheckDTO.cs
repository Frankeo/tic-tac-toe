namespace TicTacToe.Function
{
  public class CheckResponseDTO
  {
    public bool HasWon;
    public bool HasTie;
    public int?[] WinningSquares;
  }

  public class CheckRequestDTO
  {
    public string PlayerName;
    public string RivalName;
    public int Position;
  }
}