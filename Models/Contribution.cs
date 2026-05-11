using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SaccoApi.Models
{
    public class Contribution
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int MemberId { get; set; }

        [Required]
        public int CycleId { get; set; }

        [Required]
        [Range(0.01, 1000000)]
        public decimal Amount { get; set; }

        [Range(1, 52)]
        public int WeekNumber { get; set; }

        public ContributionStatus Status { get; set; } = ContributionStatus.Paid;

        [Required]
        public int RecordedById { get; set; }

        public DateTime DateRecorded { get; set; } = DateTime.UtcNow;

        // Navigation
        public Member? Member { get; set; }
        [JsonIgnore] public AcademicCycle? Cycle { get; set; }
        [ForeignKey(nameof(RecordedById))]
        public Member? RecordedBy { get; set; }
    }
}