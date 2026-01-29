
$folders = @("admin", "auth", "buddychat", "commerce", "host", "hotspot", "kiosk", "mobile", "traveler")
$initials = @("Admin", "Auth", "BuddyChat", "Commerce", "Host", "Hotspot", "Kiosk", "Mobile", "Traveler")

cd "src\pages"

for ($i=0; $i -lt $folders.Length; $i++) {
    $lower = $folders[$i]
    $initial = $initials[$i]
    $temp = $initial + "_temp"
    
    if (Test-Path "$lower\$temp") {
        Write-Host "Merging $lower\$temp into $lower using Robocopy..."
        # Robocopy source dest /E (recursive) /MOVE (move files and dirs) /IS (include same files)
        robocopy "$lower\$temp" "$lower" /E /MOVE /IS
        # Robocopy exit codes: 0-7 are success/warnings. 
        if ($LASTEXITCODE -ge 8) { Write-Error "Robocopy failed for $lower" }
        
        # Remove empty temp dir if robocopy didn't (sometimes /MOVE leaves root)
        if (Test-Path "$lower\$temp") { Remove-Item "$lower\$temp" -Recurse -Force }
    }
}
