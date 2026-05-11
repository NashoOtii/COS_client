using System.ComponentModel.DataAnnotations;

namespace SaccoApi.DTOs
{
    public class CreateLoanDto
    {
        [Required]
        public int MemberId { get; set; }

        [Required]
        public int CycleId { get; set; }

        [Required]
        [Range(1, 1000000)]
        public decimal Principal { get; set; }

        [Range(1, 52)]
        public int RepaymentWeeks { get; set; }
    }
}