using System.ComponentModel.DataAnnotations;

namespace DatingApi.DTOs
{
    public class UserProfileDto
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int? Age { get; set; }
        public string? Bio { get; set; }
        public string? Avatar { get; set; }
        public List<string>? Photos { get; set; }
        public UserPreferencesDto? Preferences { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class UserPreferencesDto
    {
        public int? MinAge { get; set; }
        public int? MaxAge { get; set; }
        public string? Location { get; set; }
        public List<string>? Interests { get; set; }
    }

    public class UpdateProfileRequest
    {
        [StringLength(50)]
        public string? FirstName { get; set; }

        [StringLength(50)]
        public string? LastName { get; set; }

        public int? Age { get; set; }

        [StringLength(500)]
        public string? Bio { get; set; }

        public UserPreferencesDto? Preferences { get; set; }
    }

    public class UploadPhotoResponse
    {
        public string PhotoUrl { get; set; } = string.Empty;
    }
}