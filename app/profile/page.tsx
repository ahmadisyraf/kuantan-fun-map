"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Profile() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Edit your profile here</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
