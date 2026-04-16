'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Load local files automatically and dynamically via Vite
const localAssets = import.meta.glob('@/assets/gallery/*.{jpeg,jpg,png,webp,mp4,webm,gif}', { eager: true });
const galleryAssetsPaths = Object.values(localAssets).map((module: any) => module.default as string);

export function ImageGallery() {
	return (
		<div className="relative flex min-h-screen w-full flex-col items-center justify-center py-10 px-4 md:px-8">
            {/* True Masonry using CSS Columns - adapting to exact image sizes */}
			<div className="mx-auto w-full max-w-6xl columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6 pb-20">
				
                {galleryAssetsPaths.map((src, index) => {
                    return (
                        <AnimatedAsset
                            key={`gallery-asset-${index}`}
                            alt={`Pawwl Pack Moment ${index}`}
                            src={src}
                        />
                    );
                })}

			</div>
		</div>
	);
}

interface AnimatedAssetProps {
	alt: string;
	src: string;
}

function AnimatedAsset({ alt, src }: AnimatedAssetProps) {
	const [isLoading, setIsLoading] = React.useState(true);
    const isVideo = src.match(/\.(mp4|webm)$/i);

	return (
		<motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
			className="bg-[#f8fdff] relative rounded-[20px] border-2 border-[#c1e8fb] overflow-hidden group shadow-sm hover:shadow-xl transition-shadow break-inside-avoid"
		>
            {isVideo ? (
                <video
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedData={() => setIsLoading(false)}
                    className={cn(
                        'w-full h-auto object-cover transition-all duration-[1.5s] ease-out group-hover:scale-[1.05]',
                        isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                    )}
                />
            ) : (
                <img
                    alt={alt}
                    src={src}
                    className={cn(
                        'w-full h-auto object-cover transition-all duration-[1.5s] ease-out group-hover:scale-[1.05]',
                        isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                    )}
                    onLoad={() => setIsLoading(false)}
                    loading="lazy"
                />
            )}
		</motion.div>
	);
}
