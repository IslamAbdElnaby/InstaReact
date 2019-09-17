using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace InstaReact.DTOModels
{
    public class InstaUserDTO
    {
        [Key]
        public int Id { get; set; }
        public string name { get; set; }
        public string picPath { get; set; }
        public string IdentityId { get; set; }
        public virtual ICollection<PostDTO> posts { get; set; }
        public virtual ICollection<FollowerDTO> followers { get; set; }
        public InstaUserDTO()
        {
            posts = new Collection<PostDTO>();
            followers = new Collection<FollowerDTO>();
        }
    }
}
