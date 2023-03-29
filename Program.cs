using System.Text;
using API.Data;
using API.Extensions;
using API.Interfaces;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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



app.UseCors(builder=>builder.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200"));


app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
