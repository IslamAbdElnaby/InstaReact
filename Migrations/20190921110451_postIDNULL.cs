using Microsoft.EntityFrameworkCore.Migrations;

namespace InstaReact.Migrations
{
    public partial class postIDNULL : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "postId",
                table: "notifications",
                nullable: true,
                oldClrType: typeof(int));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "postId",
                table: "notifications",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);
        }
    }
}
