using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace InstaReact.Models
{
    public class InstaUser
    {
        [Key]
        public int Id { get; set; }
        public string email { get; set; }
        public string name { get; set; }
        public string picPath { get; set; }
        public string IdentityId { get; set; }
        public virtual ICollection<Post> posts { get; set; }
        public virtual ICollection<Follower> followers { get; set; }
        public InstaUser()
        {
            posts = new Collection<Post>();
            followers = new Collection<Follower>();
        }
    }
}
