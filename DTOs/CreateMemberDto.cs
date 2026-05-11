using System.ComponentModel.DataAnnotations;
using SaccoApi.Models;

namespace SaccoApi.DTOs
{
    public class CreateMemberDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        [EmailAddress]
        public string? Email { get; set; }

        public MemberRole Role { get; set; } = MemberRole.Member;
    }
}