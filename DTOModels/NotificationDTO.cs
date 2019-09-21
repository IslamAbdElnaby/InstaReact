using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InstaReact.DTOModels
{
    public class NotificationDTO
    {
        public int id { get; set; }
        public int actionId { get; set; }
        public string type { get; set; }
        public virtual InstaUserDTO user { get; set; }
        public virtual PostDTO post { get; set; }
        public int ownerUserId { get; set; }
        public bool seen { get; set; }
    }
}
