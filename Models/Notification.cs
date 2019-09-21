using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace InstaReact.Models
{
    public class Notification
    {
        [Key]
        public int id { get; set; }
        public int actionId { get; set; }
        public string type { get; set; }
        public int ownerUserId { get; set; }
        public virtual InstaUser user { get; set; }
        public int userId { get; set; }
        public virtual Post post { get; set; }
        public int postId { get; set; }
        public bool seen { get; set; }
    }
}
