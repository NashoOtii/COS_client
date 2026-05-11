using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SaccoApi.Data;
using SaccoApi.DTOs;
using SaccoApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SaccoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SaccoDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(
            UserManager<IdentityUser> userManager,
            SaccoDbContext context,
            IConfiguration config)
        {
            _userManager = userManager;
            _context = context;
            _config = config;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // Check phone not already used
            bool phoneExists = await _context.Members
                .AnyAsync(m => m.PhoneNumber == dto.PhoneNumber);

            if (phoneExists)
                return BadRequest("A member with this phone number already exists.");

             // Parse role string to enum safely
            if (!Enum.TryParse<MemberRole>(dto.Role, ignoreCase: true, out var memberRole))
                return BadRequest($"Invalid role '{dto.Role}'. Valid roles: Member, Treasurer, Secretary, Chairperson.");   

            // Create the Identity user (handles password hashing)
            var user = new IdentityUser
            {
                UserName = dto.PhoneNumber,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // Assign role
            var roleName = dto.Role.ToString();
            await _userManager.AddToRoleAsync(user, memberRole.ToString());

            // Create the linked Member record
            var member = new Member
            {
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                Role = memberRole,
                Status = MemberStatus.Active,
                DateJoined = DateTime.UtcNow,
                ApplicationUserId = user.Id
            };

            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Registration successful.", MemberId = member.Id });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Find user by phone number
            var user = await _userManager.FindByNameAsync(dto.PhoneNumber);
            if (user == null)
                return Unauthorized("Invalid phone number or password.");

            var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!passwordValid)
                return Unauthorized("Invalid phone number or password.");

            // Get roles and linked member record
            var roles = await _userManager.GetRolesAsync(user);
            var member = await _context.Members
                .FirstOrDefaultAsync(m => m.ApplicationUserId == user.Id);

            // Build JWT token
            var token = GenerateToken(user, roles, member);

            return Ok(new
            {
                Token = token,
                MemberId = member?.Id,
                FullName = member?.FullName,
                Role = roles.FirstOrDefault()
            });
        }

        private string GenerateToken(
            IdentityUser user,
            IList<string> roles,
            Member? member)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!));

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id),
                new(ClaimTypes.Name, user.UserName!),
                new("MemberId", member?.Id.ToString() ?? "")
            };

            // Add each role as a claim
            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(
                    double.Parse(jwtSettings["ExpiryHours"]!)),
                signingCredentials: new SigningCredentials(
                    key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}