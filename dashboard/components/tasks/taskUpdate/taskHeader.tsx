"use client";

import { useRouter } from "next/navigation";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Trash2, Loader2, Pencil, X, Check } from "lucide-react";

interface TaskHeaderProps {
  isEditing: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onEditToggle: (editing: boolean) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function TaskHeader({
  isEditing,
  isUpdating,
  isDeleting,
  onEditToggle,
  onCancel,
  onDelete,
}: TaskHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="text-zinc-600 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />К списку задач
      </Button>

      <div className="flex items-center gap-2">
        {!isEditing ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEditToggle(true)}
              className="text-zinc-700 border-zinc-300"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Редактировать
            </Button>

            <AlertDialog>
              <AlertDialogTrigger
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className:
                    "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700",
                })}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить задачу?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Задача будет безвозвратно
                    удалена из системы.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isDeleting && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isUpdating}
            >
              <X className="h-4 w-4 mr-2" />
              Отмена
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isUpdating}
              className="bg-zinc-900 text-white hover:bg-zinc-800"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Сохранить
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
