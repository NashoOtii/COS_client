using System.ComponentModel.DataAnnotations;

namespace SaccoApi.DTOs
{
    public class CreateCycleDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Range(1, 1000000)]
        public decimal WeeklyContributionAmount { get; set; }

        [Range(1, 1000000)]
        public decimal MaxLoanAmount { get; set; }
    }
}