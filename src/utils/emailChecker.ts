import { isDisposableEmail } from "disposable-email-domains-js";

// Check if the email address is associated with a disposable domain name.
// Returns true if the email address belongs to a disposable/temporary domain.
// Used to prevent users from signing up with temporary emails.
export function rejectTempMail(email: string): boolean {
    return isDisposableEmail(email);
}