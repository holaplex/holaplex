import React, { FC } from 'react';
import { TextSkeleton } from '../elements/Skeletons';

interface LoadingSearchItemProps {
    variant?: `square` | `circle`
}

const LoadingSearchItem: FC<LoadingSearchItemProps> = ({variant = `square`}) => {
    return (
        <div className={`p-4 flex flex-row items-center justify-between`}>
            <div className={`flex gap-6 flex-row items-center`}>
                <div className={`w-12 h-12 ${variant === `circle` ? `rounded-full` : `rounded-lg`} animate-pulse bg-gray-800`}/>
                <TextSkeleton/>
            </div>
            <div>
                <TextSkeleton width={36}/>
            </div>
        </div>
    )
}

export default LoadingSearchItem