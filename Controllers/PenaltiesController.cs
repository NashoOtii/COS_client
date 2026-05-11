using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SaccoApi.Data;
using SaccoApi.Models;

namespace SaccoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PenaltiesController : ControllerBase
    {
        private readonly SaccoDbContext _context;

        public PenaltiesController(SaccoDbContext context)
        {
            _context = context;
        }

        // GET: api/penalties/cycle/5
        [HttpGet("cycle/{cycleId}")]
        public async Task<ActionResult<IEnumerable<Penalty>>> GetByCycle(int cycleId)
        {
            return await _context.Penalties
                .Include(p => p.Member)
                .Where(p => p.CycleId == cycleId)
                .OrderByDescending(p => p.DateIncurred)
                .ToListAsync();
        }

        // GET: api/penalties/member/5
        [HttpGet("member/{memberId}")]
        public async Task<ActionResult<IEnumerable<Penalty>>> GetByMember(int memberId)
        {
            return await _context.Penalties
                .Include(p => p.Cycle)
                .Where(p => p.MemberId == memberId)
                .ToListAsync();
        }

        // POST: api/penalties
        [HttpPost]
        public async Task<ActionResult<Penalty>> Create(Penalty penalty)
        {
            var member = await _context.Members.FindAsync(penalty.MemberId);
            if (member == null) return NotFound("Member not found.");

            var cycle = await _context.Cycles.FindAsync(penalty.CycleId);
            if (cycle == null || cycle.Status != CycleStatus.Active)
                return BadRequest("Penalties can only be issued in an active cycle.");

            penalty.DateIncurred = DateTime.UtcNow;
            penalty.IsPaid = false;

            _context.Penalties.Add(penalty);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetByCycle), new { cycleId = penalty.CycleId }, penalty);
        }

        // PATCH: api/penalties/5/pay
        [HttpPatch("{id}/pay")]
        public async Task<IActionResult> MarkPaid(int id)
        {
            var penalty = await _context.Penalties.FindAsync(id);
            if (penalty == null) return NotFound();
            if (penalty.IsPaid) return BadRequest("Penalty is already marked as paid.");

            penalty.IsPaid = true;
            penalty.DatePaid = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}