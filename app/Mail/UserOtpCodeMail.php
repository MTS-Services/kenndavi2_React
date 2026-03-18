<?php

namespace App\Mail;

use Carbon\CarbonInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Mailable that carries a user's one-time sign-in code.
 *
 * Kept as a plain Mailable (not ShouldQueue) — queuing is the Job's
 * responsibility. This class owns only what the email looks like.
 *
 * Preview in the browser during development:
 *   Route::get('/mail-preview/otp', fn () => new UserOtpCodeMail(
 *       code: '123456',
 *       challengeUrl: 'https://example.com',
 *       verifyUrl: 'https://example.com/verify',
 *       expiresAt: now()->addMinutes(2),
 *   ));
 */
class UserOtpCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $code,
        public readonly string $challengeUrl,
        public readonly string $verifyUrl,
        public readonly ?CarbonInterface $expiresAt,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your sign-in code',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.auth.otp-code',
            with: [
                'code'         => $this->code,
                'challengeUrl' => $this->challengeUrl,
                'verifyUrl'    => $this->verifyUrl,
                'expiresAt'    => $this->expiresAt,
                'expiryLabel'  => $this->expiresAt
                    ? $this->expiresAt->diffForHumans()
                    : 'shortly',
            ],
        );
    }
}
