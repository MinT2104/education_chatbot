interface ActivityItemProps {
  color: "green" | "blue" | "purple";
  title: string;
  description: string;
}

export const ActivityItem = ({
  color,
  title,
  description,
}: ActivityItemProps) => {
  const colorClasses = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
      <div className={`w-2 h-2 ${colorClasses[color]} rounded-full`}></div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

