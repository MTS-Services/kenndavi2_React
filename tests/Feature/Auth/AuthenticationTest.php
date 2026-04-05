<?php

use App\Mail\UserOtpCodeMail;
use App\Models\User;
use App\Models\UserOtpChallenge;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('auth/login')
    );
});

test('users can request a sign-in code and open the signed challenge page', function () {
    Mail::fake();

    $email = fake()->safeEmail();

    $this->post(route('user.otp.request'), [
        'email' => $email,
    ])->assertRedirect();

    $user = User::where('email', $email)->firstOrFail();
    $challenge = UserOtpChallenge::where('user_id', $user->id)->firstOrFail();

    Mail::assertSent(UserOtpCodeMail::class, function (UserOtpCodeMail $mail) use ($challenge, $user) {
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

test('users can authenticate using a valid sign-in code', function () {
    Mail::fake();

    $email = fake()->safeEmail();

    $this->post(route('user.otp.request'), [
        'email' => $email,
    ])->assertRedirect();

    $user = User::where('email', $email)->firstOrFail();

    $mailable = null;

    Mail::assertSent(UserOtpCodeMail::class, function (UserOtpCodeMail $sent) use (&$mailable) {
        $mailable = $sent;

        return true;
    });

    $this->post($mailable->verifyUrl, [
        'code' => $mailable->code,
    ])->assertRedirect(route('dashboard', absolute: false));

    $this->assertAuthenticatedAs($user);
});

test('users can request a fresh sign-in code from the signed challenge page', function () {
    Mail::fake();

    $email = fake()->safeEmail();

    $this->post(route('user.otp.request'), [
        'email' => $email,
    ])->assertRedirect();

    $user = User::where('email', $email)->firstOrFail();
    $challenge = UserOtpChallenge::where('user_id', $user->id)->firstOrFail();

    $resendUrl = URL::temporarySignedRoute('user.otp.resend', now()->addMinutes(10), [
        'challenge' => $challenge->challenge_token,
    ]);

    $this->post($resendUrl)
        ->assertRedirect();

    $freshChallenge = UserOtpChallenge::where('user_id', $user->id)->firstOrFail();

    expect($freshChallenge->challenge_token)->not()->toEqual($challenge->challenge_token);
});

test('users cannot authenticate with an invalid sign-in code', function () {
    Mail::fake();

    $email = fake()->safeEmail();

    $this->post(route('user.otp.request'), [
        'email' => $email,
    ])->assertRedirect();

    $user = User::where('email', $email)->firstOrFail();

    $mailable = null;

    Mail::assertSent(UserOtpCodeMail::class, function (UserOtpCodeMail $sent) use (&$mailable) {
        $mailable = $sent;

        return true;
    });

    $this->post($mailable->verifyUrl, [
        'code' => '000000',
    ])->assertSessionHasErrors('code');

    $this->assertGuest();
});
