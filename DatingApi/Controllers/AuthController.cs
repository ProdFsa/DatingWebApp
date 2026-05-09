using DatingApi.Data;
using DatingApi.DTOs;
using DatingApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DatingApi.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            ApplicationDbContext context,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Invalid email or password" });
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Invalid email or password" });
            }

            var token = GenerateJwtToken(user);

            var response = new LoginResponse
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FirstName = user.FirstName,
                    LastName = user.LastName
                }
            };

            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Registration failed", errors = result.Errors });
            }

            var response = new RegisterResponse
            {
                Message = "Registration successful",
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FirstName = user.FirstName,
                    LastName = user.LastName
                }
            };

            return Ok(response);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return Ok(new ForgotPasswordResponse { Message = "If the email exists, a reset link has been sent.", Success = true });
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            // In a real application, send email with reset token
            // For demo purposes, we'll just return success

            return Ok(new ForgotPasswordResponse { Message = "Password reset email sent.", Success = true });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email!);
            if (user == null)
            {
                return BadRequest(new { message = "Invalid token or email" });
            }

            var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Password reset failed", errors = result.Errors });
            }

            return Ok(new ResetPasswordResponse { Message = "Password reset successful", Success = true });
        }

        [HttpGet("verify-reset-token/{token}")]
        public async Task<IActionResult> VerifyResetToken(string token)
        {
            // This is a simplified implementation
            // In a real app, you'd validate the token properly
            return Ok(new VerifyResetTokenResponse { Valid = true });
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}