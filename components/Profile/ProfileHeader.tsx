import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";
import Link from "next/link";

export default function ProfileHeader() {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&q=70" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-muted-foreground">Web Development Student</p>
            <div className="mt-2 flex gap-4">
              <div>
                <p className="text-sm font-medium">Courses</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <div>
                <p className="text-sm font-medium">Hours</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </div>
        </div>
        <Link href="/profile/settings">
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}