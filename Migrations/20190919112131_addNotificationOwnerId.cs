using Microsoft.EntityFrameworkCore.Migrations;

namespace InstaReact.Migrations
{
    public partial class addNotificationOwnerId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ownerUserId",
                table: "notifications",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ownerUserId",
                table: "notifications");
        }
    }
}
