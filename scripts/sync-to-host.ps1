param(
    [switch]$Watch
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$configPath = Join-Path $root "host-pc.json"
$config = Get-Content $configPath -Raw | ConvertFrom-Json
$dest = [string]$config.path

if (-not $dest) {
    Write-Output "HOST_PC_PATH_MISSING"
    Write-Output "Share the House Hub folder on the Mac, then put the UNC path in host-pc.json."
    Write-Output "Example: \\192.168.0.20\Users\esale\\Documents\\house-hub"
    exit 2
}

function Sync-Once {
    if (-not (Test-Path $dest)) {
        New-Item -ItemType Directory -Force -Path $dest | Out-Null
    }

    robocopy $root $dest /MIR /XD node_modules .git .cursor dist web\\dist firmware /XF *.log /NFL /NDL /NJH /NJS /NP
    $code = $LASTEXITCODE
    if ($code -ge 8) {
        Write-Output "SYNC_FAILED:$code"
        return $false
    }
    Write-Output "SYNCED:$dest"
    return $true
}

if (-not $Watch) {
    if (Sync-Once) { exit 0 }
    exit 1
}

Write-Output "Watching $root -> $dest"
[void](Sync-Once)
$watcher = New-Object System.IO.FileSystemWatcher $root, "*"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$script:pending = $false

$handler = {
    $path = $Event.SourceEventArgs.FullPath
    if ($path -match "\\node_modules\\|\\\.git\\|\\\.cursor\\|\\dist\\|\\.log$") { return }
    $script:pending = $true
}

Register-ObjectEvent $watcher Changed -Action $handler | Out-Null
Register-ObjectEvent $watcher Created -Action $handler | Out-Null
Register-ObjectEvent $watcher Deleted -Action $handler | Out-Null
Register-ObjectEvent $watcher Renamed -Action $handler | Out-Null

while ($true) {
    Start-Sleep -Seconds 2
    if ($script:pending) {
        $script:pending = $false
        Start-Sleep -Milliseconds 400
        [void](Sync-Once)
    }
}
