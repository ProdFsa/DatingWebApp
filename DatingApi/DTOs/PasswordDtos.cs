using System.ComponentModel.DataAnnotations;

namespace DatingApi.DTOs
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }

    public class ForgotPasswordResponse
    {
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; }
    }

    public class ResetPasswordRequest
    {
        [Required]
        public string Token { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        [Compare("NewPassword")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }

    public class ResetPasswordResponse
    {
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; }
    }

    public class VerifyResetTokenResponse
    {
        public bool Valid { get; set; }
        public string? Email { get; set; }
    }
}