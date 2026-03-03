interface AdminHeaderProps {
    title: string;
    description: string;
}

export function AdminHeader({ title, description }: AdminHeaderProps) {

    return (
        <header className="mb-8">
            <h2 className="text-2xl font-bold mb-1 text-sidebar font-[Alumni_Sans]">{title}</h2>
            <p className="text-gray-600">
                {description}
            </p>
        </header>
    );
}
