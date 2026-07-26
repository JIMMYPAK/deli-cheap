'use client';

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed';

export async function shareOrCopyLink(shareData: ShareData): Promise<ShareResult> {
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'cancelled';
      }
      // Some browsers expose navigator.share but reject it outside supported contexts.
    }
  }

  try {
    await navigator.clipboard.writeText(shareData.url ?? window.location.origin);
    return 'copied';
  } catch (err) {
    console.error('Share failed', err);
    return 'failed';
  }
}
