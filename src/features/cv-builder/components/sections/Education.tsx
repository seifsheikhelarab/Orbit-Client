import { useState } from "react";
import { Control, UseFormRegister, useFieldArray, useWatch } from "react-hook-form";
import { Plus, GripVertical, Trash2, ChevronDown, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResumeData } from "../../types";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface EducationProps {
    control: Control<ResumeData>;
    register: UseFormRegister<ResumeData>;
}

function SortableEducationItem({
    id,
    index,
    register,
    control,
    remove,
}: {
    id: string;
    index: number;
    register: UseFormRegister<ResumeData>;
    control: Control<ResumeData>;
    remove: (index: number) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`border border-outline rounded-xl bg-surface overflow-hidden transition-all ${isDragging ? "shadow-xl opacity-80 z-50" : "shadow-sm hover:border-primary/20"}`}
        >
            <div className="flex items-center gap-2 px-4 py-3">
                <div
                    {...attributes}
                    {...listeners}
                    className="flex items-center cursor-grab active:cursor-grabbing focus:outline-none rounded p-1 text-on-surface-variant/60 hover:text-on-surface-variant"
                    aria-label="Drag to reorder"
                >
                    <GripVertical className="w-4 h-4" />
                </div>
                <button
                    type="button"
                    onClick={() => setIsOpen((o) => !o)}
                    aria-expanded={isOpen}
                    aria-label={`${useWatch({ control, name: `education.${index}.studyType` }) || `Education ${index + 1}`} section, ${isOpen ? 'expanded' : 'collapsed'}`}
                    className="flex-1 flex items-center justify-between text-left focus:outline-none group"
                >
                    <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                            {useWatch({ control, name: `education.${index}.studyType` }) || `Education ${index + 1}`}
                        </span>
                            <span className="text-[10px] text-on-surface-variant truncate">
                            {useWatch({ control, name: `education.${index}.institution` }) || "New Institution"}
                        </span>
                    </div>
                    <ChevronDown
                         className={`w-4 h-4 text-on-surface-variant shrink-0 ml-2 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
                    />
                </button>
                <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => remove(index)}
                    className="shrink-0 w-8 h-8 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                    aria-label="Remove education entry"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            {isOpen && (
                 <div className="px-6 pb-6 pt-2 border-t border-outline-variant/30 bg-surface-container-low">
                    <div className="grid gap-4 grid-cols-2">
                        <div className="col-span-2 sm:col-span-1 space-y-1.5">
                            <Label htmlFor={`education-${index}-institution`} className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tight">Institution</Label>
                            <Input
                                id={`education-${index}-institution`}
                                {...register(`education.${index}.institution`)}
                                placeholder="University of Oxford"
                                className="bg-surface border-outline rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 h-10 px-3 placeholder:text-on-surface-variant"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1 space-y-1.5">
                            <Label htmlFor={`education-${index}-area`} className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tight">Field of Study</Label>
                            <Input
                                id={`education-${index}-area`}
                                {...register(`education.${index}.area`)}
                                placeholder="Computer Science"
                                className="bg-surface border-outline rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 h-10 px-3 placeholder:text-on-surface-variant"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1 space-y-1.5">
                            <Label htmlFor={`education-${index}-studyType`} className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tight">Degree / Type</Label>
                            <Input
                                id={`education-${index}-studyType`}
                                {...register(`education.${index}.studyType`)}
                                placeholder="Bachelor of Science"
                                className="bg-surface border-outline rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 h-10 px-3 placeholder:text-on-surface-variant"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1 space-y-1.5">
                            <Label htmlFor={`education-${index}-score`} className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tight">GPA / Score</Label>
                            <Input
                                id={`education-${index}-score`}
                                {...register(`education.${index}.score`)}
                                placeholder="3.9 GPA"
                                className="bg-surface border-outline rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 h-10 px-3 placeholder:text-on-surface-variant"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1 space-y-1.5">
                            <Label htmlFor={`education-${index}-startDate`} className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tight">
                                Start Date
                            </Label>
                            <Input
                                id={`education-${index}-startDate`}
                                {...register(`education.${index}.startDate`)}
                                placeholder="Sep 2018"
                                className="bg-surface border-outline rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 h-10 px-3 placeholder:text-on-surface-variant"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1 space-y-1.5">
                            <Label htmlFor={`education-${index}-endDate`} className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tight">
                                End Date
                            </Label>
                            <Input
                                id={`education-${index}-endDate`}
                                {...register(`education.${index}.endDate`)}
                                placeholder="Jun 2022"
                                className="bg-surface border-outline rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 h-10 px-3 placeholder:text-on-surface-variant"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function Education({ control, register }: EducationProps) {
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "education",
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex((f) => f.id === active.id);
            const newIndex = fields.findIndex((f) => f.id === over.id);
            move(oldIndex, newIndex);
        }
    };

    return (
        <div className="bg-surface rounded-xl border border-outline shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-low">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                        <GraduationCap className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-on-surface">Education</h2>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Academic Background</p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 text-xs font-bold gap-1.5 text-accent hover:bg-accent/10 rounded-lg transition-colors border border-transparent hover:border-accent/20"
                    onClick={() =>
                        append({
                            institution: "",
                            area: "",
                            studyType: "",
                            startDate: "",
                            endDate: "",
                            score: "",
                        })
                    }
                >
                    <Plus className="w-4 h-4" />
                    Add Education
                </Button>
            </div>

            <div className="p-6">
                {fields.length === 0 ? (
                <div className="text-center py-8 bg-surface-container-low rounded-xl border border-dashed border-outline">
                         <GraduationCap className="w-8 h-8 text-on-surface-variant/30 mx-auto mb-2" />
                         <p className="text-sm font-medium text-on-surface-variant">
                             No education entries added yet.
                         </p>
                     </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={fields.map((f) => f.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <SortableEducationItem
                                        key={field.id}
                                        id={field.id}
                                        index={index}
                                        register={register}
                                        control={control}
                                        remove={remove}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
}
