import { Skeleton } from "@/components/ui/skeleton"

export const BlogListSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card overflow-hidden">
                    <Skeleton className="h-48 w-full rounded-t-2xl bg-emerald-500/5" />
                    <div className="p-6 space-y-4">
                        <div className="flex gap-2">
                            <Skeleton className="h-4 w-16 bg-emerald-500/10" />
                            <Skeleton className="h-4 w-16 bg-emerald-500/10" />
                        </div>
                        <Skeleton className="h-8 w-3/4 bg-emerald-500/10" />
                        <Skeleton className="h-20 w-full bg-emerald-500/5" />
                        <div className="flex justify-between items-center pt-4">
                            <Skeleton className="h-4 w-24 bg-emerald-500/10" />
                            <Skeleton className="h-4 w-12 bg-emerald-500/10" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export const BlogPostSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
            <div className="space-y-6 text-center">
                <Skeleton className="h-4 w-32 mx-auto bg-emerald-500/10" />
                <Skeleton className="h-16 w-3/4 mx-auto bg-emerald-500/10" />
                <div className="flex justify-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full bg-emerald-500/10" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24 bg-emerald-500/10" />
                        <Skeleton className="h-3 w-16 bg-emerald-500/5" />
                    </div>
                </div>
            </div>

            <Skeleton className="h-[400px] w-full rounded-3xl bg-emerald-500/5" />

            <div className="space-y-4">
                {[...Array(15)].map((_, i) => (
                    <Skeleton
                        key={i}
                        className={`h-4 bg-emerald-500/5 ${i % 5 === 0 ? 'w-full' :
                                i % 5 === 1 ? 'w-11/12' :
                                    i % 5 === 2 ? 'w-full' :
                                        i % 5 === 3 ? 'w-10/12' : 'w-3/4'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}
