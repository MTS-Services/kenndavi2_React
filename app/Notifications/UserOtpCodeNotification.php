<?php

namespace App\Notifications;

use Carbon\CarbonInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Dispatched to the queue so the HTTP response returns immediately.
 * The user is already on the challenge page before the email is delivered.
 */
class UserOtpCodeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Retry once if the mail driver blips; do not retry endlessly
     * because the OTP expires in 2 minutes anyway.
     */
    public int $tries = 2;
    public int $backoff = 3;

    public function __construct(
        private readonly string $code,
        private readonly string $challengeUrl,
        private readonly string $verifyUrl,
        private readonly ?CarbonInterface $expiresAt,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $expiry = $this->expiresAt
            ? 'This code expires at ' . $this->expiresAt->toTimeString() . ' (' . $this->expiresAt->diffForHumans() . ').'
            : 'This code expires shortly.';

        return (new MailMessage)
            ->subject('Your sign-in code')
            ->greeting('Hello!')
            ->line('Use the code below to complete your sign-in.')
            ->line('**' . $this->code . '**')
            ->line($expiry)
            ->action('Sign in now', $this->challengeUrl)
            ->line('If you did not request this code, you can safely ignore this email.');
    }
}
