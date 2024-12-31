import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Clock, Users, Award } from "lucide-react";
import Image from "next/image";

const DEMO_COURSES = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    description:
      "Learn the basics of web development with HTML, CSS, and JavaScript. Perfect for beginners starting their coding journey.",
    instructor: "Sarah Johnson",
    duration: "12 weeks",
    enrolled: 1234,
    image:
      "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&auto=format&fit=crop&q=60",
    price: 49.99,
    curriculum: [
      "Introduction to HTML",
      "CSS Styling",
      "JavaScript Basics",
      "Responsive Design",
      "Web APIs",
      "Final Project",
    ],
  },
  // ... other courses
];

export default function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = DEMO_COURSES.find((c) => c.id === params.courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Course Info */}
        <div className="lg:col-span-2">
          <div className="aspect-video relative mb-6 overflow-hidden rounded-lg">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>
          <h1 className="mb-4 text-3xl font-bold">{course.title}</h1>
          <p className="mb-6 text-muted-foreground">{course.description}</p>

          <div className="mb-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>{course.enrolled.toLocaleString()} enrolled</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-muted-foreground" />
              <span>Certificate of completion</span>
            </div>
          </div>

          <h2 className="mb-4 text-xl font-semibold">Curriculum</h2>
          <ul className="space-y-2">
            {course.curriculum.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-2 rounded-lg border p-4"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Enrollment Card */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-lg border p-6">
            <div className="mb-4 text-center">
              <p className="text-3xl font-bold">${course.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">One-time payment</p>
            </div>
            <Button className="w-full">Enroll Now</Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
