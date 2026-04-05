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
 * Local preview: GET /dev/mail/preview/otp (see routes/frontend.php).
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
        $with = [
            'code' => $this->code,
            'challengeUrl' => $this->challengeUrl,
            'verifyUrl' => $this->verifyUrl,
            'expiresAt' => $this->expiresAt,
            'expiryLabel' => $this->expiresAt
                ? $this->expiresAt->diffForHumans()
                : 'shortly',
        ];

        return new Content(
            view: 'emails.auth.otp-code',
            text: 'emails.auth.otp-code-text',
            with: $with,
        );
    }
}
