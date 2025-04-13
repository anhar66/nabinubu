import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: string;
  type: "income" | "expense" | "balance";
  onClick?: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  type,
  onClick,
}) => {
  const getBgColor = () => {
    switch (type) {
      case "income":
        return "bg-[#10B981]";
      case "expense":
        return "bg-[#F4A1A1]";
      case "balance":
        return "bg-bjt-primary";
      default:
        return "bg-bjt-cardBg";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "balance":
        return "text-bjt-secondary";
      default:
        return "text-white";
    }
  };

  return (
    <Card
      className={`${getBgColor()} shadow-premium hover:shadow-premium-hover transition-shadow duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <h3 className="text-white text-sm font-medium mb-1">{title}</h3>
        <p className={`${getTextColor()} text-lg font-bold`}>{value}</p>
      </CardContent>
    </Card>
  );
};
