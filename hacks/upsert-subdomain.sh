#!/usr/bin/env bash

name="${SUBDOMAIN}.${IPFS_DEPLOY_CLOUDFLARE__ZONE}"

if [[ $(curl -X GET "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records?type=CNAME&name=${name}" -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" -H "Content-Type:application/json" | jq '.result_info.total_count') -eq 0 ]]
then
  curl -X GET \
    "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type:application/json" \
    --data "{\"type\":\"CNAME\",\"name\":\"${name}\",\"content\":\"gateway.ipfs.io\",\"ttl\":1,\"priority\":0,\"proxied\":true}"
else
  echo -n "DNS record already exists."
fi
