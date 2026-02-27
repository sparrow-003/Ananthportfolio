 import { Skeleton } from "@/components/ui/skeleton";
 
 export function SectionSkeleton() {
   return (
     <section className="py-20 px-4">
       <div className="container mx-auto max-w-6xl">
         <div className="text-center mb-12">
           <Skeleton className="h-12 w-64 mx-auto mb-4" />
           <Skeleton className="h-6 w-96 mx-auto" />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[1, 2, 3].map((i) => (
             <Skeleton key={i} className="h-64 w-full rounded-2xl" />
           ))}
         </div>
       </div>
     </section>
   );
 }