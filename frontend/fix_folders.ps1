
$folders = @("admin", "auth", "buddychat", "commerce", "host", "hotspot", "kiosk", "mobile", "traveler")
$initials = @("Admin", "Auth", "BuddyChat", "Commerce", "Host", "Hotspot", "Kiosk", "Mobile", "Traveler")

cd "src\pages"

for ($i=0; $i -lt $folders.Length; $i++) {
    $lower = $folders[$i]
    $initial = $initials[$i]
    $temp = $initial + "_temp"
    
    # Check if $lower contains $temp
    if (Test-Path "$lower\$temp") {
        Write-Host "Fixing nested $lower\$temp..."
        # Move contents of $lower\$temp to $lower
        Get-ChildItem -Path "$lower\$temp" | Move-Item -Destination "$lower"
        # Remove empty $lower\$temp
        Remove-Item "$lower\$temp"
    } elseif (Test-Path "$initial\$temp") {
         # Case where folder might be capitalized
         Write-Host "Fixing nested $initial\$temp..."
         Get-ChildItem -Path "$initial\$temp" | Move-Item -Destination "$initial"
         Remove-Item "$initial\$temp"
    }
}
