using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser,AppRole,int,IdentityUserClaim<int>,AppUserRole,IdentityUserLogin<int>,IdentityRoleClaim<int>,IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }


         public DbSet<UserLikes> Likes { get; set; }

          public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

             builder.Entity<AppUser>()
             .HasMany(ur=>ur.UserRoles)
             .WithOne(u=>u.User)
             .HasForeignKey(ur=>ur.UserId)
             .IsRequired();
            
            
             builder.Entity<AppRole>()
             .HasMany(ur=>ur.UserRoles)
             .WithOne(u=>u.Role)
             .HasForeignKey(ur=>ur.RoleId)
             .IsRequired();




            builder.Entity<UserLikes>().HasKey(k=>new {k.SourceUserId,k.TargetUserId});

            builder.Entity<UserLikes>().HasOne(s=>s.SourceUser)
            .WithMany(l=>l.LikedUsers)
            .HasForeignKey(s=>s.SourceUserId)
            .OnDelete(DeleteBehavior.Cascade);

             builder.Entity<UserLikes>().HasOne(s=>s.TargetUser)
             .WithMany(l=>l.LikedByUsers)
             .HasForeignKey(s=>s.TargetUserId)
             .OnDelete(DeleteBehavior.Cascade);



              builder.Entity<Message>()
              .HasOne(s=>s.Recipient)
             .WithMany(l=>l.MessageRecevied)
             .OnDelete(DeleteBehavior.Restrict);
             
              builder.Entity<Message>()
              .HasOne(s=>s.Sender)
             .WithMany(l=>l.MessageSent)
             .OnDelete(DeleteBehavior.Restrict);
        }
    }
}