using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using InstaReact.DTOModels;
using InstaReact.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InstaReact.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly InstaDbContext context;
        private readonly IMapper mapper;
        private readonly IHostingEnvironment env;

        public HomeController(InstaDbContext context, IMapper mapper, IHostingEnvironment env)
        {
            this.context = context;
            this.mapper = mapper;
            this.env = env;
        }

        [HttpGet("{action}/{username}")]
        public async Task<IEnumerable<InstaUserDTO>> SearchByName(string username)
        {
            var data = await context.instaUsers
                .Where(u => u.name.StartsWith(username))
                .ToListAsync();
            return mapper.Map<IEnumerable<InstaUser>, IEnumerable<InstaUserDTO>>(data);
        }

        [HttpPost("{action}")]
        public async Task<string> AddImage(IFormFile file)
        {
            if (file.Length > 0)
            {
                string path = Path.Combine(env.WebRootPath, "PostsImage");
                var savedPath = Path.Combine(path, file.FileName);
                using (var fs = new FileStream(savedPath, FileMode.Create))
                {
                    await file.CopyToAsync(fs);
                }
                return "PostsImage/" + file.FileName;
            }
            return "";
                //await context.SaveChangesAsync();
        }
        
        [HttpPost("{action}")]
        public async Task<int> AddPost([FromBody] PostDTO post)
        {
            try
            {
                var newPost = mapper.Map<PostDTO, Post>(post);
                newPost.date = DateTime.Now;
                await context.posts.AddAsync(newPost);
                await context.SaveChangesAsync();
                return newPost.Id;
            }
            catch
            {
                return -1;
            }
        }

        [HttpGet("{action}/{postId}")]
        public async Task<PostDTO> GetPostById(int postId)
        {
            try
            {
                var post = await context.posts
                    .Include(p => p.instaUser)
                    .Include(p => p.likes)
                    .Include(p => p.comments)
                    .ThenInclude(c => c.likes)
                    .ThenInclude(c => c.user)
                    .SingleAsync(p => p.Id == postId);
                var ret = mapper.Map<Post, PostDTO>(post);
                return ret;
            }
            catch{ return null; }
        }

        [HttpGet("getPosts/{id}")]
        public async Task<ActionResult<IEnumerable<PostDTO>>> Get(string id)
        {
            var user = await context.instaUsers.SingleAsync(u => u.IdentityId == id);
            var Ids = await context.followers
                .Where(f => f.followerId == user.Id)
                .Select(f => f.userId).ToListAsync();
            Ids.Add(user.Id);
            var posts = await context.posts
                .Include(p => p.instaUser)
                .Include(p => p.comments)
                .ThenInclude(c => c.user)
                .Include(p => p.likes)
                .Where(p => Ids.Contains(p.instaUserId))
                .OrderByDescending(p => p.date)
                .ToListAsync();
            try
            {
                var ret = mapper.Map<List<Post>, List<PostDTO>>(posts);
                return ret;
            }
            catch { return null; }
        }
        
        [HttpPost("like")]
        public async Task<int> likePost([FromBody] LikeDTO like)
        {
            try
            {
                var model = await context.likes.SingleAsync(l => l.Id == like.Id);
                context.likes.Remove(model);
                await context.SaveChangesAsync();
                return -1;
            }
            catch
            {
                var model = mapper.Map<LikeDTO, Like>(like);
                model.date = DateTime.Now;
                await context.likes.AddAsync(model);
                await context.SaveChangesAsync();
                int ownerId = context.posts.Single(p => p.Id == model.postId).instaUserId;

                var not = new Notification()
                {
                    actionId = model.Id,
                    ownerUserId = ownerId,
                    userId = like.userId,
                    postId = like.postId,
                    seen = false,
                    type = "like"
                };
                await context.notifications.AddAsync(not);
                await context.SaveChangesAsync();
                return model.Id;
            }
        }
    
        [HttpPost("comment")]
        public async Task<int> Comment([FromBody] CommentDTO comment)
        {
            try
            {
                var model = mapper.Map<CommentDTO, Comment>(comment);
                model.date = DateTime.Now;
                await context.comments.AddAsync(model);
                await context.SaveChangesAsync();
                int ownerId = context.posts.Single(p => p.Id == model.postId).instaUserId;
                var not = new Notification()
                {
                    actionId = model.Id,
                    ownerUserId = ownerId,
                    userId = comment.userId,
                    postId = comment.postId,
                    seen = false,
                    type = "comment"
                };
                await context.notifications.AddAsync(not);
                await context.SaveChangesAsync();
                return model.Id;
            }
            catch { return -1; }
        }

        [HttpPost("likeComment")]
        public async Task<int> likeComment([FromBody] CommentLikeDTO like)
        {
            try
            {
                var model = await context.commentLikes.SingleAsync(l => l.Id == like.Id);
                context.commentLikes.Remove(model);
                await context.SaveChangesAsync();
                return -1;
            }
            catch
            {
                var model = mapper.Map<CommentLikeDTO, CommentLike>(like);
                model.date = DateTime.Now;
                await context.commentLikes.AddAsync(model);
                await context.SaveChangesAsync();
                return model.Id;
            }
        }

        [HttpGet("{action}/{userId}")]
        public async Task<IEnumerable<NotificationDTO>> getNotifications(int userId)
        {
            var notifications = await context.notifications
                .Where(n => n.ownerUserId == userId)
                .Include(n => n.user)
                .Include(n => n.post)
                .ToListAsync();
            return mapper.Map<IEnumerable<Notification>, IEnumerable<NotificationDTO>>(notifications);
        }

        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        [HttpDelete("{action}/{id}")]
        public async Task DeletePost(int id)
        {
            try
            {
                var model = await context.posts
                    .Include(p => p.likes)
                    .Include(p => p.comments)
                    .Include(p => p.notifications)
                    .SingleAsync(p => p.Id == id);
                context.comments.RemoveRange(model.comments);
                context.likes.RemoveRange(model.likes);
                context.notifications.RemoveRange(model.notifications);
                await context.SaveChangesAsync();
                context.posts.Remove(model);
                await context.SaveChangesAsync();
            }
            catch(Exception e) { }
        }
    }
}
