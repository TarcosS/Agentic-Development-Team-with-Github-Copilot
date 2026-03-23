#!/usr/bin/env bash
# .github/hooks/scripts/pr-session-over.sh
# Copilot sessionEnd hook tarafından çağrılır.
# Görevi: mevcut branch'e ait açık PR'a "session-over" label'ı eklemek.
# Workflow tetikleyicisi bu label event'idir — draft→ready ve review ataması
# orada yapılır, burada değil (separation of concerns).
set -euo pipefail

BRANCH=$(git branch --show-current 2>/dev/null || echo "")
if [ -z "$BRANCH" ]; then
  echo "[hook] Could not determine current branch. Exiting."
  exit 0
fi

PR_NUMBER=$(gh pr list \
  --head "$BRANCH" \
  --state open \
  --json number \
  --jq '.[0].number' 2>/dev/null || echo "")

if [ -z "$PR_NUMBER" ] || [ "$PR_NUMBER" = "null" ]; then
  echo "[hook] No open PR found for branch '$BRANCH'. Exiting."
  exit 0
fi

echo "[hook] Adding 'session-over' label to PR #${PR_NUMBER}."
gh pr edit "$PR_NUMBER" --add-label "session-over"
echo "[hook] Done."
