using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SaccoApi.Models
{
    public class LoanGuarantor
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int LoanId { get; set; }

        [Required]
        public int MemberId { get; set; }

        public GuarantorStatus Status { get; set; } = GuarantorStatus.Pending;

        public DateTime? ResponseDate { get; set; }

        // Navigation
        [JsonIgnore] public Loan? Loan { get; set; }
        public Member? Member { get; set; }
    }
}