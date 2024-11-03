import Image from "next/image";

export const Logo = () => {
    return (
        <Image
            className="w-full items-center"
            height={130}
            width={130}
            alt="logo"
            src="/logo.svg"
        />
    )
}