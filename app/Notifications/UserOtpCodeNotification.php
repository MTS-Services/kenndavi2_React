<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Support\Carbon;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use DateTimeInterface;

class UserOtpCodeNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public readonly string $code,
        public readonly string $challengeUrl,
        public readonly string $verifyUrl,
        public readonly DateTimeInterface $expiresAt,
    ) {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $expiresAt = Carbon::instance($this->expiresAt);

        return (new MailMessage)
            ->subject('Your one-time sign-in code')
            ->greeting('Hello '.$notifiable->name.',')
            ->line('Use this one-time code to finish signing in:')
            ->line('Code: '.$this->code)
            ->line('This code expires at '.$expiresAt->toDateTimeString().'.')
            ->action('Open sign-in challenge', $this->challengeUrl)
            ->line('If you did not request this sign-in, you can safely ignore this message.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $expiresAt = Carbon::instance($this->expiresAt);

        return [
            'challenge_url' => $this->challengeUrl,
            'verify_url' => $this->verifyUrl,
            'expires_at' => $expiresAt->toIso8601String(),
        ];
    }
}
