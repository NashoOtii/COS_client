public class StkPushRequest
{
    public string BusinessShortCode { get; set; } = "174379"; // Sandbox Shortcode
    public string Password { get; set; }
    public string Timestamp { get; set; }
    public string TransactionType { get; set; } = "CustomerPayBillOnline";
    public decimal Amount { get; set; }
    public long PartyA { get; set; } // Member Phone (2547...)
    public string PartyB { get; set; } = "174379";
    public long PhoneNumber { get; set; }
    public string CallBackURL { get; set; } // Must be HTTPS
    public string AccountReference { get; set; } // e.g., "Member_001"
    public string TransactionDesc { get; set; } = "Sacco Contribution";
}