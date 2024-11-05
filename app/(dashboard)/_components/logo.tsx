import Image from "next/image";

export const Logo = ({ isDark }: { isDark: boolean }) => {
    return (
        <Image
            className="w-full items-center"
            height={130}
            width={130}
            alt="logo"
            src={isDark ? "/logo_dark.svg" : "/logo.svg"} // Logo dark mode
        />
    );
}
