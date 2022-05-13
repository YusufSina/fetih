using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace fetih_service.Entities.FETIH
{
    public partial class FetihDbContext : DbContext
    {
        public FetihDbContext()
        {
        }

        public FetihDbContext(DbContextOptions<FetihDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Attributes> Attributes { get; set; }
        public virtual DbSet<MetaData> MetaData { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("data source=fetih-live-db.mssql.somee.com;initial catalog=fetih-live-db;User Id=akupcuoglu_SQLLogin_3;Password=sd6onnksiw;MultipleActiveResultSets=True;App=EntityFramework");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Attributes>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.TraitType)
                    .IsRequired()
                    .HasColumnName("Trait_type")
                    .HasMaxLength(150);

                entity.HasOne(d => d.MetaData)
                    .WithMany(p => p.Attributes)
                    .HasForeignKey(d => d.MetaDataId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Attributes_Attributes");
            });

            modelBuilder.Entity<MetaData>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.ExternalUrl)
                    .IsRequired()
                    .HasColumnName("External_url")
                    .HasMaxLength(150);

                entity.Property(e => e.Image)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
