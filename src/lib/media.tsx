export type MediaAsset = {
  html_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  alt_text: string | null;
  width: number | null;
  height: number | null;
};

// 1. Create a reusable component at the top of your file (or in a separate components folder)
function MediaSlot({ 
  id, 
  mediaMap, 
  className = "" 
}: { 
  id: string; 
  mediaMap: Record<string, MediaAsset>; 
  className?: string;
}) {
  const asset = mediaMap[id];

  // Fallback while loading or if empty
  if (!asset) {
    return <div className={`animate-pulse bg-brand-border/20 ${className}`} />;
  }

  if (asset.media_type === 'video') {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        className={className}
        src={asset.media_url}
        width={asset.width || undefined}
        height={asset.height || undefined}
      />
    );
  }

  return (
    <img
      src={asset.media_url}
      alt={asset.alt_text || "Media Content"}
      className={className}
      width={asset.width || undefined}
      height={asset.height || undefined}
    />
  );
}

export default MediaSlot;