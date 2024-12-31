import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";

const ENROLLED_COURSES = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    progress: 75,
    nextLesson: "JavaScript Basics",
    image: "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    title: "Data Science Essentials",
    progress: 30,
    nextLesson: "Introduction to Python",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
  },
];

export default function EnrolledCourses() {
  return (
    <div className="space-y-4">
      {ENROLLED_COURSES.map((course) => (
        <Card key={course.id} className="p-6">
          <div className="flex gap-6">
            <div
              className="h-24 w-40 rounded-lg bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${course.image})` }}
            />
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="font-semibold">{course.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Next: {course.nextLesson}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} />
              </div>
            </div>
            <div className="flex items-center">
              <Link href={`/courses/${course.id}/learn`}>
                <Button>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}

      <Link href="/courses">
        <Button variant="outline" className="w-full">
          <PlayCircle className="mr-2 h-4 w-4" />
          Browse More Courses
        </Button>
      </Link>
    </div>
  );
}