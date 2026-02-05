import Link from "next/link";

export default function ViewMore({ link }) {
  return (
    <div className="m-6 text-right">
      <Link
        href={link}
        className="text-gray-700 font-medium bg-gray-100 h-4 w-8 shadow-sm p-2 rounded-4xl hover:shadow-xl"
      >
        view more
      </Link>
    </div>
  );
}
