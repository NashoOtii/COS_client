using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SaccoApi.Migrations
{
    /// <inheritdoc />
    public partial class AddLoanFeePercentageToCycle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "LoanFeePercentage",
                table: "Cycles",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LoanFeePercentage",
                table: "Cycles");
        }
    }
}
