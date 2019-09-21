using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace InstaReact.Models
{
    public class InstaDbContext : IdentityDbContext
    {
        public InstaDbContext(DbContextOptions<InstaDbContext> options) : base(options) { }
        public DbSet<InstaUser> instaUsers { get; set; }
        public DbSet<Like> likes { get; set; }
        public DbSet<Post> posts { get; set; }
        public DbSet<Comment> comments { get; set; }
        public DbSet<Follower> followers { get; set; }
        public DbSet<CommentLike> commentLikes { get; set; }
        public DbSet<Notification> notifications { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            foreach (var relationship in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var rel in relationship.GetForeignKeys())
                {
                    rel.DeleteBehavior = DeleteBehavior.Restrict;
                }
            }

            //modelBuilder.Entity<IdentityUserLogin<string>>()
            //    .HasKey(c => new { c.LoginProvider, c.ProviderKey });
        }
    }
}