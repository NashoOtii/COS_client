using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SaccoApi.Data;
using SaccoApi.Models;

namespace SaccoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GuarantorsController : ControllerBase
    {
        private readonly SaccoDbContext _context;

        public GuarantorsController(SaccoDbContext context)
        {
            _context = context;
        }

        // POST: api/guarantors — add a guarantor to a loan
        [HttpPost]
        public async Task<ActionResult<LoanGuarantor>> Add(LoanGuarantor guarantor)
        {
            var loan = await _context.Loans.FindAsync(guarantor.LoanId);
            if (loan == null) return NotFound("Loan not found.");

            if (loan.Status != LoanStatus.Pending)
                return BadRequest("Guarantors can only be added to pending loans.");

            // Borrower cannot guarantee their own loan
            if (guarantor.MemberId == loan.MemberId)
                return BadRequest("A member cannot guarantee their own loan.");

            bool alreadyGuarantor = await _context.LoanGuarantors.AnyAsync(g =>
                g.LoanId == guarantor.LoanId && g.MemberId == guarantor.MemberId);

            if (alreadyGuarantor)
                return BadRequest("This member is already a guarantor for this loan.");

            guarantor.Status = GuarantorStatus.Pending;
            _context.LoanGuarantors.Add(guarantor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Respond), new { id = guarantor.Id }, guarantor);
        }

        // PATCH: api/guarantors/5/respond
        [HttpPatch("{id}/respond")]
        public async Task<IActionResult> Respond(int id, [FromBody] GuarantorStatus response)
        {
            var guarantor = await _context.LoanGuarantors.FindAsync(id);
            if (guarantor == null) return NotFound();

            if (guarantor.Status != GuarantorStatus.Pending)
                return BadRequest("This guarantor has already responded.");

            guarantor.Status = response;
            guarantor.ResponseDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}