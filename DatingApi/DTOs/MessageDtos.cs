using System.ComponentModel.DataAnnotations;

namespace DatingApi.DTOs
{
    public class MessageDto
    {
        public int Id { get; set; }
        public int ConversationId { get; set; }
        public string SenderId { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public bool IsRead { get; set; }
    }

    public class ConversationDto
    {
        public int Id { get; set; }
        public ICollection<ParticipantDto> Participants { get; set; } = new List<ParticipantDto>();
        public MessageDto? LastMessage { get; set; }
        public int UnreadCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class ParticipantDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }

    public class CreateMessageRequest
    {
        [Required]
        public int ConversationId { get; set; }

        [Required]
        [StringLength(1000)]
        public string Content { get; set; } = string.Empty;
    }
}