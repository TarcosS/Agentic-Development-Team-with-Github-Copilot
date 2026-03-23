#!/usr/bin/env bash
# .github/hooks/scripts/pr-session-over.sh
# Copilot sessionEnd hook tarafından çağrılır.
# Hook'un çalıştığını doğrulamak için stderr'e debug log basar.
set -euo pipefail

# ── Debug: stdin'den gelen JSON'u logla ──────────────────────────────────────
INPUT=$(cat)
echo "[hook:sessionEnd] fired. Input: $INPUT" >&2

# ── gh CLI auth kontrolü ─────────────────────────────────────────────────────
if ! gh auth status >/dev/null 2>&1; then
  echo "[hook:sessionEnd] ERROR: gh CLI is not authenticated. Exiting." >&2
  exit 1
fi

# ── Mevcut branch'i bul ──────────────────────────────────────────────────────
BRANCH=$(git branch --show-current 2>/dev/null || echo "")
if [ -z "$BRANCH" ]; then
  echo "[hook:sessionEnd] Could not determine current branch. Exiting." >&2
  exit 0
fi
echo "[hook:sessionEnd] Branch: $BRANCH" >&2

# ── PR numarasını bul ────────────────────────────────────────────────────────
PR_NUMBER=$(gh pr list \
  --head "$BRANCH" \
  --state open \
  --json number \
  --jq '.[0].number' 2>/dev/null || echo "")

# Some sessionEnd runs happen while local branch is "main".
# Fallback to PR number from hook payload when available.
if [ -z "$PR_NUMBER" ] || [ "$PR_NUMBER" = "null" ]; then
  INPUT_PR_NUMBER=""
  if command -v jq >/dev/null 2>&1; then
    INPUT_PR_NUMBER=$(printf '%s' "$INPUT" | jq -r '
      .pullRequest.number //
      .pull_request.number //
      .pullRequestNumber //
      .pull_request_number //
      empty
    ' 2>/dev/null || true)
  fi

  if [[ "$INPUT_PR_NUMBER" =~ ^[0-9]+$ ]]; then
    PR_NUMBER="$INPUT_PR_NUMBER"
    echo "[hook:sessionEnd] Using PR #${PR_NUMBER} from hook input payload." >&2
  fi
fi

if [ -z "$PR_NUMBER" ] || [ "$PR_NUMBER" = "null" ]; then
  echo "[hook:sessionEnd] No open PR found by branch/input. Exiting." >&2
  exit 0
fi
echo "[hook:sessionEnd] PR #${PR_NUMBER} selected." >&2

# Safety: only label PRs created by Copilot.
PR_AUTHOR_LOGIN=$(gh pr view "$PR_NUMBER" --json author --jq '.author.login' 2>/dev/null || echo "")
if [ "$PR_AUTHOR_LOGIN" != "app/copilot-swe-agent" ]; then
  echo "[hook:sessionEnd] PR #${PR_NUMBER} author is '$PR_AUTHOR_LOGIN' (not Copilot). Exiting." >&2
  exit 0
fi

# ── "session-over" label'ını ekle ────────────────────────────────────────────
# Label repo'da yoksa önce oluştur (ilk çalıştırmada gerekli).
gh label create "session-over" \
  --color "0075ca" \
  --description "Copilot session finished; ready for promotion" \
  --force 2>/dev/null || true

gh pr edit "$PR_NUMBER" --add-label "session-over"
echo "[hook:sessionEnd] 'session-over' label added to PR #${PR_NUMBER}." >&2
