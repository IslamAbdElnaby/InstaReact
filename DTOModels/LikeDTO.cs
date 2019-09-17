using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace InstaReact.DTOModels
{
    public class LikeDTO
    {
        [Key]
        public int Id { get; set; }
        public int postId { get; set; }
        public int userId { get; set; }
        public DateTime? date { get; set; }
    }
}
