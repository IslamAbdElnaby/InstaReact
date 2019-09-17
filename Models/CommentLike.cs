using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace InstaReact.Models
{
    public class CommentLike
    {
        [Key]
        public int Id { get; set; }
        public int userId { get; set; }
        public virtual InstaUser user { get; set; }
        public int commentId { get; set; }
        public virtual Comment comment { get; set; }
        public DateTime? date { get; set; }

    }
}
