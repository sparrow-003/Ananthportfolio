import { Skeleton } from "@/components/ui/skeleton"

export const AdminStatsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="p-6 rounded-xl border border-border/50 bg-card/50">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-24 bg-primary/10" />
                        <Skeleton className="h-4 w-4 bg-primary/10" />
                    </div>
                    <div className="space-y-2 pt-2">
                        <Skeleton className="h-8 w-16 bg-primary/10" />
                        <Skeleton className="h-3 w-32 bg-primary/5" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export const AdminTableSkeleton = () => {
    return (
        <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
            <div className="p-4 border-b border-border/50 bg-muted/20">
                <div className="flex gap-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className={`h-4 bg-primary/10 ${i === 0 ? 'w-1/3' : 'w-24'}`} />
                    ))}
                </div>
            </div>
            <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-1/3 bg-primary/10" />
                            <Skeleton className="h-3 w-1/2 bg-primary/5" />
                        </div>
                        <Skeleton className="h-6 w-20 bg-primary/5" />
                        <Skeleton className="h-6 w-24 bg-primary/5" />
                        <Skeleton className="h-8 w-8 rounded-full bg-primary/5" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export const AdminDashboardSkeleton = () => {
    return (
        <div className="space-y-8 animate-pulse">
            <AdminStatsSkeleton />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-6 w-32 bg-primary/10" />
                    <AdminTableSkeleton />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-6 w-32 bg-primary/10" />
                    <div className="rounded-xl border border-border/50 bg-card/50 h-[400px] p-4 space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-2 border-b border-border/30 pb-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-24 bg-primary/10" />
                                    <Skeleton className="h-3 w-12 bg-primary/5" />
                                </div>
                                <Skeleton className="h-3 w-full bg-primary/5" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
