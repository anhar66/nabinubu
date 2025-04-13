import React from "react";
import { Banknote, Lightbulb, Droplets, Wifi } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ExpenseCardProps {
  expenseType:
    | "salary"
    | "nightGuard"
    | "electricity"
    | "water"
    | "internet"
    | "operational";
  expenseName: string;
  value: number | string;
  onClick?: () => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expenseType,
  expenseName,
  value,
  onClick,
}) => {
  const getIcon = () => {
    switch (expenseType) {
      case "salary":
      case "nightGuard":
        return <Banknote className="h-5 w-5 text-white opacity-80" />;
      case "electricity":
        return <Lightbulb className="h-5 w-5 text-white opacity-80" />;
      case "water":
        return <Droplets className="h-5 w-5 text-white opacity-80" />;
      case "internet":
        return <Wifi className="h-5 w-5 text-white opacity-80" />;
      case "operational":
        return <Banknote className="h-5 w-5 text-white opacity-80" />;
      default:
        return <Banknote className="h-5 w-5 text-white opacity-80" />;
    }
  };

  return (
    <Card
      className="bg-bjt-cardBg shadow-premium hover:shadow-premium-hover transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-bjt-primary/30 p-2 rounded-full">
              {getIcon()}
            </div>
            <h3 className="text-white font-medium text-sm">{expenseName}</h3>
          </div>
          <span className="text-white font-bold text-sm">{value}</span>
        </div>
      </CardContent>
    </Card>
  );
};
