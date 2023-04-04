using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<AppUser> Users { get; set; }


         public DbSet<UserLikes> Likes { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);


            builder.Entity<UserLikes>().HasKey(k=>new {k.SourceUserId,k.TargetUserId});

            builder.Entity<UserLikes>().HasOne(s=>s.SourceUser)
            .WithMany(l=>l.LikedUsers)
            .HasForeignKey(s=>s.SourceUserId)
            .OnDelete(DeleteBehavior.Cascade);

             builder.Entity<UserLikes>().HasOne(s=>s.TargetUser)
             .WithMany(l=>l.LikedByUsers)
             .HasForeignKey(s=>s.TargetUserId)
             .OnDelete(DeleteBehavior.Cascade);
        }
    }
}