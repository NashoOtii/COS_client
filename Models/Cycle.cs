using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SaccoApi.Models
{
    public class AcademicCycle
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public CycleStatus Status { get; set; } = CycleStatus.Active;

        [Required]
        [Range(0, 100)]
        public decimal LoanFeePercentage { get; set; } = 10.00m;

        [Required]
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        [Range(0.01, 1000000)]
        public decimal WeeklyContributionAmount { get; set; }

        public decimal MaxLoanAmount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [JsonIgnore] public ICollection<Contribution> Contributions { get; set; } = new List<Contribution>();
        [JsonIgnore] public ICollection<Loan> Loans { get; set; } = new List<Loan>();
        [JsonIgnore] public ICollection<Investment> Investments { get; set; } = new List<Investment>();
        [JsonIgnore] public ICollection<CycleDividend> Dividends { get; set; } = new List<CycleDividend>();
        [JsonIgnore] public ICollection<Penalty> Penalties { get; set; } = new List<Penalty>();
    }
}