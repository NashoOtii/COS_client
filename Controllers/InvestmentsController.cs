using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SaccoApi.Data;
using SaccoApi.Models;

namespace SaccoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvestmentsController : ControllerBase
    {
        private readonly SaccoDbContext _context;

        public InvestmentsController(SaccoDbContext context)
        {
            _context = context;
        }

        // GET: api/investments/cycle/5
        [HttpGet("cycle/{cycleId}")]
        public async Task<ActionResult<IEnumerable<Investment>>> GetByCycle(int cycleId)
        {
            return await _context.Investments
                .Where(i => i.CycleId == cycleId)
                .ToListAsync();
        }

        // POST: api/investments
        [HttpPost]
        public async Task<ActionResult<Investment>> Create(Investment investment)
        {
            var cycle = await _context.Cycles.FindAsync(investment.CycleId);
            if (cycle == null || cycle.Status != CycleStatus.Active)
                return BadRequest("Investments can only be created in an active cycle.");

            investment.InvestmentDate = DateTime.UtcNow;
            investment.Status = InvestmentStatus.Active;
            investment.ReturnsGenerated = 0;

            _context.Investments.Add(investment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetByCycle), new { cycleId = investment.CycleId }, investment);
        }

        // PATCH: api/investments/5/returns
        [HttpPatch("{id}/returns")]
        public async Task<IActionResult> UpdateReturns(int id, [FromBody] decimal returns)
        {
            var investment = await _context.Investments.FindAsync(id);
            if (investment == null) return NotFound();

            investment.ReturnsGenerated = returns;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/investments/5/complete
        [HttpPatch("{id}/complete")]
        public async Task<IActionResult> Complete(int id)
        {
            var investment = await _context.Investments.FindAsync(id);
            if (investment == null) return NotFound();

            investment.Status = InvestmentStatus.Completed;
            investment.CompletedDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}