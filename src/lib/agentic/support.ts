export async function runSupport(input: Record<string, any> = {}) {
  // POC support agent: triage a ticket and suggest a short reply.
  const title = String(input.title ?? "Support request");
  const body = String(input.body ?? "No details provided");

  // Very naive triage rules
  const isBilling = /bill|invoice|charge|payment/i.test(body + title);
  const isLogin = /login|sign in|password|authenticate/i.test(body + title);

  const priority = isBilling ? "high" : isLogin ? "medium" : "normal";

  const reply = isBilling
    ? "Thanks — I see this is a billing question. Please provide the invoice number and we’ll investigate immediately."
    : isLogin
    ? "Please try resetting your password using the 'Forgot password' link. If that fails, reply and we will escalate."
    : "Thanks for the report — can you share a screenshot and the steps to reproduce?";

  return {
    triage: { priority, category: isBilling ? "billing" : isLogin ? "auth" : "general" },
    suggestedReply: reply,
  };
}
