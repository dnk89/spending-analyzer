using System.Globalization;
using Microsoft.AspNetCore.Http;
using SpendingAnalyzer.Core.Models;

namespace SpendingAnalyzer.Infrastructure.Services;

public class CsvImportService
{
    public async Task<List<Transaction>> ImportTransactionsFromCsvAsync(IFormFile file)
    {
        var transactions = new List<Transaction>();
        using var reader = new StreamReader(file.OpenReadStream());

        // Skip header line
        await reader.ReadLineAsync();

        while (!reader.EndOfStream)
        {
            var line = await reader.ReadLineAsync();
            if (string.IsNullOrEmpty(line)) continue;

            var values = line.Split(',');
            if (values.Length < 3) continue;

            if (DateTime.TryParse(values[0], out var date) &&
                decimal.TryParse(values[2], NumberStyles.Any, CultureInfo.InvariantCulture, out var amount))
            {
                var transaction = new Transaction
                {
                    Date = date,
                    Description = values[1].Trim('"'),
                    Amount = amount,
                    Category = "Uncategorized",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                transactions.Add(transaction);
            }
        }

        return transactions;
    }
}