using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        

    Task<UserLikes>GetUserLike(int sourceUserId,int targetUserId);

    Task<AppUser>GetUserWithLike(int userId);

    Task<PageList<LikeDto>> GetUserLikes(LikeParams likeParams);
     
    }
}