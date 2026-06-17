using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SaccoApi.Models
{
    public class Member
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(15)]
        public string PhoneNumber { get; set; } = string.Empty;

        [MaxLength(200)]
        [EmailAddress]
        public string? Email { get; set; }

        public MemberRole Role { get; set; } = MemberRole.Member;
        public MemberStatus Status { get; set; } = MemberStatus.Active;
        public DateTime DateJoined { get; set; } = DateTime.UtcNow;

        // Questionnaire Responses
       [MaxLength(1000)]
       public string? Motivation { get; set; }

       [MaxLength(1000)]
       public string? FinancialGoal { get; set; }

       [MaxLength(200)]
       public string? WeeklyCommitment { get; set; }

       [MaxLength(200)]
       public string? ValueAlignment { get; set; }

       [MaxLength(1000)]
       public string? Contribution { get; set; }

        public string? ApplicationUserId { get; set; }

        // Navigation
        [JsonIgnore] public ICollection<Contribution> Contributions { get; set; } = new List<Contribution>();
        [JsonIgnore] public ICollection<Loan> Loans { get; set; } = new List<Loan>();
        [JsonIgnore] public ICollection<LoanGuarantor> GuaranteedLoans { get; set; } = new List<LoanGuarantor>();
        [JsonIgnore] public ICollection<Penalty> Penalties { get; set; } = new List<Penalty>();
    }
}