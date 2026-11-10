[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

function Assert-Version([string]$Label, [string]$Actual, [string]$Expected) {
    if ($Actual.Trim() -ne $Expected) {
        throw "$Label expected $Expected but found $Actual"
    }
    Write-Host "$Label $Actual"
}

Assert-Version 'Node.js' ((& node --version) -replace '^v', '') '26.13.0'
Assert-Version 'Corepack' (& corepack --version) '0.36.0'
Assert-Version 'pnpm' (& corepack pnpm --version) '12.16.1'

Write-Host 'Host toolchain versions match the required development baseline.'
Write-Host 'Nuxt 4.6.4, TypeScript 6.0.3 and vue-tsc 3.3.14 are pinned in package.json.'
Write-Host 'Run corepack pnpm install and corepack pnpm typecheck to validate resolved dependencies.'
