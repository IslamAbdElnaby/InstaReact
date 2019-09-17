using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InstaReact.DTOModels
{
    public class FollowerDTO
    {
        public int id { get; set; }
        public int userId { get; set; }
        public int followerId { get; set; }
    }
}
