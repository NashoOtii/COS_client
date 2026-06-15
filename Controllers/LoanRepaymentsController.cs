using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SaccoApi.Data;
using SaccoApi.Models;

namespace SaccoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoanRepaymentsController : ControllerBase
    {
        private readonly SaccoDbContext _context;

        public LoanRepaymentsController(SaccoDbContext context)
        {
            _context = context;
        }

        // POST: api/loanrepayments
        [HttpPost]
        public async Task<IActionResult> Create(LoanRepayment repayment)
        {
            // 1. Fetch the associated loan
            var loan = await _context.Loans
                .Include(l => l.Repayments) 
                .FirstOrDefaultAsync(l => l.Id == repayment.LoanId);

            if (loan == null)
                return NotFound("Loan profile not found.");

            // 2. Validate that repayments only happen on a loan that is not already fully paid
            if (loan.Status == LoanStatus.Repaid)
                return BadRequest("Repayments can only be logged against loans that are not fully paid.");

            repayment.DatePaid = DateTime.UtcNow;

            // 3. Add to context
            _context.LoanRepayments.Add(repayment);

            // 4. Calculate the total paid so far dynamically
            decimal totalPaidSoFar = await _context.LoanRepayments
                .Where(r => r.LoanId == repayment.LoanId)
                .SumAsync(r => r.Amount) + repayment.Amount;

            // FIX: Changed 'Amount + InterestAmount' to 'TotalRepayable'
            // If the total repayments meet or exceed the total loan amount due
            if (totalPaidSoFar >= loan.TotalRepayable) 
            {
                loan.Status = LoanStatus.Repaid;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = repayment.Id,
                loanId = repayment.LoanId,
                amount = repayment.Amount,
                remarks = repayment.Remarks,
                status = loan.Status.ToString()
            });
        }

        // GET: api/loanrepayments/loan/5 (To check payment history for a specific loan)
        [HttpGet("loan/{loanId}")]
        public async Task<ActionResult<IEnumerable<LoanRepayment>>> GetByLoan(int loanId)
        {
            return await _context.LoanRepayments
                .Include(r => r.RecordedBy)
                .Where(r => r.LoanId == loanId)
                .OrderByDescending(r => r.DatePaid)
                .ToListAsync();
        }
    }
}