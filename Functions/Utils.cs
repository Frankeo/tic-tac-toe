using System;
using System.Collections.Generic;
using System.Linq;

namespace TicTacToe.Function
{
  public static class Utils
  {
    public static IEnumerable<T[]> Permutations<T>(this IEnumerable<T> source, int k)
    {
      if (k < 0)
        throw new ArgumentOutOfRangeException(nameof(k), "May not be negative");

      var items = source.ToArray();
      
      if (k > items.Length)
        throw new ArgumentOutOfRangeException(nameof(k), "May not be bigger than the number of items in source");

      var buffer = new ArraySegment<T>(items, 0, k);
      return Permute(0);

      IEnumerable<T[]> Permute(int depth)
      {
        if (depth == k)
        {
          yield return buffer.ToArray();
          yield break;
        }

        for (int i = depth; i < items.Length; i++)
        {
          Swap(depth, i);
          foreach (var permutation in Permute(depth + 1))
            yield return permutation;
          Swap(depth, i);
        }
      }

      void Swap(int a, int b)
      {
        if (a != b)
        {
          T t = items[a];
          items[a] = items[b];
          items[b] = t;
        }
      }
    }
  }
}