using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace InstaReact.Models
{
    public class Follower
    {
        [Key]
        public int id { get; set; }
        public int userId { get; set; }
        public virtual InstaUser user { get; set; }
        public int followerId { get; set; }
        //public virtual InstaUser follower { get; set; }
    }
}
