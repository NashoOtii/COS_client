using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SaccoApi.Data;
using SaccoApi.Models;
using SaccoApi.DTOs;

namespace SaccoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoansController : ControllerBase
    {
        private readonly SaccoDbContext _context;

        public LoansController(SaccoDbContext context)
        {
            _context = context;
        }

        // GET: api/loans
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Loan>>> GetAll()
        {
            return await _context.Loans
                .Include(l => l.Member)
                .Include(l => l.Guarantors)
                    .ThenInclude(g => g.Member)
                .Include(l => l.Repayments)
                .OrderByDescending(l => l.RequestedAt)
                .ToListAsync();
        }

        // GET: api/loans/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Loan>> GetById(int id)
        {
            var loan = await _context.Loans
                .Include(l => l.Member)
                .Include(l => l.Guarantors)
                    .ThenInclude(g => g.Member)
                .Include(l => l.Repayments)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (loan == null) return NotFound();
            return loan;
        }

        // GET: api/loans/member/5
        [HttpGet("member/{memberId}")]
        public async Task<ActionResult<IEnumerable<Loan>>> GetByMember(int memberId)
        {
            return await _context.Loans
                .Include(l => l.Cycle)
                .Include(l => l.Repayments)
                .Where(l => l.MemberId == memberId)
                .OrderByDescending(l => l.RequestedAt)
                .ToListAsync();
        }

        // POST: api/loans — member requests a loan
       [HttpPost]
public async Task<ActionResult<Loan>> CreateLoan(CreateLoanDto dto)
{
    var cycle = await _context.Cycles.FindAsync(dto.CycleId);
    if (cycle == null || cycle.Status != CycleStatus.Active)
        return BadRequest("Loans can only be requested during an active cycle.");

    var member = await _context.Members.FindAsync(dto.MemberId);
    if (member == null || member.Status != MemberStatus.Active)
        return BadRequest("Member not found or inactive.");

    bool hasExistingLoan = await _context.Loans.AnyAsync(l =>
        l.MemberId == dto.MemberId &&
        l.CycleId == dto.CycleId &&
        (l.Status == LoanStatus.Active || l.Status == LoanStatus.Approved || l.Status == LoanStatus.Pending));

    if (hasExistingLoan)
        return BadRequest("Member already has an outstanding loan in this cycle.");

    if (dto.Principal > cycle.MaxLoanAmount)
        return BadRequest($"Loan amount exceeds the cycle maximum of {cycle.MaxLoanAmount:C}.");

    var loan = new Loan
    {
        MemberId = dto.MemberId,
        CycleId = dto.CycleId,
        Principal = dto.Principal,
        FlatFee = Math.Round(dto.Principal * 0.10m, 2),
        TotalRepayable = Math.Round(dto.Principal * 1.10m, 2),
        RepaymentWeeks = dto.RepaymentWeeks,
        Status = LoanStatus.Pending,
        RequestedAt = DateTime.UtcNow
    };

    _context.Loans.Add(loan);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetById), new { id = loan.Id }, loan);
}
        // PATCH: api/loans/5/approve
        [HttpPatch("{id}/approve")]
        public async Task<IActionResult> Approve(int id, [FromQuery] int approvedById)
        {
            var loan = await _context.Loans
                .Include(l => l.Guarantors)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (loan == null) return NotFound();
            if (loan.Status != LoanStatus.Pending)
                return BadRequest("Only pending loans can be approved.");

            // Guarantors are optional — if any exist, all must have approved
    // If none exist, executive can approve directly
    if (loan.Guarantors.Any())
    {
        bool allApproved = loan.Guarantors
            .All(g => g.Status == GuarantorStatus.Approved);

        if (!allApproved)
            return BadRequest(
                "All guarantors must approve before the loan can be approved.");
    }

            loan.Status = LoanStatus.Approved;
            loan.ApprovedById = approvedById;
            loan.ApprovedAt = DateTime.UtcNow;
            loan.DueDate = DateTime.UtcNow.AddDays(loan.RepaymentWeeks * 7);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PATCH: api/loans/5/disburse
        [HttpPatch("{id}/disburse")]
        public async Task<IActionResult> Disburse(int id)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null) return NotFound();

            if (loan.Status != LoanStatus.Approved)
                return BadRequest("Only approved loans can be disbursed.");

            loan.Status = LoanStatus.Active;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/loans/5/repay — log a repayment
       [HttpPost("{id}/repay")]
public async Task<IActionResult> Repay(int id, CreateRepaymentDto dto)
{
    var loan = await _context.Loans
        .Include(l => l.Repayments)
        .FirstOrDefaultAsync(l => l.Id == id);

    if (loan == null) return NotFound();
    if (loan.Status != LoanStatus.Active)
        return BadRequest("Repayments can only be logged for active loans.");

    var repayment = new LoanRepayment
    {
        LoanId = id,
        Amount = dto.Amount,
        RecordedById = dto.RecordedById,
        Remarks = dto.Remarks,
        DatePaid = DateTime.UtcNow
    };

    _context.LoanRepayments.Add(repayment);

    decimal totalPaid = loan.Repayments.Sum(r => r.Amount) + dto.Amount;
    if (totalPaid >= loan.TotalRepayable)
        loan.Status = LoanStatus.Repaid;

    await _context.SaveChangesAsync();

    return Ok(new
    {
        TotalRepayable = loan.TotalRepayable,
        TotalPaid = totalPaid,
        Balance = loan.TotalRepayable - totalPaid,
        Status = loan.Status.ToString()
    });
}

        // PATCH: api/loans/5/default
        [HttpPatch("{id}/default")]
        public async Task<IActionResult> MarkDefault(int id)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null) return NotFound();

            if (loan.Status != LoanStatus.Active)
                return BadRequest("Only active loans can be marked as defaulted.");

            loan.Status = LoanStatus.Defaulted;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}