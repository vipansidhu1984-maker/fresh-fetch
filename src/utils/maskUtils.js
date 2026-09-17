/**
 * Privacy Protection: Mask phone numbers to protect buyer/customer identity from public or unauthorized exposure.
 * Example:
 *   "+919876543210" -> "+91 98••• ••210"
 *   "9876543210"    -> "98••• ••210"
 *   "98765"         -> "98•••"
 */
export function maskPhoneNumber(phone) {
  if (!phone) return '';
  const str = String(phone).trim();
  const digits = str.replace(/\D/g, '');

  if (digits.length >= 10) {
    const last10 = digits.slice(-10);
    const prefix = last10.slice(0, 2);
    const suffix = last10.slice(-3);
    return `+91 ${prefix}••• ••${suffix}`;
  }

  if (digits.length >= 6) {
    const prefix = digits.slice(0, 2);
    const suffix = digits.slice(-2);
    return `${prefix}••••${suffix}`;
  }

  return '••••••';
}
