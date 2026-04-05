<?php

namespace App\Jobs\Auth;

use App\Mail\UserOtpCodeMail;
use Carbon\CarbonInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Sends a one-time password email to a user asynchronously.
 *
 * Dispatching this job returns immediately — the HTTP response is sent back to
 * the browser before the mail driver even opens a connection. The queue worker
 * picks it up in the background within milliseconds.
 *
 * Queue: 'notifications' — keep mail separate from heavier jobs so a backlog
 * in one queue never delays authentication emails.
 *
 * Retry policy:
 *   - At most 3 attempts (see $tries); exponential back-off (3 s, 9 s).
 *   - Do not use retryUntil() here — Laravel defers the $tries cap while retryUntil
 *     is set, which caused unbounded retries until OTP expiry.
 *   - If the OTP is already expired when the job runs, handle() exits without sending.
 *
 * Usage:
 *   SendUserOtpMailJob::dispatch(
 *       toEmail: $user->email,
 *       toName: $user->name,
 *       code: '123456',
 *       challengeUrl: $challengeUrl,
 *       verifyUrl: $verifyUrl,
 *       expiresAt: $challenge->expires_at,
 *   );
 */
class SendUserOtpMailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * Seconds to wait between retry attempts (exponential: 3 s, 9 s).
     *
     * @var array<int, int>
     */
    public array $backoff = [3, 9];

    /**
     * Delete the job from the queue if the model no longer exists.
     * Not relevant here since we pass scalars, but good practice to keep.
     */
    public bool $deleteWhenMissingModels = true;

    public function __construct(
        private readonly string $toEmail,
        private readonly string $toName,
        private readonly string $code,
        private readonly string $challengeUrl,
        private readonly string $verifyUrl,
        private readonly ?CarbonInterface $expiresAt,
    ) {
        // Route this job to the dedicated 'notifications' queue via the trait's
        // onQueue() method — avoids the PHP 8.4 typed property conflict with
        // Illuminate\Bus\Queueable which declares $queue without a type hint.
        $this->onQueue('notifications');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if ($this->expiresAt !== null && $this->expiresAt->isPast()) {
            return;
        }

        $mailable = new UserOtpCodeMail(
            code: $this->code,
            challengeUrl: $this->challengeUrl,
            verifyUrl: $this->verifyUrl,
            expiresAt: $this->expiresAt,
        );

        Mail::to(new Address($this->toEmail, $this->toName))
            ->send($mailable);
    }

    /**
     * Handle a job failure.
     *
     * Called after all retry attempts are exhausted. Logs the failure for
     * observability; the failed_jobs record provides the full context.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('OTP email delivery failed permanently', [
            'to' => $this->toEmail,
            'exception' => $exception->getMessage(),
        ]);
    }
}
