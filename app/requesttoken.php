<?php

//Get POST-data
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$grant_type = $request->Grant_type;
$code = $request->Code;
$redirect_uri = $request->Redirect_uri;

//Api-keys provided by spotify
$client_key = "insert here";
$client_secret = "insert here";
$encoded = base64_encode($client_key.":".$client_secret);

$data = array('grant_type' => $grant_type, 'code' => $code, 'redirect_uri' => $redirect_uri);
$post = array('grant_type' => $grant_type, 'code' => $code, 'redirect_uri' => $redirect_uri);

$sURL = "https://accounts.spotify.com/api/token"; // The POST URL
$sPD = "grant_type=authorization_code&code=".$code."&redirect_uri=".$redirect_uri; // The POST Data

$aHTTP = array(
  'http' => // The wrapper to be used
    array(
    'method'  => 'POST', // Request Method
    // Request Headers Below
    'header'  => 'Authorization: Basic '.$encoded,
    'content' => $sPD
  )
);
$context = stream_context_create($aHTTP);
$contents = file_get_contents($sURL, false, $context);

echo $contents;

?>