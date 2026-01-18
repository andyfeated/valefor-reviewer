#!/bin/bash

set -e

echo "Generating runtime config"

cat <<EOF >/usr/share/nginx/html/env-config.js
window.ENV = {
  VITE_BASE_API_URL: "${VITE_BASE_API_URL}",
  VITE_GITLAB_CLIENT_ID: "${VITE_GITLAB_CLIENT_ID}",
  VITE_GITLAB_OAUTH_URL: "${VITE_GITLAB_OAUTH_URL}",
  VITE_GITLAB_SCOPES: "${VITE_GITLAB_SCOPES}",
  VITE_CALLBACK_URL: "${VITE_CALLBACK_URL}"
}
EOF

echo "Runtime config generated"

exec "$@"
