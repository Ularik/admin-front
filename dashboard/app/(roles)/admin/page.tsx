
import RushTasks from "@/components/tasks/RushTasks";
import TaskStatusCounters from "@/components/tasks/TaskStatusCounters";

export default function Page() {
    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">Панель администратора</h1>
                <p className="mt-1 text-sm text-zinc-500">Контроль срочных задач и документов</p>
            </div>
            <TaskStatusCounters />
            <RushTasks />
        </div>
    );
}