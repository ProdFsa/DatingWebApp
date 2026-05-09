using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;

namespace DatingApi.Models
{
    public class User : IdentityUser
    {
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        public int? Age { get; set; }

        [StringLength(500)]
        public string? Bio { get; set; }

        [StringLength(200)]
        public string? Avatar { get; set; }

        [Column("Photos")]
        [StringLength(4000)]
        public string? PhotosData { get; set; }

        [NotMapped]
        public List<string>? Photos
        {
            get => string.IsNullOrEmpty(PhotosData)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(PhotosData) ?? new List<string>();
            set => PhotosData = value == null ? null : JsonSerializer.Serialize(value);
        }

        public UserPreferences? Preferences { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }

    public class UserPreferences
    {
        public int Id { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; } = string.Empty;

        public User? User { get; set; }

        public int? MinAge { get; set; }

        public int? MaxAge { get; set; }

        public string? Location { get; set; }

        [Column("Interests")]
        [StringLength(4000)]
        public string? InterestsData { get; set; }

        [NotMapped]
        public List<string>? Interests
        {
            get => string.IsNullOrEmpty(InterestsData)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(InterestsData) ?? new List<string>();
            set => InterestsData = value == null ? null : JsonSerializer.Serialize(value);
        }
    }
}