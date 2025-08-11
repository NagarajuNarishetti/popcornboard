#!/bin/bash

# Wait for Keycloak to be ready
echo "Waiting for Keycloak to be ready..."
until curl -s http://keycloak:8080/health/ready; do
  echo "Keycloak is not ready yet. Waiting..."
  sleep 5
done

echo "Keycloak is ready!"

# Get admin token
echo "Getting admin token..."
ADMIN_TOKEN=$(curl -s -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin&grant_type=password&client_id=admin-cli" \
  http://keycloak:8080/realms/master/protocol/openid-connect/token | \
  jq -r '.access_token')

if [ "$ADMIN_TOKEN" = "null" ] || [ -z "$ADMIN_TOKEN" ]; then
  echo "Failed to get admin token"
  exit 1
fi

echo "Admin token obtained successfully"

# Import realm
echo "Importing realm configuration..."
curl -s -X POST \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/opt/keycloak/data/import/realm-export.json \
  http://keycloak:8080/admin/realms

echo "Realm imported successfully!"

# Get client secret
echo "Getting client secret..."
CLIENT_SECRET=$(curl -s -X GET \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://keycloak:8080/admin/realms/myrealm/clients | \
  jq -r '.[] | select(.clientId=="nextjs-client") | .id')

if [ "$CLIENT_SECRET" != "null" ] && [ -n "$CLIENT_SECRET" ]; then
  echo "Client ID: $CLIENT_SECRET"
  
  # Get client secret
  SECRET=$(curl -s -X GET \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    http://keycloak:8080/admin/realms/myrealm/clients/$CLIENT_SECRET | \
    jq -r '.secret')
  
  echo "Client Secret: $SECRET"
  echo "Please update your docker-compose.yml with this client secret"
else
  echo "Failed to get client information"
fi

echo "Keycloak setup completed!" 