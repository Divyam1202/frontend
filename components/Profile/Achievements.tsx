import { Card } from "@/components/ui/card";
import { Award, Flame, Star, Trophy } from "lucide-react";

const ACHIEVEMENTS = [
  {
    icon: Flame,
    title: "Fast Learner",
    description: "Complete 3 lessons in one day",
    progress: "2/3",
    color: "text-orange-500",
  },
  {
    icon: Star,
    title: "Perfect Score",
    description: "Get 100% on a quiz",
    progress: "Completed",
    color: "text-yellow-500",
  },
  {
    icon: Trophy,
    title: "Course Master",
    description: "Complete your first course",
    progress: "0/1",
    color: "text-blue-500",
  },
];

export default function Achievements() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {ACHIEVEMENTS.map((achievement, index) => (
        <Card key={index} className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className={`mb-4 rounded-full bg-primary/10 p-3 ${achievement.color}`}>
              <achievement.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-1 font-semibold">{achievement.title}</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {achievement.description}
            </p>
            <p className="text-sm font-medium">{achievement.progress}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}