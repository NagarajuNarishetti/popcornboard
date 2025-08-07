# Keycloak Setup Script for PopcornBoard

Write-Host "🔐 Setting up Keycloak for PopcornBoard..." -ForegroundColor Green

# Wait for Keycloak to be ready
Write-Host "Waiting for Keycloak to be ready..."
do {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/health/ready" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Keycloak is ready!" -ForegroundColor Green
            break
        }
    } catch {
        Write-Host "⏳ Keycloak is not ready yet. Waiting..." -ForegroundColor Yellow
        Start-Sleep 5
    }
} while ($true)

# Get admin token
Write-Host "Getting admin token..."
$tokenBody = "username=admin&password=admin&grant_type=password&client_id=admin-cli"
$tokenResponse = Invoke-RestMethod -Uri "http://localhost:8080/realms/master/protocol/openid-connect/token" -Method POST -Body $tokenBody -ContentType "application/x-www-form-urlencoded"

if ($tokenResponse.access_token) {
    Write-Host "✅ Admin token obtained successfully" -ForegroundColor Green
    $adminToken = $tokenResponse.access_token
} else {
    Write-Host "❌ Failed to get admin token" -ForegroundColor Red
    exit 1
}

# Import realm
Write-Host "Importing realm configuration..."
$realmConfig = Get-Content "keycloak-init/realm-export.json" -Raw
$headers = @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type" = "application/json"
}

try {
    $realmResponse = Invoke-RestMethod -Uri "http://localhost:8080/admin/realms" -Method POST -Headers $headers -Body $realmConfig
    Write-Host "✅ Realm imported successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Realm might already exist or there was an error: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Get client secret
Write-Host "Getting client secret..."
try {
    $clientsResponse = Invoke-RestMethod -Uri "http://localhost:8080/admin/realms/myrealm/clients" -Method GET -Headers $headers
    $nextjsClient = $clientsResponse | Where-Object { $_.clientId -eq "nextjs-client" }
    
    if ($nextjsClient) {
        $clientId = $nextjsClient.id
        $clientResponse = Invoke-RestMethod -Uri "http://localhost:8080/admin/realms/myrealm/clients/$clientId" -Method GET -Headers $headers
        $clientSecret = $clientResponse.secret
        
        Write-Host "✅ Client Secret: $clientSecret" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Please update your .env.local file with:" -ForegroundColor Cyan
        Write-Host "KEYCLOAK_CLIENT_SECRET=$clientSecret" -ForegroundColor White
        Write-Host ""
        Write-Host "🎉 Keycloak setup completed!" -ForegroundColor Green
    } else {
        Write-Host "❌ Client 'nextjs-client' not found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error getting client secret: $($_.Exception.Message)" -ForegroundColor Red
} 