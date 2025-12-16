import { Link } from "react-router-dom";

interface HeaderProps {
  title: string;
  linkTitle: string;
  linkUrl: string;
  children?: React.ReactNode;
}
export default function Header({
  title,
  linkTitle,
  linkUrl,
  children,
}: HeaderProps) {
  return (
    <div className="bg-lilac py-3 px-12 flex items-center justify-between">
      <div>
        <Link
          to={linkUrl}
          className="font-normal text-sm text text-muted-foreground"
        >
          {linkTitle}
        </Link>

        <h1 className="text-2xl font-bold mt-1">{title}</h1>
      </div>
      {children}
    </div>
  );
}
