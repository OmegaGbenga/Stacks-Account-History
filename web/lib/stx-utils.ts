export function abbreviateAddress(address: string) {
  return `${address.substring(0, 5)}...${address.substring(36)}`;
}

export function abbreviateTxnId(txnId: string) {
  return `${txnId.substring(0, 5)}...${txnId.substring(62)}`;
}

export function formatSTX(amount: number): string {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "0.00";
  }

  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}