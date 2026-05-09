using DatingApi.Data;
using DatingApi.DTOs;
using DatingApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApi.Controllers
{
    [ApiController]
    [Route("api/profile")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _context;

        public ProfileController(UserManager<User> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .Include(u => u.Preferences)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            var profile = new UserProfileDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email!,
                Age = user.Age,
                Bio = user.Bio,
                Avatar = user.Avatar,
                Photos = user.Photos,
                Preferences = user.Preferences != null ? new UserPreferencesDto
                {
                    MinAge = user.Preferences.MinAge,
                    MaxAge = user.Preferences.MaxAge,
                    Location = user.Preferences.Location,
                    Interests = user.Preferences.Interests
                } : null,
                CreatedAt = user.CreatedAt
            };

            return Ok(profile);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .Include(u => u.Preferences)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            // Update user properties
            if (request.FirstName != null) user.FirstName = request.FirstName;
            if (request.LastName != null) user.LastName = request.LastName;
            if (request.Age.HasValue) user.Age = request.Age;
            if (request.Bio != null) user.Bio = request.Bio;
            user.UpdatedAt = DateTime.UtcNow;

            // Update preferences
            if (request.Preferences != null)
            {
                if (user.Preferences == null)
                {
                    user.Preferences = new UserPreferences { UserId = user.Id };
                    _context.UserPreferences.Add(user.Preferences);
                }

                user.Preferences.MinAge = request.Preferences.MinAge;
                user.Preferences.MaxAge = request.Preferences.MaxAge;
                user.Preferences.Location = request.Preferences.Location;
                user.Preferences.Interests = request.Preferences.Interests;
            }

            await _context.SaveChangesAsync();

            return await GetProfile();
        }

        [HttpPost("photo")]
        public async Task<IActionResult> UploadPhoto(IFormFile file)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            // In a real application, save the file to storage (e.g., Azure Blob Storage, local file system)
            // For demo purposes, we'll just simulate saving and return a fake URL
            var photoUrl = $"https://example.com/photos/{userId}/{Guid.NewGuid()}.jpg";

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            if (user.Photos == null)
            {
                user.Photos = new List<string>();
            }

            user.Photos.Add(photoUrl);
            await _context.SaveChangesAsync();

            return Ok(new UploadPhotoResponse { PhotoUrl = photoUrl });
        }

        [HttpDelete("photo")]
        public async Task<IActionResult> DeletePhoto([FromBody] string photoUrl)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            if (user.Photos != null && user.Photos.Contains(photoUrl))
            {
                user.Photos.Remove(photoUrl);
                // In a real app, delete the file from storage
                await _context.SaveChangesAsync();
            }

            return Ok();
        }
    }
}