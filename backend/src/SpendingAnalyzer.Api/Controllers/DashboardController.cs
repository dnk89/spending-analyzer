using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpendingAnalyzer.Infrastructure.Data;

namespace SpendingAnalyzer.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var totalSpent = await _context.Transactions.SumAsync(t => t.Amount);

        var topCategories = await _context.Transactions
            .GroupBy(t => t.Category)
            .Select(g => new { category = g.Key, amount = g.Sum(t => t.Amount) })
            .OrderByDescending(x => x.amount)
            .Take(5)
            .ToListAsync();

        var recentTransactions = await _context.Transactions
            .OrderByDescending(t => t.Date)
            .Take(5)
            .ToListAsync();

        return Ok(new
        {
            totalSpent,
            topCategories,
            recentTransactions
        });
    }
}