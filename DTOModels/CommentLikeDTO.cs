using InstaReact.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace InstaReact.DTOModels
{
    public class CommentLikeDTO
    {
        public int Id { get; set; }
        public int userId { get; set; }
        public int commentId { get; set; }
        public DateTime? date { get; set; }
    }
}
