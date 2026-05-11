namespace SaccoApi.Models
{
    public enum CycleStatus { Active, Closing, Archived }
    public enum MemberRole { Member, Treasurer, Secretary, Chairperson }
    public enum MemberStatus { Active, Inactive }
    public enum ContributionStatus { Paid, Missed, Waived }
    public enum LoanStatus { Pending, Approved, Active, Repaid, Defaulted }
    public enum GuarantorStatus { Pending, Approved, Declined }
    public enum PenaltyType { LateContribution, LateLoanRepayment, MeetingAbsence, Other } 
    public enum AuditAction { Create, Update, Delete, Approve, Reject, Disburse, CloseCycle }
    public enum InvestmentStatus { Active, Completed, Cancelled } 
}