using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpendingAnalyzer.Core.Models;
using SpendingAnalyzer.Infrastructure.Data;
using SpendingAnalyzer.Infrastructure.Services;

namespace SpendingAnalyzer.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly CsvImportService _csvImportService;

    public TransactionsController(ApplicationDbContext context, CsvImportService csvImportService)
    {
        _context = context;
        _csvImportService = csvImportService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
    {
        return await _context.Transactions.OrderByDescending(t => t.Date).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Transaction>> GetTransaction(int id)
    {
        var transaction = await _context.Transactions.FindAsync(id);

        if (transaction == null)
        {
            return NotFound();
        }

        return transaction;
    }

    [HttpPost("import")]
    public async Task<IActionResult> ImportTransactions(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded");
        }

        try
        {
            var transactions = await _csvImportService.ImportTransactionsFromCsvAsync(file);
            await _context.Transactions.AddRangeAsync(transactions);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Successfully imported {transactions.Count} transactions" });
        }
        catch (Exception ex)
        {
            return BadRequest($"Error importing transactions: {ex.Message}");
        }
    }

    [HttpPut("{id}/category")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] string category)
    {
        var transaction = await _context.Transactions.FindAsync(id);

        if (transaction == null)
        {
            return NotFound();
        }

        transaction.Category = category;
        transaction.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
            return Ok(transaction);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TransactionExists(id))
            {
                return NotFound();
            }
            throw;
        }
    }

    [HttpGet("summary")]
    public async Task<ActionResult<object>> GetSummary([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var query = _context.Transactions.AsQueryable();

        if (startDate.HasValue)
        {
            query = query.Where(t => t.Date >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(t => t.Date <= endDate.Value);
        }

        var transactions = await query.ToListAsync();

        var summary = new
        {
            TotalSpending = transactions.Sum(t => t.Amount),
            CategoryCount = transactions.Select(t => t.Category).Distinct().Count(),
            TransactionCount = transactions.Count,
            SpendingByCategory = transactions
                .GroupBy(t => t.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    Amount = g.Sum(t => t.Amount),
                    Count = g.Count()
                })
                .OrderByDescending(x => x.Amount)
                .ToList()
        };

        return Ok(summary);
    }

    private bool TransactionExists(int id)
    {
        return _context.Transactions.Any(e => e.Id == id);
    }
}