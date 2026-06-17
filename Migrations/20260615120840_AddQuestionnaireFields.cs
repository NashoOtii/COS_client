using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SaccoApi.Migrations
{
    /// <inheritdoc />
    public partial class AddQuestionnaireFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Contribution",
                table: "Members",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FinancialGoal",
                table: "Members",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Motivation",
                table: "Members",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ValueAlignment",
                table: "Members",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WeeklyCommitment",
                table: "Members",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Contribution",
                table: "Members");

            migrationBuilder.DropColumn(
                name: "FinancialGoal",
                table: "Members");

            migrationBuilder.DropColumn(
                name: "Motivation",
                table: "Members");

            migrationBuilder.DropColumn(
                name: "ValueAlignment",
                table: "Members");

            migrationBuilder.DropColumn(
                name: "WeeklyCommitment",
                table: "Members");
        }
    }
}
