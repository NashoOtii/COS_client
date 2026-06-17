using System.ComponentModel.DataAnnotations;

namespace SaccoApi.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        // Accept as string to avoid enum deserialization issues
        public string Role { get; set; } = "Member";

        // Questionnaire Data
        public string? Motivation { get; set; }
        public string? FinancialGoal { get; set; }
        public string? WeeklyCommitment { get; set; }
        public string? ValueAlignment { get; set; }
        public string? Contribution { get; set; }
    }
}