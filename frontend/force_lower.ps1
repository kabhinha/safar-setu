
$folders = @("admin", "auth", "buddychat", "commerce", "host", "hotspot", "kiosk", "mobile", "traveler")
cd "src\pages"
foreach ($folder in $folders) {
    # If lowercase exists, good. If Capital exists, rename.
    # On Windows Test-Path is case insensitive, so we check Get-ChildItem names
    $actual = Get-ChildItem . | Where-Object { $_.Name -eq $folder }
    if ($null -eq $actual) {
        # Check if CaseVariant exists
        $variant = Get-ChildItem . | Where-Object { $_.Name.ToLower() -eq $folder }
        if ($null -ne $variant) {
            Write-Host "Renaming $($variant.Name) to $folder..."
            Rename-Item -Path $variant.Name -NewName ($folder + "_temp")
            Rename-Item -Path ($folder + "_temp") -NewName $folder
        }
    }
}
