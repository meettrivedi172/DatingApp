using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class UserParams
    {
        private const int MaxPageSize = 50;

        public int pageNumber {get;set;} =1;

        private int _pagesize =10;
      
        public int PageSize
        {
            get => _pagesize;

            set=> _pagesize =(value>MaxPageSize)?MaxPageSize:value; 
        }
        

        public string CurrentUsername { get; set; }

        public string  Gender { get; set; }


        public  int MinAge {get; set;} =18;

         public  int MaxAge {get; set;} =100;


         public string OrderBy { get; set; }="lastActive";
         
    }
}