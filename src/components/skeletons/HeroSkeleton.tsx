 import { Skeleton } from "@/components/ui/skeleton";
 
 export function HeroSkeleton() {
   return (
     <section className="min-h-screen flex items-center justify-center px-4">
       <div className="container mx-auto max-w-7xl">
         <div className="flex flex-col lg:flex-row items-center gap-12">
           {/* Text content skeleton */}
           <div className="flex-1 space-y-6 text-center lg:text-left">
             <Skeleton className="h-6 w-32 mx-auto lg:mx-0" />
             <Skeleton className="h-16 w-full max-w-xl" />
             <Skeleton className="h-12 w-full max-w-md" />
             <Skeleton className="h-24 w-full max-w-lg" />
             <div className="flex gap-4 justify-center lg:justify-start">
               <Skeleton className="h-12 w-32" />
               <Skeleton className="h-12 w-32" />
             </div>
           </div>
           {/* Avatar skeleton */}
           <div className="flex-shrink-0">
             <Skeleton className="w-64 h-64 lg:w-80 lg:h-80 rounded-full" />
           </div>
         </div>
       </div>
     </section>
   );
 }