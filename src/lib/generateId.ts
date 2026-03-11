export async function generateExpenseId(): Promise<string> {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `EXP-${timestamp}${random}`;
}
