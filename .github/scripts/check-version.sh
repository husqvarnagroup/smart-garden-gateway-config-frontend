#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 GARDENA GmbH
#
# SPDX-License-Identifier: GPL-3.0-or-later

# Compare package.json version against the previous commit.
# Sets GITHUB_OUTPUT: should_release=true|false, version=<new>.

set -euo pipefail

NEW=$(jq -r .version package.json)
OLD=$(git show HEAD~1:package.json | jq -r .version)
echo "new=$NEW old=$OLD"

if [ "$NEW" = "$OLD" ]; then
  echo "Version unchanged, skipping release"
  echo "should_release=false" >> "$GITHUB_OUTPUT"
  exit 0
fi

if git rev-parse --verify "refs/tags/v$NEW" >/dev/null 2>&1; then
  echo "Tag v$NEW already exists, skipping release"
  echo "should_release=false" >> "$GITHUB_OUTPUT"
  exit 0
fi

echo "should_release=true" >> "$GITHUB_OUTPUT"
echo "version=$NEW" >> "$GITHUB_OUTPUT"
