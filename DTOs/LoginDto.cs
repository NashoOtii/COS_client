using System.ComponentModel.DataAnnotations;

namespace SaccoApi.DTOs
{
    public class LoginDto
    {
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}