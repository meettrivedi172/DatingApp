using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class PaginationParams
    {

        private const int MaxPageSize = 50;

        public int pageNumber {get;set;} =1;

        private int _pagesize =10;
      
        public int PageSize
        {
            get => _pagesize;

            set=> _pagesize =(value>MaxPageSize)?MaxPageSize:value; 
        }
        
        
    }
}