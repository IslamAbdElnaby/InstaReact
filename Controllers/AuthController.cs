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
    public class AuthController : Controller
    {
        private readonly SignInManager<IdentityUser> signInManager;
        private readonly IMapper mapper;
        private readonly UserManager<IdentityUser> manager;
        private readonly InstaDbContext context;

        public AuthController(SignInManager<IdentityUser> signInManager,
            UserManager<IdentityUser> manager, InstaDbContext context, IMapper mapper)
        {
            this.signInManager = signInManager;
            this.mapper = mapper;
            this.manager = manager;
            this.context = context;
        }

        // GET: api/Auth
        [HttpGet("getAppUser/{id}")]
        public async Task <InstaUserDTO> Get(string id)
        {
            //var newUser = new IdentityUser() { UserName = "islam", Email = "islam@yahoo.com" };
            //var reg = await this.manager.CreateAsync(newUser, "Islam@123" );
            //var res = await this.signInManager.PasswordSignInAsync("islam", "Islam@123", false, false);
            //var a = await manager.GetUserAsync(User);
            //var user = await manager.FindByNameAsync("islam");
            //await context.instaUsers.AddAsync(new InstaUser()
            //{
            //    IdentityId = user.Id,
            //    name = "islam",
            //    picPath = ""
            //});
            //await context.SaveChangesAsync();
            var instaUser = await context.instaUsers
                .Include(u => u.posts)
                .SingleOrDefaultAsync(u => u.IdentityId == id);
            var dto = mapper.Map<InstaUser, InstaUserDTO>(instaUser);
            return dto;

        }

        [HttpGet("getAppUserById/{id}")]
        public async Task<InstaUserDTO> GetUserById(int id)
        {
            var instaUser = await context.instaUsers
                .Include(u => u.posts)
                .SingleOrDefaultAsync(u => u.Id == id);
            var dto = mapper.Map<InstaUser, InstaUserDTO>(instaUser);
            return dto;

        }

        [HttpPost("login")]
        public async Task<string> Login([FromBody] AuthUser user)
        {
            var res = await this.signInManager.PasswordSignInAsync(user.name, user.password, false, false);
            if (!res.Succeeded) return String.Empty;
            var a = await this.manager.FindByNameAsync(user.name);
            return a.Id;
        }

        [HttpPost("register")]
        public async Task<Object> Register([FromBody] AuthUser user)
        {
            var newUser = new IdentityUser() { UserName = user.name, Email = user.email };
            var reg = await this.manager.CreateAsync(newUser, user.password);
            if (!reg.Succeeded) return new { id = String.Empty, errors = reg.Errors};

            var res = await this.signInManager.PasswordSignInAsync(user.name, user.password, false, false);
            if (!res.Succeeded) return new { id = String.Empty };
            try
            {
                var model = new InstaUser()
                {
                    IdentityId = newUser.Id,
                    email = newUser.Email,
                    name = newUser.UserName
                };
                await context.instaUsers.AddAsync(model);
                await context.SaveChangesAsync();
            }
            catch { return String.Empty; }
            var ret = await manager.FindByNameAsync(user.name);
            return new { id = ret.Id };
        }

        [HttpPost("logout")]
        public async Task<bool> Logout()
        {
            try
            {
                await this.signInManager.SignOutAsync();
                return true;
            }
            catch { return false; }
        }

        // PUT: api/Auth/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }

    public class AuthUser
    {
        public string name { get; set; }
        public string email { get; set; }
        public string password { get; set; }
    }
}
