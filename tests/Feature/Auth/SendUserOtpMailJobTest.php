<?php

use App\Jobs\Auth\SendUserOtpMailJob;
use App\Mail\UserOtpCodeMail;
use Illuminate\Support\Facades\Mail;

test('send user otp mail job skips sending when otp already expired', function () {
    Mail::fake();

    $job = new SendUserOtpMailJob(
        toEmail: 'user@example.com',
        toName: 'User',
        code: '123456',
        challengeUrl: 'https://example.com/c',
        verifyUrl: 'https://example.com/v',
        expiresAt: now()->subMinute(),
    );

    $job->handle();

    Mail::assertNothingSent();
});

test('send user otp mail job sends mailable when otp still valid', function () {
    Mail::fake();

    $job = new SendUserOtpMailJob(
        toEmail: 'user@example.com',
        toName: 'User',
        code: '123456',
        challengeUrl: 'https://example.com/c',
        verifyUrl: 'https://example.com/v',
        expiresAt: now()->addMinute(),
    );

    $job->handle();

    Mail::assertSent(UserOtpCodeMail::class, function (UserOtpCodeMail $mail) {
        expect($mail->code)->toBe('123456');

        return true;
    });
});
