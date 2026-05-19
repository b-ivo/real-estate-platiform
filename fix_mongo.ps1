$cfgPath = "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg"
$content = Get-Content $cfgPath

if ($content -notmatch "replSetName:") {
    $content = $content -replace "#replication:", "replication:`n  replSetName: `"rs0`""
    $content | Set-Content $cfgPath
    Write-Host "Added replication to mongod.cfg"
    Restart-Service -Name MongoDB
    Write-Host "MongoDB service restarted successfully."
    Start-Sleep -Seconds 3
} else {
    Write-Host "Replication is already configured in mongod.cfg."
}
