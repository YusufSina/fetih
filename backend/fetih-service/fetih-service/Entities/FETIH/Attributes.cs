using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace fetih_service.Entities.FETIH
{
    public partial class Attributes
    {
        public int Id { get; set; }
        public int MetaDataId { get; set; }
        public string TraitType { get; set; }
        public int Value { get; set; }

        public virtual MetaData MetaData { get; set; }
    }
}
