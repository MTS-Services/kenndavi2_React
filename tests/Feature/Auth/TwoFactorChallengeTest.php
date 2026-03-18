<?php

use App\Models\User;
use App\Models\UserOtpChallenge;
use App\Notifications\UserOtpCodeNotification;
use Inertia\Testing\AssertableInertia as Assert;
use Illuminate\Support\Facades\Notification;

test('signed user otp challenge page can be rendered', function () {
    Notification::fake();

    $email = fake()->safeEmail();

    $this->post(route('user.otp.request'), [
        'email' => $email,
    ])->assertRedirect();

    $user = User::where('email', $email)->firstOrFail();
    $challenge = UserOtpChallenge::where('user_id', $user->id)->firstOrFail();

    Notification::assertSentTo($user, UserOtpCodeNotification::class, function (UserOtpCodeNotification $notification) use ($user, $challenge) {
        expect($notification->challengeUrl)->toContain($challenge->challenge_token);
        expect($notification->verifyUrl)->toContain($challenge->challenge_token);

        $this->get($notification->challengeUrl)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('auth/two-factor-challenge')
                ->where('email', $user->email)
            );

        return true;
    });
});

test('tampered user otp challenge signatures are rejected', function () {
    Notification::fake();

    $email = fake()->safeEmail();

    $this->post(route('user.otp.request'), [
        'email' => $email,
    ])->assertRedirect();

    $user = User::where('email', $email)->firstOrFail();
    $challenge = UserOtpChallenge::where('user_id', $user->id)->firstOrFail();

    $notification = null;

    Notification::assertSentTo($user, UserOtpCodeNotification::class, function (UserOtpCodeNotification $sent) use (&$notification) {
        $notification = $sent;

        return true;
    });

    $tamperedUrl = str_replace($challenge->challenge_token, 'tampered-token', $notification->challengeUrl);

    $this->get($tamperedUrl)->assertForbidden();
});
