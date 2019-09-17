using AutoMapper;
using InstaReact.DTOModels;
using InstaReact.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InstaReact
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {

            CreateMap<InstaUser, InstaUserDTO>();
            CreateMap<InstaUserDTO, InstaUser>()
                .ForMember(opt => opt.Id, opt => opt.Ignore());

            CreateMap<Like, LikeDTO>();
            CreateMap<LikeDTO, Like>()
                .ForMember(opt => opt.Id, opt => opt.Ignore());

            CreateMap<Comment, CommentDTO>()
                .ForMember(opt => opt.userName, opt => opt.MapFrom(c => c.user.name));
            CreateMap<CommentDTO, Comment>()
                .ForMember(opt => opt.Id, opt => opt.Ignore());

            CreateMap<Post, PostDTO>();
            CreateMap<PostDTO, Post>()
                .ForMember(opt => opt.Id, opt => opt.Ignore());

            CreateMap<Follower, FollowerDTO>();
            CreateMap<FollowerDTO, Follower>()
                .ForMember(opt => opt.id, opt => opt.Ignore());



        }
    }
}
