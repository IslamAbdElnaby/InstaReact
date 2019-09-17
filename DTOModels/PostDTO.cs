using InstaReact.Models;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace InstaReact.DTOModels
{
    public class PostDTO
    {
        public int Id { get; set; }
        public string caption { get; set; }
        public string picPath { get; set; }
        public DateTime? date { get; set; }
        public int instaUserId { get; set; }
        public virtual ICollection<LikeDTO> likes { get; set; }
        public virtual ICollection<CommentDTO> comments { get; set; }

        public PostDTO()
        {
            likes = new Collection<LikeDTO>();
            comments = new Collection<CommentDTO>();
        }
    }
}
