using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SaccoApi.Models
{
    public class Loan
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int MemberId { get; set; }

        [Required]
        public int CycleId { get; set; }

        [Required]
        [Range(1, 1000000)]
        public decimal Principal { get; set; }

        [Required]
        [Range(0, 1000000)]
        public decimal FlatFee { get; set; }

        [Required]
        public decimal TotalRepayable { get; set; }

        [Range(1, 52)]
        public int RepaymentWeeks { get; set; }

        public DateTime? DueDate { get; set; }

        public LoanStatus Status { get; set; } = LoanStatus.Pending;

        public int? ApprovedById { get; set; }

        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ApprovedAt { get; set; }

        // Navigation
        public Member? Member { get; set; }
        [JsonIgnore] public AcademicCycle? Cycle { get; set; }
        [ForeignKey(nameof(ApprovedById))]
        public Member? ApprovedBy { get; set; }
        public ICollection<LoanGuarantor> Guarantors { get; set; } = new List<LoanGuarantor>();
        public ICollection<LoanRepayment> Repayments { get; set; } = new List<LoanRepayment>();
    }
}