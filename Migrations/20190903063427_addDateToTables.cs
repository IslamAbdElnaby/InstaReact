using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace InstaReact.Migrations
{
    public partial class addDateToTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "date",
                table: "posts",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "date",
                table: "comments",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "date",
                table: "commentLikes",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "date",
                table: "posts");

            migrationBuilder.DropColumn(
                name: "date",
                table: "comments");

            migrationBuilder.DropColumn(
                name: "date",
                table: "commentLikes");
        }
    }
}
