#!/usr/bin/env bash
# Exit 0 = skip Vercel build, exit 1 = run build.
# Run from repo root OR from a Vercel Root Directory (sites/<name>):
#   bash scripts/should-build.sh sites/esg
#   bash ../../scripts/should-build.sh
#   bash ../../scripts/should-build.sh sites/esg
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "${REPO_ROOT}" ]; then
  echo "Not a git checkout — build."
  exit 1
fi

SITE_PATH="${1:-}"
if [ -z "${SITE_PATH}" ]; then
  PARENT="$(basename "$(dirname "${PWD}")")"
  NAME="$(basename "${PWD}")"
  if [ "${PARENT}" = "sites" ]; then
    SITE_PATH="sites/${NAME}"
  fi
fi

if [ -z "${SITE_PATH}" ]; then
  echo "Usage: bash scripts/should-build.sh sites/<folder>" >&2
  exit 1
fi

cd "${REPO_ROOT}"

if [ -z "${VERCEL_GIT_PREVIOUS_SHA:-}" ] || [ -z "${VERCEL_GIT_COMMIT_SHA:-}" ]; then
  exit 1
fi

if git diff --quiet "${VERCEL_GIT_PREVIOUS_SHA}" "${VERCEL_GIT_COMMIT_SHA}" -- "${SITE_PATH}" shared; then
  echo "No changes in ${SITE_PATH} or shared/ — skip build."
  exit 0
fi

echo "Changes detected — build."
exit 1