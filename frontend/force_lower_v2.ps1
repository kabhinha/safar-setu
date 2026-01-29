
$folders = @("admin", "auth", "buddychat", "commerce", "host", "hotspot", "kiosk", "mobile", "traveler")
cd "src\pages"
foreach ($folder in $folders) {
    Get-ChildItem . | Where-Object { $_.Name.ToLower() -eq $folder } | ForEach-Object {
        if ($_.Name -cne $folder) {
            Write-Host "Renaming $($_.Name) to $folder (via temp)..."
            Rename-Item -Path $_.Name -NewName ($folder + "_fixing")
            Rename-Item -Path ($folder + "_fixing") -NewName $folder
        }
    }
}
