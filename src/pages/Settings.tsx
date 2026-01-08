import { motion } from "framer-motion";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BrandingSettings from "@/components/BrandingSettings";
import { Palette, Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("branding");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background p-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
            <SettingsIcon className="h-10 w-10" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your application settings and preferences
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <TabsTrigger value="branding" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Branding
              </TabsTrigger>
              {/* Add more tabs here as needed */}
            </TabsList>

            <TabsContent value="branding">
              <BrandingSettings />
            </TabsContent>

            {/* Add more tab content here as needed */}
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}
