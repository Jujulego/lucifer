#!/usr/bin/env bash
# Run build
nx run $NX_APP:build --scan --prod

# Actions
if [ $NX_APP == "lucifer-front" ]; then
  cp -f "./apps/lucifer-front/static.json" .
fi
