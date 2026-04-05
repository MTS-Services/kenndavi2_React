<?php

use App\Mail\UserOtpCodeMail;
use App\Models\User;
use App\Models\UserOtpChallenge;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

test('signed user otp challenge page can be rendered', function () {
    Mail::fake();

    $email = fake()->safeEmail();

    $this->post(route('user.otp.request'), [
        'email' => $email,
    ])->assertRedirect();

    $user = User::where('email', $email)->firstOrFail();
    $challenge = UserOtpChallenge::where('user_id', $user->id)->firstOrFail();

    Mail::assertSent(UserOtpCodeMail::class, function (UserOtpCodeMail $mail) use ($user, $challenge) {
        expect($mail->challengeUrl)->toContain($challenge->challenge_token);
        expect($mail->verifyUrl)->toContain($challenge->challenge_token);

        $this->get($mail->challengeUrl)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('auth/two-factor-challenge')
                ->where('email', $user->email)
            );

        return true;
    });
});

test('tampered user otp challenge signatures are rejected', function () {
    Mail::fake();

    $email = fake()->safeEmail();

    $this->post(route('user.otp.request'), [
        'email' => $email,
    ])->assertRedirect();

    $user = User::where('email', $email)->firstOrFail();
    $challenge = UserOtpChallenge::where('user_id', $user->id)->firstOrFail();

    $mailable = null;

    Mail::assertSent(UserOtpCodeMail::class, function (UserOtpCodeMail $sent) use (&$mailable) {
        $mailable = $sent;

        return true;
    });

    $tamperedUrl = str_replace($challenge->challenge_token, 'tampered-token', $mailable->challengeUrl);

    $this->get($tamperedUrl)->assertForbidden();
});
