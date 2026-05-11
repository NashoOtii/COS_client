using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace SaccoApi.Models
{
    public class CycleDividend
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int MemberId { get; set; }

        [Required]
        public int CycleId { get; set; }

        public decimal TotalSavings { get; set; }
        public decimal InterestEarned { get; set; }
        public decimal ProjectReturns { get; set; }

        // Deduct outstanding loan balance at cycle close
        public decimal LoanDeductions { get; set; } = 0;

        // TotalSavings + InterestEarned + ProjectReturns - LoanDeductions
        public decimal TotalPayoutAmount { get; set; }

        public bool IsDisbursed { get; set; } = false;
        public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DisbursedDate { get; set; }

        [JsonIgnore] public Member? Member { get; set; }
        [JsonIgnore] public AcademicCycle? Cycle { get; set; }

    }
}