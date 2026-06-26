'use client';

export async function shareOrCopyLink(shareData: ShareData): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch {
      // Some browsers expose navigator.share but reject it outside supported contexts.
    }
  }

  try {
    await navigator.clipboard.writeText(shareData.url ?? window.location.origin);
    return true;
  } catch (err) {
    console.error('Share failed', err);
    return false;
  }
}
