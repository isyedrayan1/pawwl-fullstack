'use client';

import React from 'react';
import { cn } from '@/lib/utils';

import { Skeleton } from '@/components/ui/skeleton';
import { useInView } from 'framer-motion';
import galleryAssetsPaths from '@/data/gallery-links.json';


export function ImageGallery() {
    const [loadedCount, setLoadedCount] = React.useState(0);
    const totalAssets = galleryAssetsPaths.length;
    const isReady = loadedCount >= Math.min(6, totalAssets);

    // Distribute assets into columns manually to ensure stability (1, 2, 3, 4 stay at the top)
    const columns: string[][] = [[], [], [], []];
    galleryAssetsPaths.forEach((src, index) => {
        columns[index % 4].push(src);
    });

	return (
		<div className="relative flex min-h-screen w-full flex-col items-center justify-center py-10 px-4 md:px-8">
            {!isReady && (
                <div className="w-full py-24 flex flex-col items-center justify-center bg-white gap-4 min-h-[60vh]">
                    <div className="w-12 h-12 border-4 border-[#134e86] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#134e86] font-medium animate-pulse">Gathering the Pack...</p>
                </div>
            )}

            {/* Stable Manual Masonry Layout */}
			<div className={cn(
                "mx-auto w-full max-w-6xl flex gap-4 sm:gap-6 pb-20 transition-opacity duration-1000",
                isReady ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden"
            )}>
				{columns.map((column, colIndex) => (
                    <div 
                        key={`column-${colIndex}`} 
                        className={cn(
                            "flex flex-col gap-4 sm:gap-6 flex-1",
                            // Hide 3rd and 4th columns on mobile, 4th on tablet
                            colIndex >= 2 && "hidden md:flex",
                            colIndex >= 3 && "hidden xl:flex"
                        )}
                    >
                        {column.map((src, index) => {
                            // Find original index for the alt text
                            const originalIndex = galleryAssetsPaths.indexOf(src);
                            return (
                                <AnimatedAsset
                                    key={`gallery-asset-${originalIndex}`}
                                    alt={`Pawwl Pack Moment ${originalIndex}`}
                                    src={src}
                                    onLoaded={() => setLoadedCount(prev => prev + 1)}
                                />
                            );
                        })}
                    </div>
                ))}
			</div>
		</div>
	);
}
interface AnimatedAssetProps {
	alt: string;
	src: string;
    onLoaded: () => void;
}

function AnimatedAsset({ alt, src, onLoaded }: AnimatedAssetProps) {
	const [isLoading, setIsLoading] = React.useState(true);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    
    // Check if the asset is in view to trigger playback/loading
    const isInView = useInView(containerRef, { once: false, margin: "200px" });
    const isVideo = src.match(/\.(mp4|webm)$/i);

    const handleLoadComplete = () => {
        setIsLoading(false);
        onLoaded();
    };

    // Effect to play/pause video based on visibility
    React.useEffect(() => {
        if (isVideo && videoRef.current) {
            if (isInView) {
                videoRef.current.play().catch(() => {});
            } else {
                videoRef.current.pause();
            }
        }
    }, [isInView, isVideo]);

	return (
		<div
            ref={containerRef}
			className={cn(
                "bg-[#f8fdff] relative rounded-[20px] border-2 border-[#c1e8fb] overflow-hidden group shadow-sm hover:shadow-xl transition-shadow",
            )}
		>
            {isLoading && (
                <div className="absolute inset-0 z-0">
                    <Skeleton className="w-full h-full bg-[#e8f7ff] animate-pulse" />
                </div>
            )}
            
            {isVideo ? (
                <video
                    ref={videoRef}
                    src={src}
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    onLoadedData={handleLoadComplete}
                    className={cn(
                        'w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-[1.05]',
                        isLoading ? 'opacity-0' : 'opacity-100'
                    )}
                />
            ) : (
                <img
                    alt={alt}
                    src={src}
                    className={cn(
                        'w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-[1.05]',
                        isLoading ? 'opacity-0' : 'opacity-100'
                    )}
                    onLoad={handleLoadComplete}
                    loading="lazy"
                />
            )}
        </div>
	);
}
