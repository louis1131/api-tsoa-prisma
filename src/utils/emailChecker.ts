import { isDisposableEmail } from "disposable-email-domains-js";

export function rejectTempMail(email: string): boolean {
    return isDisposableEmail(email);
}