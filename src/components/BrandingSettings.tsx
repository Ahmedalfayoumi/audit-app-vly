import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function BrandingSettings() {
  const branding = useQuery(api.branding.getBranding);
  const updateColors = useMutation(api.branding.updateBrandingColors);
  const updateCompanyName = useMutation(api.branding.updateCompanyName);
  const generateLogoUploadUrl = useMutation(api.branding.generateLogoUploadUrl);
  const generateFaviconUploadUrl = useMutation(api.branding.generateFaviconUploadUrl);
  const updateLogoUrl = useMutation(api.branding.updateLogoUrl);
  const updateFaviconUrl = useMutation(api.branding.updateFaviconUrl);
  const getLogoUrl = useQuery(
    api.branding.getLogoUrl,
    branding?.logoUrl ? { storageId: branding.logoUrl } : "skip"
  );
  const getFaviconUrl = useQuery(
    api.branding.getFaviconUrl,
    branding?.faviconUrl ? { storageId: branding.faviconUrl } : "skip"
  );

  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState("#8b5cf6");
  const [textTheme, setTextTheme] = useState<"light" | "dark">("dark");
  const [companyName, setCompanyName] = useState("");
  const [isSavingColors, setIsSavingColors] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // Initialize state from branding data
  useEffect(() => {
    if (branding) {
      setPrimaryColor(branding.primaryColor);
      setSecondaryColor(branding.secondaryColor);
      setTextTheme(branding.textTheme);
      setCompanyName(branding.companyName || "");
    }
  }, [branding]);

  const handleSaveColors = async () => {
    setIsSavingColors(true);
    try {
      await updateColors({
        primaryColor,
        secondaryColor,
        textTheme,
      });
      toast.success("Brand colors updated successfully!");
    } catch (error) {
      toast.error("Failed to update brand colors");
      console.error(error);
    } finally {
      setIsSavingColors(false);
    }
  };

  const handleSaveCompanyName = async () => {
    if (!companyName.trim()) {
      toast.error("Company name cannot be empty");
      return;
    }
    setIsSavingName(true);
    try {
      await updateCompanyName({ companyName: companyName.trim() });
      toast.success("Company name updated successfully!");
    } catch (error) {
      toast.error("Failed to update company name");
      console.error(error);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploadingLogo(true);
    try {
      const uploadUrl = await generateLogoUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();
      await updateLogoUrl({ storageId });
      toast.success("Logo uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload logo");
      console.error(error);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploadingFavicon(true);
    try {
      const uploadUrl = await generateFaviconUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();
      await updateFaviconUrl({ storageId });
      toast.success("Favicon uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload favicon");
      console.error(error);
    } finally {
      setIsUploadingFavicon(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Name */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Company Name</CardTitle>
            <CardDescription>
              Set your company or organization name
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <Button onClick={handleSaveCompanyName} disabled={isSavingName}>
              {isSavingName ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Company Name"
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Colors & Theme */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Brand Colors & Theme</CardTitle>
            <CardDescription>
              Customize your brand colors and text theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-12 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-12 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    placeholder="#8b5cf6"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textTheme">Text Theme</Label>
              <Select value={textTheme} onValueChange={(value: "light" | "dark") => setTextTheme(value)}>
                <SelectTrigger id="textTheme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSaveColors} disabled={isSavingColors}>
              {isSavingColors ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Colors & Theme"
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Logo Upload */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Company Logo</CardTitle>
            <CardDescription>
              Upload your company logo (recommended: PNG or SVG, max 2MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {getLogoUrl && (
              <div className="flex justify-center p-4 border rounded-lg bg-muted/30">
                <img
                  src={getLogoUrl}
                  alt="Company Logo"
                  className="max-h-32 object-contain"
                />
              </div>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <Button
              onClick={() => logoInputRef.current?.click()}
              disabled={isUploadingLogo}
              variant="outline"
              className="w-full"
            >
              {isUploadingLogo ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Favicon Upload */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Favicon</CardTitle>
            <CardDescription>
              Upload your favicon (recommended: ICO or PNG, 32x32px or 64x64px)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {getFaviconUrl && (
              <div className="flex justify-center p-4 border rounded-lg bg-muted/30">
                <img
                  src={getFaviconUrl}
                  alt="Favicon"
                  className="h-16 w-16 object-contain"
                />
              </div>
            )}
            <input
              ref={faviconInputRef}
              type="file"
              accept="image/*"
              onChange={handleFaviconUpload}
              className="hidden"
            />
            <Button
              onClick={() => faviconInputRef.current?.click()}
              disabled={isUploadingFavicon}
              variant="outline"
              className="w-full"
            >
              {isUploadingFavicon ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Upload Favicon
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
