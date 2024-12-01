"use client";

import queryString from "query-string";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconType } from "react-icons/lib";

interface CategoryItemProps {
    label: string;
    value?: string;
    icon?: IconType;
};

export const CategoryItem = ({
    label,
    value,
    icon: Icon,
}: CategoryItemProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");

    const isSelected = currentCategoryId === value;

    const onClick = () => {
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelected ? null : value
            }
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 hover:bg-sky-50 hover:text-sky-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500",
                isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
            )}
            type="button"
        >
            {Icon && <Icon size={20} className="transition-all duration-300 ease-in-out hover:text-sky-700" />}
            <div className="truncate">
                {label}
            </div>
        </button>
    )
}
