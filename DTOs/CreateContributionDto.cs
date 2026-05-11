using System.ComponentModel.DataAnnotations;
using SaccoApi.Models;

namespace SaccoApi.DTOs
{
    public class CreateContributionDto
    {
        [Required]
        public int MemberId { get; set; }

        [Required]
        public int CycleId { get; set; }

        [Required]
        [Range(1, 1000000)]
        public decimal Amount { get; set; }

        [Range(1, 52)]
        public int WeekNumber { get; set; }

        public ContributionStatus Status { get; set; } = ContributionStatus.Paid;

        [Required]
        public int RecordedById { get; set; }
    }
}