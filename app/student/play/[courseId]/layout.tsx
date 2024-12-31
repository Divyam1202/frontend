// app/student/play/[courseId]/layout.tsx
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}