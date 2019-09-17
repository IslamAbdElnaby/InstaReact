using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace InstaReact.Models
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }
        public string comment { get; set; }
        public DateTime? date { get; set; }
        public int postId { get; set; }
        public virtual Post post { get; set; }
        public int userId { get; set; }
        public virtual InstaUser user { get; set; }
        public virtual ICollection<CommentLike> likes { get; set; }
        public Comment()
        {
            likes = new Collection<CommentLike>();
        }

    }
}
