using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SaccoApi.Models
{
    public class LoanRepayment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int LoanId { get; set; }

        [Required]
        [Range(0.01, 1000000)]
        public decimal Amount { get; set; }

        public DateTime DatePaid { get; set; } = DateTime.UtcNow;

        [MaxLength(500)]
        public string Remarks { get; set; } = string.Empty;

        public int? RecordedById { get; set; }

        // Navigation
        [JsonIgnore] public Loan? Loan { get; set; }
        [ForeignKey(nameof(RecordedById))]
        public Member? RecordedBy { get; set; }
    }
}