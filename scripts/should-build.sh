#!/usr/bin/env bash
# Exit 0 = skip Vercel build, exit 1 = run build.
# Usage: bash scripts/should-build.sh sites/esg
set -euo pipefail

SITE_PATH="${1:?site path required, e.g. sites/esg}"

if [ -z "${VERCEL_GIT_PREVIOUS_SHA:-}" ] || [ -z "${VERCEL_GIT_COMMIT_SHA:-}" ]; then
  exit 1
fi

if git diff --quiet "${VERCEL_GIT_PREVIOUS_SHA}" "${VERCEL_GIT_COMMIT_SHA}" -- "${SITE_PATH}" shared; then
  echo "No changes in ${SITE_PATH} or shared — skip build."
  exit 0
fi

echo "Changes detected — build."
exit 1
