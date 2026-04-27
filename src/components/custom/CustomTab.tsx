import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface CustomTabProps {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
}

export function CustomTab({ items, defaultValue, className }: CustomTabProps) {
  const [activeTab, setActiveTab] = React.useState(
    defaultValue || items[0].value
  );

  return (
    <TabsPrimitive.Root
      value={activeTab}
      onValueChange={setActiveTab}
      className={cn("w-full space-y-6", className)}
    >
      <TabsPrimitive.List className="inline-flex w-full p-1 bg-gray-100/50 dark:bg-gray-900 rounded-xl border border-gray-100">
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            className="relative flex-1 px-4 py-2.5 text-sm font-medium focus:outline-none"
          >
            <div
              className={cn(
                "relative z-20 transition-colors flex items-center justify-center gap-2",
                activeTab === item.value
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              {item.label}
            </div>

            {activeTab === item.value && (
              <motion.div
                layoutId="pill-bg"
                className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-md z-10"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.2 }}
          >
            <TabsPrimitive.Content value={activeTab} forceMount>
              {items.find((item) => item.value === activeTab)?.content}
            </TabsPrimitive.Content>
          </motion.div>
        </AnimatePresence>
      </div>
    </TabsPrimitive.Root>
  );
}
