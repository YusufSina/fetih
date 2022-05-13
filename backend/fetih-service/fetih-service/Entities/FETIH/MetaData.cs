using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace fetih_service.Entities.FETIH
{
    public partial class MetaData
    {
        public MetaData()
        {
            Attributes = new HashSet<Attributes>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ExternalUrl { get; set; }
        public string Image { get; set; }

        public virtual ICollection<Attributes> Attributes { get; set; }
    }
}
