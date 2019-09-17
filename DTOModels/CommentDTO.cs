using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace InstaReact.DTOModels
{
    public class CommentDTO
    {
        public int Id { get; set; }
        public string comment { get; set; }
        public int userId { get; set; }
        public int postId { get; set; }
        public string userName { get; set; }
        public virtual ICollection<CommentLikeDTO> likes { get; set; }
        public DateTime? date { get; set; }
        public CommentDTO()
        {
            likes = new Collection<CommentLikeDTO>();
        }

    }
}
