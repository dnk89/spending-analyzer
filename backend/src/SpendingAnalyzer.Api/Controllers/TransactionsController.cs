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

    [HttpPost]
    public async Task<ActionResult<Transaction>> CreateTransaction(Transaction transaction)
    {
        transaction.CreatedAt = DateTime.UtcNow;
        transaction.UpdatedAt = DateTime.UtcNow;
        
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, transaction);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTransaction(int id, Transaction transaction)
    {
        if (id != transaction.Id)
        {
            return BadRequest();
        }

        transaction.UpdatedAt = DateTime.UtcNow;
        _context.Entry(transaction).State = EntityState.Modified;
        _context.Entry(transaction).Property(x => x.CreatedAt).IsModified = false;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await TransactionExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransaction(int id)
    {
        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction == null)
        {
            return NotFound();
        }

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("import")]
    public async Task<ActionResult<IEnumerable<Transaction>>> ImportTransactions(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded");
        }

        if (!file.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Only CSV files are supported");
        }

        try
        {
            var transactions = await _csvImportService.ImportTransactionsFromCsvAsync(file);
            await _context.Transactions.AddRangeAsync(transactions);
            await _context.SaveChangesAsync();

            return Ok(transactions);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error importing transactions: {ex.Message}");
        }
    }

    private async Task<bool> TransactionExists(int id)
    {
        return await _context.Transactions.AnyAsync(e => e.Id == id);
    }
}