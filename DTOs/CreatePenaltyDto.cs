using System.ComponentModel.DataAnnotations;
using SaccoApi.Models;

namespace SaccoApi.DTOs
{
    public class CreatePenaltyDto
    {
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
    }
}