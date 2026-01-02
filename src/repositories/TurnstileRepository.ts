import { type AppContext } from "../types";

export class TurnstileRepository {
    constructor(private secretKey: string) { }

    async verify(token: string, ip?: string): Promise<boolean> {
        const formData = new FormData();
        formData.append('secret', this.secretKey);
        formData.append('response', token);
        if (ip) {
            formData.append('remoteip', ip);
        }

        const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            body: formData,
            method: 'POST',
        });

        const outcome = await result.json() as { success: boolean };
        return outcome.success;
    }
}
