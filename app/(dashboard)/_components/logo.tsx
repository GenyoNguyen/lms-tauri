import Image from "next/image";

export const Logo = ({ isDark }: { isDark: boolean }) => {
    return (
        <Image
            className="w-full items-center"
            height={80}
            width={80}
            alt="logo"
            src={isDark ? "/logo_dark_new.svg" : "/logo.svg"} // Logo dark mode
        />
    );
}
