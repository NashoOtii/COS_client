using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SaccoApi.Models
{
    public class AuditLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string TableName { get; set; } = string.Empty;

        [Required]
        public string EntityId { get; set; } = string.Empty;

        public AuditAction Action { get; set; }

        // Store as JSON string — or use a proper JSON column type in EF 8+
        public string Changes { get; set; } = string.Empty;

        [Required]
        public int PerformedById { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(PerformedById))]
        public Member? PerformedBy { get; set; }
    }
}