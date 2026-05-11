using System.ComponentModel.DataAnnotations;

namespace SaccoApi.DTOs
{
    public class CreateRepaymentDto
    {
        [Required]
        [Range(0.01, 1000000)]
        public decimal Amount { get; set; }

        public int? RecordedById { get; set; }

        [MaxLength(500)]
        public string Remarks { get; set; } = string.Empty;
    }
}