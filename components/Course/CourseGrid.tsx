import CourseCard from "./CourseCard";

const DEMO_COURSES = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    description: "Learn the basics of web development with HTML, CSS, and JavaScript. Perfect for beginners starting their coding journey.",
    instructor: "Sarah Johnson",
    duration: "12 weeks",
    enrolled: 1234,
    image: "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&auto=format&fit=crop&q=60",
    price: 49.99,
  },
  {
    id: "2",
    title: "Data Science Essentials",
    description: "Master the fundamentals of data science, including statistics, Python programming, and machine learning basics.",
    instructor: "Michael Chen",
    duration: "10 weeks",
    enrolled: 856,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
    price: 59.99,
  },
  {
    id: "3",
    title: "Digital Marketing Masterclass",
    description: "Comprehensive guide to digital marketing strategies, SEO, social media marketing, and analytics.",
    instructor: "Emily Rodriguez",
    duration: "8 weeks",
    enrolled: 2156,
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&auto=format&fit=crop&q=60",
    price: 39.99,
  },
];

export default function CourseGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {DEMO_COURSES.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
    </div>
  );
}