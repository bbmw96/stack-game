# PowerShell utility — system helpers
function Get-SizeLabel {
    param([long]$Bytes)
    switch ($Bytes) {
        {$_ -ge 1GB} { return '{0:N2} GB' -f ($_ / 1GB) }
        {$_ -ge 1MB} { return '{0:N2} MB' -f ($_ / 1MB) }
        {$_ -ge 1KB} { return '{0:N2} KB' -f ($_ / 1KB) }
        default       { return "$_ B" }
    }
}
