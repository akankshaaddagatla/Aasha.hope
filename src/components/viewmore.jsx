import Link from "next/link";

export default function ViewMore({ link }) {
  return (
    <div className="m-6 text-right">
      <Link
        href={link}
        className="text-gray-700 font-medium h-4 w-8 border-1 p-2 rounded-4xl"
      >
        view more
      </Link>
    </div>
  );
}
