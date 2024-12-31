import { Button } from "@/components/ui/button";
import CourseGrid from "@/components/Course/CourseGrid";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function CoursesPage() {
  return (
    <div className="container py-8">
      {/* Search and Filters */}
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Explore Courses</h1>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">Filters</Button>
        </div>
      </div>

      {/* Course Grid */}
      <CourseGrid />
    </div>
  );
}