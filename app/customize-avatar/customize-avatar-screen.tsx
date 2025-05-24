"use client";

import {
  sexOptions,
  earSizeOptions,
  hairStyleOptions,
  hatStyleOptions,
  eyeStyleOptions,
  glassesStyleOptions,
  noseStyleOptions,
  mouthStyleOptions,
  shirtStyleOptions,
  eyeBrowStyleOptions,
} from "@/constants/avatar";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Avatar, {
  AvatarFullConfig,
  genConfig,
  Sex,
  EarSize,
  HairStyle,
  HatStyle,
  EyeStyle,
  GlassesStyle,
  NoseStyle,
  MouthStyle,
  ShirtStyle,
  EyeBrowStyle,
} from "react-nice-avatar";
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function CustomizeAvatarScreen() {
  const [config, setConfig] = useState<AvatarFullConfig | null>(null);
  const router = useRouter();

  const [sex, setSex] = useState<Sex>("man");
  const [earSize, setEarSize] = useState<EarSize>("small");
  const [hairStyle, setHairStyle] = useState<HairStyle>("normal");
  const [hatStyle, setHatStyle] = useState<HatStyle>("none");
  const [eyeStyle, setEyeStyle] = useState<EyeStyle>("circle");
  const [glassesStyle, setGlassesStyle] = useState<GlassesStyle>("none");
  const [noseStyle, setNoseStyle] = useState<NoseStyle>("short");
  const [mouthStyle, setMouthStyle] = useState<MouthStyle>("smile");
  const [shirtStyle, setShirtStyle] = useState<ShirtStyle>("hoody");
  const [eyeBrowStyle, setEyeBrowStyle] = useState<EyeBrowStyle>("up");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [hairColor, setHairColor] = useState("#000000");
  const [shirtColor, setShirtColor] = useState("#000000");
  const [faceColor, setFaceColor] = useState("#F8C9B6");
  const [hatColor, setHatColor] = useState("#F8C9B6");

  useEffect(() => {
    const newConfig = genConfig({
      sex,
      earSize,
      hairStyle,
      hatStyle,
      eyeStyle,
      glassesStyle,
      noseStyle,
      mouthStyle,
      shirtStyle,
      eyeBrowStyle,
      bgColor,
      hairColor,
      shirtColor,
      faceColor,
      hatColor,
    });
    setConfig(newConfig);
  }, [
    sex,
    earSize,
    hairStyle,
    hatStyle,
    eyeStyle,
    glassesStyle,
    noseStyle,
    mouthStyle,
    shirtStyle,
    eyeBrowStyle,
    bgColor,
    hairColor,
    shirtColor,
    faceColor,
    hatColor,
  ]);

  return (
    <div className="h-dvh pt-[env(safe-area-inset-top)] relative flex flex-col">
      {/* Header */}
      <div className="p-5 flex items-center gap-5">
        <button onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-medium">Customize your avatar</h1>
      </div>

      <div className="py-6 px-5 space-y-10">
        {/* Avatar Display */}
        <div className="flex justify-center">
          {config && (
            <Avatar
              style={{ width: "8rem", height: "8rem" }}
              {...config}
              className="border-[1.9px] border-black rounded-full"
            />
          )}
        </div>

        <Tabs defaultValue="sex" className="w-full overflow-x-auto">
          <TabsList className="flex flex-wrap gap-2">
            <TabsTrigger value="sex">Sex</TabsTrigger>
            <TabsTrigger value="earSize">Ear Size</TabsTrigger>
            <TabsTrigger value="hairStyle">Hair Style</TabsTrigger>
            <TabsTrigger value="hatStyle">Hat Style</TabsTrigger>
            <TabsTrigger value="eyeStyle">Eyes</TabsTrigger>
            <TabsTrigger value="glassesStyle">Glasses</TabsTrigger>
            <TabsTrigger value="noseStyle">Nose</TabsTrigger>
            <TabsTrigger value="mouthStyle">Mouth</TabsTrigger>
            <TabsTrigger value="eyeBrowStyle">Eyebrows</TabsTrigger>
            <TabsTrigger value="shirtStyle">Shirt</TabsTrigger>
            <TabsTrigger value="bgColor">Colors</TabsTrigger>
          </TabsList>

          {/* Sex */}
          <TabsContent value="sex">
            <h2 className="text-sm font-semibold mb-2">Sex</h2>
            <ButtonGroup
              value={sex}
              onValueChange={(val) => setSex(val as Sex)}
            >
              {sexOptions.map((v) => (
                <ButtonGroupItem key={v} value={v}>
                  {v}
                </ButtonGroupItem>
              ))}
            </ButtonGroup>
          </TabsContent>

          {/* Ear Size */}
          <TabsContent value="earSize">
            <h2 className="text-sm font-semibold mb-2">Ear Size</h2>
            <ButtonGroup
              value={earSize}
              onValueChange={(val) => setEarSize(val as EarSize)}
            >
              {earSizeOptions.map((v) => (
                <ButtonGroupItem key={v} value={v}>
                  {v}
                </ButtonGroupItem>
              ))}
            </ButtonGroup>
          </TabsContent>

          {/* Hair Style */}
          <TabsContent value="hairStyle">
            <h2 className="text-sm font-semibold mb-2">Hair Style</h2>
            <ButtonGroup
              value={hairStyle}
              onValueChange={(val) => setHairStyle(val as HairStyle)}
            >
              {hairStyleOptions.map((v) => (
                <ButtonGroupItem key={v} value={v}>
                  {v}
                </ButtonGroupItem>
              ))}
            </ButtonGroup>
            <h2 className="text-sm font-semibold mt-4 mb-2">Hair Color</h2>
            <input
              type="color"
              value={hairColor}
              onChange={(e) => setHairColor(e.target.value)}
              className="w-full h-10 p-1 border border-gray-300 rounded"
            />
          </TabsContent>

          {/* Hat Style */}
          <TabsContent value="hatStyle">
            <h2 className="text-sm font-semibold mb-2">Hat Style</h2>
            <ButtonGroup
              value={hatStyle}
              onValueChange={(val) => setHatStyle(val as HatStyle)}
            >
              {hatStyleOptions.map((v) => (
                <ButtonGroupItem key={v} value={v}>
                  {v}
                </ButtonGroupItem>
              ))}
            </ButtonGroup>
            <h2 className="text-sm font-semibold mt-4 mb-2">Hat Color</h2>
            <input
              type="color"
              value={hatColor}
              onChange={(e) => setHatColor(e.target.value)}
              className="w-full h-10 p-1 border border-gray-300 rounded"
            />
          </TabsContent>

          {/* Eyes */}
          <TabsContent value="eyeStyle">
            <h2 className="text-sm font-semibold mb-2">Eye Style</h2>
            <ButtonGroup
              value={eyeStyle}
              onValueChange={(val) => setEyeStyle(val as EyeStyle)}
            >
              {eyeStyleOptions.map((v) => (
                <ButtonGroupItem key={v} value={v}>
                  {v}
                </ButtonGroupItem>
              ))}
            </ButtonGroup>
          </TabsContent>

          {/* Glasses */}
          <TabsContent value="glassesStyle">
            <h2 className="text-sm font-semibold mb-2">Glasses Style</h2>
            <ButtonGroup
              value={glassesStyle}
              onValueChange={(val) => setGlassesStyle(val as GlassesStyle)}
            >
              {glassesStyleOptions.map((v) => (
                <ButtonGroupItem key={v} value={v}>
                  {v}
                </ButtonGroupItem>
              ))}
            </ButtonGroup>
          </TabsContent>

          {/* Nose */}
          <TabsContent value="noseStyle">
            <h2 className="text-sm font-semibold mb-2">Nose Style</h2>
            <ButtonGroup
              value={noseStyle}
              onValueChange={(val) => setNoseStyle(val as NoseStyle)}
            >
              {noseStyleOptions.map((v) => (
                <ButtonGroupItem key={v} value={v}>
                  {v}
                </ButtonGroupItem>
              ))}
            </ButtonGroup>
          </TabsContent>

          {/* Mouth */}
          <TabsContent value="mouthStyle">
            <h2 className="text-sm font-semibold mb-2">Mouth Style</h2>
            <ButtonGroup
              value={mouthStyle}
              onValueChange={(val) => setMouthStyle(val as MouthStyle)}
            >
              {mouthStyleOptions.map((v) => (
                <ButtonGroupItem key={v} value={v}>
                  {v}
                </ButtonGroupItem>
              ))}
            </ButtonGroup>
          </TabsContent>

          {/* Eyebrows */}
          <TabsContent value="eyeBrowStyle">
            <h2 className="text-sm font-semibold mb-2">Eyebrow Style</h2>
            <ButtonGroup
              value={eyeBrowStyle}
              onValueChange={(val) => setEyeBrowStyle(val as EyeBrowStyle)}
            >
              {eyeBrowStyleOptions.map((v) => (
                <ButtonGroupItem key={v} value={v}>
                  {v}
                </ButtonGroupItem>
              ))}
            </ButtonGroup>
          </TabsContent>

          {/* Shirt */}
          <TabsContent value="shirtStyle">
            <h2 className="text-sm font-semibold mb-2">Shirt Style</h2>
            <ButtonGroup
              value={shirtStyle}
              onValueChange={(val) => setShirtStyle(val as ShirtStyle)}
            >
              {shirtStyleOptions.map((v) => (
                <ButtonGroupItem key={v} value={v}>
                  {v}
                </ButtonGroupItem>
              ))}
            </ButtonGroup>
            <h2 className="text-sm font-semibold mt-4 mb-2">Shirt Color</h2>
            <input
              type="color"
              value={shirtColor}
              onChange={(e) => setShirtColor(e.target.value)}
              className="w-full h-10 p-1 border border-gray-300 rounded"
            />
          </TabsContent>

          {/* Background & Face Color */}
          <TabsContent value="bgColor">
            <h2 className="text-sm font-semibold mb-2">Background Color</h2>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-10 p-1 border border-gray-300 rounded"
            />
            <h2 className="text-sm font-semibold mt-4 mb-2">Face Color</h2>
            <input
              type="color"
              value={faceColor}
              onChange={(e) => setFaceColor(e.target.value)}
              className="w-full h-10 p-1 border border-gray-300 rounded"
            />
          </TabsContent>
        </Tabs>

        <Button className="w-full">Save</Button>
      </div>
    </div>
  );
}
