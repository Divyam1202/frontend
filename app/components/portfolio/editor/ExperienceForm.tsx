"use client";

import { useForm } from "react-hook-form";
import { Portfolio } from "@/app/types/portfolio";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Experience = {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

interface ExperienceFormProps {
  experience?: Experience;
  onSubmit: (data: Partial<Experience>) => void;
  onCancel: () => void;
}

export function ExperienceForm({
  experience,
  onSubmit,
  onCancel,
}: ExperienceFormProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: experience || {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...register("title")} placeholder="Job Title" />
      </div>
      <div>
        <Input {...register("company")} placeholder="Company" />
      </div>
      <div>
        <Input {...register("location")} placeholder="Location" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          {...register("startDate")}
          type="date"
          placeholder="Start Date"
        />
        <Input
          {...register("endDate")}
          type="date"
          placeholder="End Date"
        />
      </div>
      <div>
        <Textarea
          {...register("description")}
          placeholder="Job Description"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Experience</Button>
      </div>
    </form>
  );
}
