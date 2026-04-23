<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ __('Redirecting to payment…') }}</title>
</head>
<body>
<form id="anet-relay-form" method="POST" action="{{ $postUrl }}">
    <input type="hidden" name="token" value="{{ $token }}">
    <noscript>
        <p>{{ __('Please click continue to pay.') }}</p>
        <button type="submit">{{ __('Continue') }}</button>
    </noscript>
</form>
<script>
    document.getElementById('anet-relay-form').submit();
</script>
</body>
</html>
