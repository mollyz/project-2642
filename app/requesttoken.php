<?php

$grant_type = $_POST['Grant_type'];
$code = $_POST['Code'];
$redirect_uri = $_POST['Redirect_uri'];
//$grant_type = "authorization_code";
//$code = "AQAX_5PXllOUxBNNO_nz0W1UFOhWP04LALu57EI_cDFxzMrHp4xm14vJ6CRA-vTrIvucKVYy3xnBOj7Z001xrBu1nC3iv-1FU_rFtmtsDqVR8DlHYnNUj-4zxkCE8zHBDjIHyrvDvfO6tQJx0tM4MnEWZt_J_Hdt44FinX7IEVkJd292iaUTNqgJEjSZvbddQhufvYfVWy5gWFvk04orpF9_2MtyAI_Hq81oHGfLMjPEi30IprN5f4Ksk7oQB9zgIasZjv-zzaGGmPKVSliCtlwQWff8MIAjYXzd4Sgb4LE";
//$redirect_uri = "http%3A%2F%2Flocalhost%2Fproject%2Fapp%2Findex.html%23%2Fsearch";
$client_key = "inserthere";
$client_secret = "inserthere";
$encoded = base64_encode($client_key.":".$client_secret);
$data = array('grant_type' => $grant_type, 'code' => $code, 'redirect_uri' => $redirect_uri);

$post = array('grant_type' => $grant_type, 'code' => $code, 'redirect_uri' => $redirect_uri);


$sURL = "https://accounts.spotify.com/api/token"; // The POST URL
$sPD = "grant_type=authorization_code&code=".$code."&redirect_uri=".$redirect_uri; // The POST Data
//echo $sPD;
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
//var_dump($contents);


/*$ch = curl_init('https://accounts.spotify.com/api/token');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post);

$response = curl_exec($ch);
curl_close($ch);

var_dump($response);*/
?>