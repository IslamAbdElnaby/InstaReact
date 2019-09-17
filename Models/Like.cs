using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace InstaReact.Models
{
    public class Like
    {
        [Key]
        public int Id { get; set; }
        public int postId { get; set; }
        public virtual Post post { get; set; }
        public int userId { get; set; }
        public virtual InstaUser user { get; set; }
        public DateTime? date { get; set; }
    }
}
