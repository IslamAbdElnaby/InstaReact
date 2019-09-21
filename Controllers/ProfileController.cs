using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using InstaReact.DTOModels;
using InstaReact.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InstaReact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly InstaDbContext context;
        private readonly IMapper mapper;

        public ProfileController(InstaDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }
        
        [HttpGet("{username}")]
        public async Task<InstaUserDTO> Get(string username)
        {
            try
            {
                var data = await context.instaUsers
                    .Include(p => p.posts)
                        .ThenInclude(p => p.likes)
                    .Include(p => p.posts)
                        .ThenInclude(p => p.comments)
                            .ThenInclude(c => c.user)
                    .Include(u => u.followers)
                    .SingleAsync(u => u.name == username);
                data.posts = data.posts.OrderByDescending(p => p.date).ToList();
                return mapper.Map<InstaUser, InstaUserDTO>(data);
            }
            catch
            {
                return null;
            }
        }
        
        [HttpGet("{action}/{userId}")]
        public async Task<IEnumerable<InstaUserDTO>> GetFollowing(int userId)
        {
            var following = await context.followers
                .Where(f => f.followerId == userId)
                .Select(f => f.user)
                .ToListAsync();
            return mapper.Map<IEnumerable<InstaUser>, IEnumerable<InstaUserDTO>>(following);
        }

        [HttpGet("{action}/{userId}")]
        public async Task<IEnumerable<InstaUserDTO>> GetFollowers(int userId)
        {
            var followers = await context.followers
                .Where(f => f.userId == userId)
                .Select(f => context.instaUsers.Single(u => u.Id == f.followerId))
                .ToListAsync();
            return mapper.Map<IEnumerable<InstaUser>, IEnumerable<InstaUserDTO>>(followers);
        }

        [HttpGet("{action}/{followerId}/{userId}")]
       public async Task<bool> IsFollowing(int followerId, int userId)
        {
            try
            {
                var a = await context.followers
                    .SingleAsync(f => f.userId == userId && f.followerId == followerId);
                return true;
            }
            catch { return false; }
        }
      
        [HttpPost("{action}")]
        public async Task<int> Follow([FromBody] FollowerDTO follower)
        {
            var f = mapper.Map<FollowerDTO, Follower>(follower);
            try
            {
                var m = await context.followers
                    .SingleAsync(a => a.followerId == follower.followerId && a.userId == follower.userId);
                context.followers.Remove(m);
                await context.SaveChangesAsync();
                return -1;
            }
            catch
            {
                await context.followers.AddAsync(f);
                await context.SaveChangesAsync();
                var not = new Notification()
                {
                    actionId = f.id,
                    ownerUserId = f.userId,
                    userId = f.followerId,
                    seen = false,
                    type = "follow",
                    postId = null
                };
                await context.notifications.AddAsync(not);
                await context.SaveChangesAsync();
            }
            return f.id;
        }

        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
