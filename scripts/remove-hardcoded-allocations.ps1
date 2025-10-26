$filePath = "C:\Users\forda\projectsocial\components\views\DashboardView.tsx"
$lines = Get-Content $filePath
$newLines = $lines[0..244] + $lines[790..($lines.Count-1)]
$newLines | Set-Content $filePath
Write-Host "Successfully removed lines 246-790 from DashboardView.tsx"
