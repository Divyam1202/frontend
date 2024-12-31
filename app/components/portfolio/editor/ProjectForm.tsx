"use client";

import { useForm } from "react-hook-form";
import { Project } from "@/app/types/portfolio";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: Partial<Project>) => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: project || {
      title: "",
      description: "",
      technologies: [],
      featured: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...register("title")} placeholder="Project Title" />
      </div>
      <div>
        <Textarea
          {...register("description")}
          placeholder="Project Description"
        />
      </div>
      <div>
        <Input
          {...register("technologies")}
          placeholder="Technologies (comma-separated)"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Project</Button>
      </div>
    </form>
  );
}