using System.ComponentModel.DataAnnotations;

namespace SaccoApi.DTOs
{
    public class CreateInvestmentDto
    {
        [Required]
        public int CycleId { get; set; }

        [Required]
        public string ProjectName { get; set; } = string.Empty;

        [Required]
        [Range(1, 10000000)]
        public decimal CapitalAllocated { get; set; }

        public string Notes { get; set; } = string.Empty;
    }
}