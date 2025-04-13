import React from "react";
import { Car, Ship, Utensils, Banknote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AssetCardProps {
  assetType: "car" | "speedboat" | "restaurant" | "cash";
  assetName: string;
  dropValue?: number | string;
  harianValue?: number | string;
  totalValue?: number | string;
  onClick?: () => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  assetType,
  assetName,
  dropValue,
  harianValue,
  totalValue,
  onClick,
}) => {
  const getIcon = () => {
    switch (assetType) {
      case "car":
        return <Car className="h-5 w-5 text-white opacity-80" />;
      case "speedboat":
        return <Ship className="h-5 w-5 text-white opacity-80" />;
      case "restaurant":
        return <Utensils className="h-5 w-5 text-white opacity-80" />;
      case "cash":
        return <Banknote className="h-5 w-5 text-white opacity-80" />;
      default:
        return <Car className="h-5 w-5 text-white opacity-80" />;
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
            <h3 className="text-white font-medium text-sm">{assetName}</h3>
          </div>
          {totalValue && (
            <span className="text-white font-bold text-sm">{totalValue}</span>
          )}
        </div>

        {(dropValue || harianValue) && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {dropValue && (
              <div className="bg-bjt-primary/20 rounded-md p-2">
                <p className="text-white/70 text-xs">Drop</p>
                <p className="text-white text-sm font-medium">{dropValue}</p>
              </div>
            )}
            {harianValue && (
              <div className="bg-bjt-primary/20 rounded-md p-2">
                <p className="text-white/70 text-xs">Harian</p>
                <p className="text-white text-sm font-medium">{harianValue}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
