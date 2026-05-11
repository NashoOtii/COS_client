using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SaccoApi.Models
{
        public class Penalty
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int MemberId { get; set; }

        [Required]
        public int CycleId { get; set; }

        [Required]
        [Range(0.01, 5000)]
        public decimal Amount { get; set; }

        [Required]
        public PenaltyType Type { get; set; }

        public string Reason { get; set; } = string.Empty;

        public bool IsPaid { get; set; } = false;

        public DateTime DateIncurred { get; set; } = DateTime.UtcNow;
        
        public DateTime? DatePaid { get; set; }

        // Navigation Properties
        [JsonIgnore] public Member? Member { get; set; }
        [JsonIgnore] public AcademicCycle? Cycle { get; set; }
    }
}