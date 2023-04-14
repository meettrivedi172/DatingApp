using System.Text;
using API.Data;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using API.Middleware;
using API.Services;
using API.SignalR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplictionServices(builder.Configuration);
// builder.Services.AddDbContext<DataContext>(opt =>
// {
//     opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
// });

// builder.Services.AddCors();
// builder.Services.AddScoped<ITokenService ,TokenService>();

//
builder.Services.AddIdentityServices(builder.Configuration);
// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
// .AddJwtBearer(option=>{
//     option.TokenValidationParameters = new TokenValidationParameters
//     {
//         ValidateIssuerSigningKey = true,
//         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["TokenKey"])),
//         ValidateIssuer =false,
//         ValidateAudience= false
//     };
// });

var app = builder.Build();


app.UseMiddleware<ExceptionMiddleware>();
// Configure the HTTP request pipeline.



app.UseCors(builder=>builder.AllowAnyHeader().AllowCredentials().AllowAnyMethod().WithOrigins("http://localhost:4200"));


app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapHub<PresenceHub>("hub/presence");
app.MapHub<MessageHub>("hub/message");
app.MapFallbackToController("Index" , "Fallback","text/HTML");


using var  scope =  app.Services.CreateScope();
var services =scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var  userManager= services.GetRequiredService<UserManager<AppUser>>();
    var  roleManager= services.GetRequiredService<RoleManager<AppRole>>();
    await  context.Database.MigrateAsync();
    await  context.Database.ExecuteSqlRawAsync("DELETE FROM [Connections]");
    await Seed.SeedUsers(userManager,roleManager);
}
catch (Exception  ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex,"An  error  occured during migration");
}

app.Run();
