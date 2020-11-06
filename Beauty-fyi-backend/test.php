<?php

$ch = curl_init();
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer SS0TBwz4am4EmKDpX9JTzoHpQrbZLbkpLr9FgUHpuew8LO1vZf74Tn0vG7Q7"));
curl_setopt($ch, CURLOPT_URL,$url+"/api/register");
curl_setopt($ch, CURLOPT_POSTFIELDS,$post_fields);
curl_setopt($ch, CURLOPT_POST,1);
#curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
#curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
#curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
$response = curl_exec($ch); print_r($response); curl_close($ch);

?>
C:\Users\jxmyster\Documents\GitHub\Beauty-fyi\Beauty-fyi-backend\test.php
