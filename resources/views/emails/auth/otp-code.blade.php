<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Your sign-in code</title>

    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->

    <style>
        /* Reset */
        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }

        body,
        html {
            margin: 0;
            padding: 0;
            width: 100% !important;
        }

        body {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #f0f2f5;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        table {
            border-collapse: collapse;
            mso-table-lspace: 0;
            mso-table-rspace: 0;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        a {
            text-decoration: none;
        }

        /* Utilities */
        .wrapper {
            width: 100%;
            background-color: #f0f2f5;
            padding: 40px 16px;
        }

        .container {
            max-width: 560px;
            margin: 0 auto;
        }

        /* Header */
        .header {
            text-align: center;
            padding-bottom: 24px;
        }

        .header-logo {
            font-size: 22px;
            font-weight: 700;
            color: #111827;
            letter-spacing: -0.5px;
        }

        .header-logo span {
            color: #C0392B;
        }

        /* Card */
        .card {
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
        }

        /* Card top accent bar */
        .card-accent {
            height: 4px;
            background: linear-gradient(90deg, #C0392B 0%, #E74C3C 100%);
        }

        /* Card body */
        .card-body {
            padding: 40px 40px 32px;
        }

        /* Badge */
        .badge {
            display: inline-block;
            background-color: #FEF2F2;
            color: #C0392B;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            padding: 4px 10px;
            border-radius: 20px;
            margin-bottom: 20px;
        }

        /* Heading */
        .heading {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 8px;
            letter-spacing: -0.3px;
            line-height: 1.3;
        }

        .subtext {
            font-size: 15px;
            color: #6B7280;
            margin: 0 0 32px;
            line-height: 1.6;
        }

        /* OTP Box */
        .otp-wrapper {
            background: linear-gradient(135deg, #FEF2F2 0%, #FFF5F5 100%);
            border: 1.5px solid #FECACA;
            border-radius: 12px;
            padding: 28px 24px;
            text-align: center;
            margin-bottom: 28px;
        }

        .otp-label {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #9CA3AF;
            margin-bottom: 12px;
        }

        .otp-code {
            font-size: 44px;
            font-weight: 800;
            letter-spacing: 10px;
            color: #111827;
            font-variant-numeric: tabular-nums;
            line-height: 1;
            /* Slightly spread the digits visually */
            padding-left: 10px;
        }

        .otp-expiry {
            margin-top: 14px;
            font-size: 12px;
            color: #9CA3AF;
        }

        .otp-expiry strong {
            color: #C0392B;
        }

        /* CTA Button */
        .btn-wrapper {
            text-align: center;
            margin-bottom: 28px;
        }

        .btn {
            display: inline-block;
            background-color: #C0392B;
            color: #ffffff !important;
            font-size: 15px;
            font-weight: 600;
            padding: 14px 36px;
            border-radius: 8px;
            letter-spacing: 0.2px;
            mso-padding-alt: 0;
            text-decoration: none !important;
        }

        .btn:hover {
            background-color: #A93226;
        }

        /* Divider */
        .divider {
            border: none;
            border-top: 1px solid #F3F4F6;
            margin: 24px 0;
        }

        /* Fallback link */
        .fallback {
            font-size: 13px;
            color: #9CA3AF;
            text-align: center;
            line-height: 1.6;
        }

        .fallback a {
            color: #6B7280;
            word-break: break-all;
            text-decoration: underline;
        }

        /* Security notice */
        .notice {
            background-color: #F9FAFB;
            border-left: 3px solid #E5E7EB;
            border-radius: 0 8px 8px 0;
            padding: 14px 16px;
            margin-top: 24px;
        }

        .notice p {
            font-size: 13px;
            color: #9CA3AF;
            margin: 0;
            line-height: 1.6;
        }

        /* Footer */
        .footer {
            text-align: center;
            padding-top: 24px;
            padding-bottom: 8px;
        }

        .footer p {
            font-size: 12px;
            color: #9CA3AF;
            margin: 0 0 4px;
            line-height: 1.6;
        }

        .footer a {
            color: #9CA3AF;
            text-decoration: underline;
        }

        /* Mobile */
        @media only screen and (max-width: 600px) {
            .wrapper {
                padding: 24px 12px;
            }

            .card-body {
                padding: 28px 24px 24px;
            }

            .otp-code {
                font-size: 36px;
                letter-spacing: 7px;
            }

            .btn {
                padding: 13px 28px;
                font-size: 14px;
            }
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="container">

            {{-- Header --}}
            <div class="header">
                <div class="header-logo">Kenn<span>Davi</span></div>
            </div>

            {{-- Card --}}
            <div class="card">
                <div class="card-accent"></div>
                <div class="card-body">

                    <div class="badge">Sign-in request</div>

                    <h1 class="heading">Your sign-in code</h1>
                    <p class="subtext">
                        Use the code below to complete your sign-in.
                        Do not share this code with anyone.
                    </p>

                    {{-- OTP Block --}}
                    <div class="otp-wrapper">
                        <div class="otp-label">One-time code</div>
                        <div class="otp-code">{{ $code }}</div>
                        <div class="otp-expiry">
                            Expires <strong>{{ $expiryLabel }}</strong>
                        </div>
                    </div>

                    {{-- CTA Button --}}
                    <div class="btn-wrapper">
                        <a href="{{ $challengeUrl }}" class="btn" target="_blank">
                            Sign in now &rarr;
                        </a>
                    </div>

                    <hr class="divider" />

                    {{-- Fallback link --}}
                    <p class="fallback">
                        Button not working?<br />
                        Copy and paste this link into your browser:<br />
                        <a href="{{ $verifyUrl }}" target="_blank">{{ $verifyUrl }}</a>
                    </p>

                    {{-- Security notice --}}
                    <div class="notice">
                        <p>
                            🔒 If you did not request this code, you can safely ignore this email.
                            No changes have been made to your account.
                        </p>
                    </div>

                </div>
            </div>

            {{-- Footer --}}
            <div class="footer">
                <p>&copy; {{ date('Y') }} KennDavi. All rights reserved.</p>
                <p>This is an automated message — please do not reply.</p>
            </div>

        </div>
    </div>
</body>

</html>
