using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SaccoApi.Data;

namespace SaccoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "ExecutiveOnly")] // Restricts to Treasurer, Secretary, and Chairperson
    public class OnboardingController : ControllerBase
    {
        private readonly SaccoDbContext _context;

        public OnboardingController(SaccoDbContext context)
        {
            _context = context;
        }

        [HttpGet("applications")]
        public async Task<IActionResult> GetOnboardingApplications()
        {
            // Pulls members by highest ID so the newest questionnaires show up first
            var applications = await _context.Members
                .OrderByDescending(m => m.Id)
                .ToListAsync();

            return Ok(applications);
        }
    }
}