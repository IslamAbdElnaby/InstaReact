using InstaReact.DTOModels;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace InstaReact.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string caption { get; set; }
        public string picPath { get; set; }
        public int instaUserId { get; set; }
        public DateTime? date { get; set; }
        public virtual InstaUser instaUser { get; set; }
        public virtual ICollection<Like> likes { get; set; }
        public virtual ICollection<Comment> comments { get; set; }
        public Post()
        {
            likes = new Collection<Like>();
            comments = new Collection<Comment>();
        }
    }
}
