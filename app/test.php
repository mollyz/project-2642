<?php
$client_key = "7c6e405a8e084d6488c5bb0e892c52ba";
$client_secret = "65a0fdf3789f494194eb602b43f0f7e5";
$encode = $client_key.":".$client_secret;
$encoded = base64_encode($encode);

echo $encoded;
echo "Authorization: Basic ".$encoded;
?>