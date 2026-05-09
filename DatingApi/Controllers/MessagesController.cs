using DatingApi.Data;
using DatingApi.DTOs;
using DatingApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApi.Controllers
{
    [ApiController]
    [Route("api/messages")]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MessagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var conversations = await _context.Conversations
                .Include(c => c.User1)
                .Include(c => c.User2)
                .Include(c => c.Messages.OrderByDescending(m => m.Timestamp).Take(1))
                .Where(c => c.User1Id == userId || c.User2Id == userId)
                .Select(c => new ConversationDto
                {
                    Id = c.Id,
                    Participants = new List<ParticipantDto>
                    {
                        new ParticipantDto { Id = c.User1Id, Name = $"{c.User1!.FirstName} {c.User1.LastName}" },
                        new ParticipantDto { Id = c.User2Id, Name = $"{c.User2!.FirstName} {c.User2.LastName}" }
                    },
                    LastMessage = c.Messages.Any() ? new MessageDto
                    {
                        Id = c.Messages.First().Id,
                        ConversationId = c.Id,
                        SenderId = c.Messages.First().SenderId,
                        Content = c.Messages.First().Content,
                        Timestamp = c.Messages.First().Timestamp,
                        IsRead = c.Messages.First().IsRead
                    } : null,
                    UnreadCount = c.Messages.Count(m => !m.IsRead && m.SenderId != userId),
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync();

            return Ok(conversations);
        }

        [HttpGet("conversations/{conversationId}")]
        public async Task<IActionResult> GetMessages(int conversationId)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var conversation = await _context.Conversations.FindAsync(conversationId);
            if (conversation == null || (conversation.User1Id != userId && conversation.User2Id != userId))
            {
                return NotFound();
            }

            var messages = await _context.Messages
                .Where(m => m.ConversationId == conversationId)
                .OrderBy(m => m.Timestamp)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    ConversationId = m.ConversationId,
                    SenderId = m.SenderId,
                    Content = m.Content,
                    Timestamp = m.Timestamp,
                    IsRead = m.IsRead
                })
                .ToListAsync();

            return Ok(messages);
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] CreateMessageRequest request)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var conversation = await _context.Conversations.FindAsync(request.ConversationId);
            if (conversation == null || (conversation.User1Id != userId && conversation.User2Id != userId))
            {
                return NotFound();
            }

            var message = new Message
            {
                ConversationId = request.ConversationId,
                SenderId = userId,
                Content = request.Content,
                Timestamp = DateTime.UtcNow,
                IsRead = false
            };

            _context.Messages.Add(message);
            conversation.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var messageDto = new MessageDto
            {
                Id = message.Id,
                ConversationId = message.ConversationId,
                SenderId = message.SenderId,
                Content = message.Content,
                Timestamp = message.Timestamp,
                IsRead = message.IsRead
            };

            return Ok(messageDto);
        }

        [HttpPut("conversations/{conversationId}/read")]
        public async Task<IActionResult> MarkAsRead(int conversationId)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var conversation = await _context.Conversations.FindAsync(conversationId);
            if (conversation == null || (conversation.User1Id != userId && conversation.User2Id != userId))
            {
                return NotFound();
            }

            var unreadMessages = await _context.Messages
                .Where(m => m.ConversationId == conversationId && !m.IsRead && m.SenderId != userId)
                .ToListAsync();

            foreach (var message in unreadMessages)
            {
                message.IsRead = true;
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{messageId}")]
        public async Task<IActionResult> DeleteMessage(int messageId)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var message = await _context.Messages.FindAsync(messageId);
            if (message == null || message.SenderId != userId)
            {
                return NotFound();
            }

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("conversations/{conversationId}/details")]
        public async Task<IActionResult> GetConversation(int conversationId)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var conversation = await _context.Conversations
                .Include(c => c.User1)
                .Include(c => c.User2)
                .Include(c => c.Messages.OrderByDescending(m => m.Timestamp).Take(1))
                .FirstOrDefaultAsync(c => c.Id == conversationId && (c.User1Id == userId || c.User2Id == userId));

            if (conversation == null)
            {
                return NotFound();
            }

            var conversationDto = new ConversationDto
            {
                Id = conversation.Id,
                Participants = new List<ParticipantDto>
                {
                    new ParticipantDto { Id = conversation.User1Id, Name = $"{conversation.User1!.FirstName} {conversation.User1.LastName}" },
                    new ParticipantDto { Id = conversation.User2Id, Name = $"{conversation.User2!.FirstName} {conversation.User2.LastName}" }
                },
                LastMessage = conversation.Messages.Any() ? new MessageDto
                {
                    Id = conversation.Messages.First().Id,
                    ConversationId = conversation.Id,
                    SenderId = conversation.Messages.First().SenderId,
                    Content = conversation.Messages.First().Content,
                    Timestamp = conversation.Messages.First().Timestamp,
                    IsRead = conversation.Messages.First().IsRead
                } : null,
                UnreadCount = conversation.Messages.Count(m => !m.IsRead && m.SenderId != userId),
                CreatedAt = conversation.CreatedAt,
                UpdatedAt = conversation.UpdatedAt
            };

            return Ok(conversationDto);
        }
    }
}