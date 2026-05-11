using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SaccoApi.Models
{
    public class Investment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CycleId { get; set; }

        [Required]
        [MaxLength(200)]
        public string ProjectName { get; set; } = string.Empty;

        [Required]
        [Range(1, 10000000)]
        public decimal CapitalAllocated { get; set; }

        public decimal ReturnsGenerated { get; set; } = 0;

        public InvestmentStatus Status { get; set; } = InvestmentStatus.Active;

        [MaxLength(1000)]
        public string Notes { get; set; } = string.Empty;

        public DateTime InvestmentDate { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedDate { get; set; }

        [JsonIgnore] public AcademicCycle? Cycle { get; set; }
    }
}