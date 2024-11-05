import { NavbarRoutes } from "@/components/navbar-routes"
import { MobileSidebar } from "./mobile-sidebar"
import { cn } from "@/lib/utils"
import "./sidebar.css"

export const Navbar = ({
    isDark
}: {
    isDark: boolean
}) => {
    return(
        <div className={cn(
            "p-4 border-b h-[85.4px] flex items-center bg-white shadow-sm",
            isDark && "p-4 border-b h-[85.4px] flex items-center bg-blue-950 shadow-sm text-white"
        )}>
            <MobileSidebar isDark = {isDark}/>
            <NavbarRoutes/>
        </div>
    )
}