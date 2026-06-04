// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { ref } from 'vue';

export const useAsync = (initialPendingState = false) => {
  const pending = ref(initialPendingState);
  let pendingCount = 0;

  const run = async <R>(fn: () => Promise<R>): Promise<R> => {
    pendingCount += 1;
    pending.value = true;
    try {
      return await fn();
    } finally {
      pendingCount -= 1;
      pending.value = pendingCount > 0;
    }
  };

  return { pending, run };
};
