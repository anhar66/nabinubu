import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputForm from "./InputForm";
import ReportsView from "./ReportsView";
import MonthlyExpenses from "./MonthlyExpenses";

interface AppTabsProps {
  className?: string;
}

const AppTabs: React.FC<AppTabsProps> = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState("input");

  return (
    <div className={`w-full ${className}`}>
      <Tabs
        defaultValue="input"
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <div className="border border-bjt-secondary/20 rounded-bjt overflow-hidden mb-6 shadow-premium">
          <TabsList className="w-full grid grid-cols-3 bg-gradient-to-r from-bjt-primary to-bjt-primaryLight p-0 h-auto">
            <TabsTrigger
              value="input"
              className="py-3 rounded-none data-[state=active]:bg-white data-[state=active]:text-bjt-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-bjt-secondary border-r border-bjt-secondary/20 text-white/80 hover:text-bjt-secondary transition-colors"
            >
              Input Data
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="py-3 rounded-none data-[state=active]:bg-white data-[state=active]:text-bjt-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-bjt-secondary border-r border-bjt-secondary/20 text-white/80 hover:text-bjt-secondary transition-colors"
            >
              Beban
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="py-3 rounded-none data-[state=active]:bg-white data-[state=active]:text-bjt-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-bjt-secondary text-white/80 hover:text-bjt-secondary transition-colors"
            >
              Laporan Keuangan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="p-6 border-t">
            <InputForm />
          </TabsContent>

          <TabsContent value="expenses" className="p-6 border-t">
            <MonthlyExpenses />
          </TabsContent>

          <TabsContent value="reports" className="p-6 border-t">
            <ReportsView />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AppTabs;
