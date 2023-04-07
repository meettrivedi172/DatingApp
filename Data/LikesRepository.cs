using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;

        public LikesRepository(DataContext  context)
        {
            _context = context;
        }
        public async Task<UserLikes> GetUserLike(int sourceUserId, int targetUserId)
        {
            return await _context.UserLikes.FindAsync(sourceUserId,targetUserId);
        }

        public async Task<PageList<LikeDto>> GetUserLikes(LikeParams likesParams)
        {
            var users=_context.Users.OrderBy(u=>u.UserName).AsQueryable();
            var likes =_context.UserLikes.AsQueryable();

            if(likesParams.Predicate=="liked"){
                likes= likes.Where(like=>like.SourceUserId==likesParams.UserId);
                users= likes.Select(like=>like.TargetUser);

            }

               if(likesParams.Predicate=="likedBy"){
                likes= likes.Where(like=>like.TargetUserId==likesParams.UserId);
                users= likes.Select(like=>like.SourceUser);
                
            }

          var  likedUsers =  users.Select(user=>new LikeDto{
                UserName = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalcuateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(x=>x.IsMain).Url,
                City= user.City,
                Id = user.Id
            });

            return await  PageList<LikeDto>.CreateAsync(likedUsers,likesParams.pageNumber,likesParams.PageSize);
        }

        public async Task<AppUser> GetUserWithLike(int userId)
        {
            return  await _context.Users
            .Include(x=>x.LikedUsers)
            .FirstOrDefaultAsync(x=>x.Id  == userId);
        }
    }
}