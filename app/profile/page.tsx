"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import EnrolledCourses from "@/components/Profile/EnrolledCourses";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import Achievements from "@/components/Profile/Achievements";

export default function ProfilePage() {
  return (
    <div className="container py-8">
      <ProfileHeader />
      
      <Tabs defaultValue="courses" className="mt-8">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>
        <TabsContent value="courses" className="mt-6">
          <EnrolledCourses />
        </TabsContent>
        <TabsContent value="achievements" className="mt-6">
          <Achievements />
        </TabsContent>
        <TabsContent value="certificates" className="mt-6">
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              Complete courses to earn certificates
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}