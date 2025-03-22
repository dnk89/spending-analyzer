using CsvHelper;
using CsvHelper.Configuration;
using SpendingAnalyzer.Core.Models;
using System.Globalization;

namespace SpendingAnalyzer.Core.Services;

public class CsvImportService
{
    public async Task<IEnumerable<Transaction>> ImportTransactionsFromCsvAsync(Stream csvStream)
    {
        using var reader = new StreamReader(csvStream);
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            MissingFieldFound = null
        };

        using var csv = new CsvReader(reader, config);
        var records = await csv.GetRecordsAsync<Transaction>().ToListAsync();
        
        foreach (var record in records)
        {
            record.CreatedAt = DateTime.UtcNow;
        }

        return records;
    }
}