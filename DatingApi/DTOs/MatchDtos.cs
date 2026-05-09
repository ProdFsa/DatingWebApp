using System.ComponentModel.DataAnnotations;

namespace DatingApi.DTOs
{
    public class MatchDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int? Age { get; set; }
        public string? Avatar { get; set; }
        public string? Bio { get; set; }
        public List<string>? Interests { get; set; }
        public DateTime MatchDate { get; set; }
        public int Compatibility { get; set; }
        public bool? IsLiked { get; set; }
    }

    public class MatchResponseDto
    {
        [Required]
        public string Id { get; set; } = string.Empty;

        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public string ActionType { get; set; } = string.Empty; // "like" or "pass"

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}