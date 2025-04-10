export default function InfoItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-gray-300">
      {icon}
      <span>{text}</span>
    </div>
  );
}
