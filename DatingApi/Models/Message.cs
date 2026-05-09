using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DatingApi.Models
{
    public class Message
    {
        public int Id { get; set; }

        [Required]
        [ForeignKey("Conversation")]
        public int ConversationId { get; set; }

        public Conversation? Conversation { get; set; }

        [Required]
        [ForeignKey("Sender")]
        public string SenderId { get; set; } = string.Empty;

        public User? Sender { get; set; }

        [Required]
        [StringLength(1000)]
        public string Content { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public bool IsRead { get; set; } = false;
    }

    public class Conversation
    {
        public int Id { get; set; }

        [Required]
        [ForeignKey("User1")]
        public string User1Id { get; set; } = string.Empty;

        public User? User1 { get; set; }

        [Required]
        [ForeignKey("User2")]
        public string User2Id { get; set; } = string.Empty;

        public User? User2 { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Message>? Messages { get; set; }
    }
}