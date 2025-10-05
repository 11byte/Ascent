# format-code.ps1
Write-Host "✨ Running Prettier on the project..."

# Define common ignores
$defaultIgnores = @(
    "node_modules",
    "dist",
    "build",
    ".next",
    "coverage",
    "*.json",  # package.json, tsconfig.json, etc.
    "*.lock",   # package-lock.json, yarn.lock, etc.
    ".git",
    ".vscode"
)

$ignoreFile = ".prettierignore"

# Create .prettierignore if not exists
if (-Not (Test-Path $ignoreFile)) {
    Write-Host "Creating new .prettierignore..."
    $defaultIgnores | Out-File -Encoding utf8 $ignoreFile
} else {
    Write-Host ".prettierignore already exists. Using it as-is."
}

# Run Prettier formatting
Write-Host "⚡ Formatting codebase (ignoring listed paths)..."
npx prettier . --write

Write-Host "✅ Codebase formatted successfully!"
