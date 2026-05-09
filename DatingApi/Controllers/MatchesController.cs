using DatingApi.Data;
using DatingApi.DTOs;
using DatingApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApi.Controllers
{
    [ApiController]
    [Route("api/matches")]
    [Authorize]
    public class MatchesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MatchesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetMatches()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var matches = await _context.Matches
                .Include(m => m.MatchedUser)
                .Where(m => m.UserId == userId && m.IsMutual)
                .Select(m => new MatchDto
                {
                    Id = m.Id,
                    UserId = m.MatchedUserId,
                    FirstName = m.MatchedUser!.FirstName,
                    LastName = m.MatchedUser.LastName,
                    Age = m.MatchedUser.Age,
                    Avatar = m.MatchedUser.Avatar,
                    Bio = m.MatchedUser.Bio,
                    Interests = m.MatchedUser.Preferences != null ? m.MatchedUser.Preferences.Interests : null,
                    MatchDate = m.MatchDate,
                    Compatibility = m.Compatibility
                })
                .ToListAsync();

            return Ok(matches);
        }

        [HttpGet("potential")]
        public async Task<IActionResult> GetPotentialMatches()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            // Get users that the current user hasn't responded to yet
            var respondedUserIds = await _context.MatchResponses
                .Where(mr => mr.UserId == userId)
                .Select(mr => mr.TargetUserId)
                .ToListAsync();

            // For simplicity, get all users except current user
            // In a real app, you'd implement proper matching logic
            var potentialMatches = await _context.Users
                .Include(u => u.Preferences)
                .Where(u => u.Id != userId)
                .Take(20) // Limit for demo
                .ToListAsync();

            // Filter out users already responded to
            potentialMatches = potentialMatches
                .Where(u => !respondedUserIds.Contains(u.Id))
                .ToList();

            var result = potentialMatches.Select(u => new MatchDto
            {
                Id = 0, // Not a real match yet
                UserId = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Age = u.Age,
                Avatar = u.Avatar,
                Bio = u.Bio,
                Interests = u.Preferences?.Interests,
                MatchDate = DateTime.UtcNow,
                Compatibility = new Random().Next(50, 100) // Random compatibility for demo
            }).ToList();

            return Ok(potentialMatches);
        }

        [HttpPost("respond")]
        public async Task<IActionResult> RespondToMatch([FromBody] MatchResponseDto response)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            // Check if there's already a match response
            var existingResponse = await _context.MatchResponses
                .FirstOrDefaultAsync(mr => mr.UserId == userId && mr.TargetUserId == response.UserId);

            if (existingResponse != null)
            {
                return BadRequest("Already responded to this match");
            }

            // Create match response
            var matchResponse = new MatchResponse
            {
                UserId = userId,
                TargetUserId = response.UserId,
                ActionType = response.ActionType,
                Timestamp = response.Timestamp
            };

            // If it's a like, check if the other user also liked
            if (response.ActionType == "like")
            {
                var otherUserResponse = await _context.MatchResponses
                    .FirstOrDefaultAsync(mr => mr.UserId == response.UserId && mr.TargetUserId == userId && mr.ActionType == "like");

                if (otherUserResponse != null)
                {
                    // Create mutual match
                    var match = new Match
                    {
                        UserId = userId,
                        MatchedUserId = response.UserId,
                        IsMutual = true,
                        Compatibility = new Random().Next(50, 100)
                    };
                    _context.Matches.Add(match);
                }
            }

            _context.MatchResponses.Add(matchResponse);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{matchId}")]
        public async Task<IActionResult> Unmatch(int matchId)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var match = await _context.Matches.FindAsync(matchId);
            if (match == null || match.UserId != userId)
            {
                return NotFound();
            }

            _context.Matches.Remove(match);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("{matchId}")]
        public async Task<IActionResult> GetMatchDetails(int matchId)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var match = await _context.Matches
                .Include(m => m.MatchedUser)
                .FirstOrDefaultAsync(m => m.Id == matchId && m.UserId == userId);

            if (match == null)
            {
                return NotFound();
            }

            var matchDto = new MatchDto
            {
                Id = match.Id,
                UserId = match.MatchedUserId,
                FirstName = match.MatchedUser!.FirstName,
                LastName = match.MatchedUser.LastName,
                Age = match.MatchedUser.Age,
                Avatar = match.MatchedUser.Avatar,
                Bio = match.MatchedUser.Bio,
                Interests = match.MatchedUser.Preferences != null ? match.MatchedUser.Preferences.Interests : null,
                MatchDate = match.MatchDate,
                Compatibility = match.Compatibility
            };

            return Ok(matchDto);
        }
    }
}