using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DatingApi.Models
{
    public class Match
    {
        public int Id { get; set; }

        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; } = string.Empty;

        public User? User { get; set; }

        [Required]
        [ForeignKey("MatchedUser")]
        public string MatchedUserId { get; set; } = string.Empty;

        public User? MatchedUser { get; set; }

        public DateTime MatchDate { get; set; } = DateTime.UtcNow;

        public int Compatibility { get; set; } = 0;

        public bool IsMutual { get; set; } = false;

        public ICollection<MatchResponse>? Responses { get; set; }
    }

    public class MatchResponse
    {
        public int Id { get; set; }

        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; } = string.Empty;

        public User? User { get; set; }

        [Required]
        public string TargetUserId { get; set; } = string.Empty;

        [Required]
        public string ActionType { get; set; } = string.Empty; // "like" or "pass"

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}