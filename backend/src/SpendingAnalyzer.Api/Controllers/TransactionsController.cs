using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpendingAnalyzer.Core.Models;
using SpendingAnalyzer.Core.Services;
using SpendingAnalyzer.Infrastructure.Data;

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
        return await _context.Transactions
            .OrderByDescending(t => t.Date)
            .ToListAsync();
    }

    [HttpPost("import")]
    public async Task<ActionResult<IEnumerable<Transaction>>> ImportTransactions(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded");
        }

        using var stream = file.OpenReadStream();
        var transactions = await _csvImportService.ImportTransactionsFromCsvAsync(stream);
        
        await _context.Transactions.AddRangeAsync(transactions);
        await _context.SaveChangesAsync();

        return Ok(transactions);
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
        await _context.SaveChangesAsync();

        return Ok(transaction);
    }

    [HttpGet("summary")]
    public async Task<ActionResult<object>> GetSummary([FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        var query = _context.Transactions.AsQueryable();
        
        if (from.HasValue)
            query = query.Where(t => t.Date >= from.Value);
        
        if (to.HasValue)
            query = query.Where(t => t.Date <= to.Value);

        var summary = await query
            .GroupBy(t => t.Category ?? "Uncategorized")
            .Select(g => new
            {
                Category = g.Key,
                Total = g.Sum(t => t.Amount),
                Count = g.Count()
            })
            .ToListAsync();

        return Ok(new
        {
            Categories = summary,
            Total = summary.Sum(s => s.Total),
            TransactionCount = summary.Sum(s => s.Count)
        });
    }
}