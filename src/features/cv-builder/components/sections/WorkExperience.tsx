import { useEffect, useRef, useState } from "react";
import { Control, UseFormRegister, useFieldArray, useController, useWatch } from "react-hook-form";
import { Plus, GripVertical, Trash2, ChevronDown, Briefcase, X } from "lucide-react";
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

interface WorkExperienceProps {
    control: Control<ResumeData>;
    register: UseFormRegister<ResumeData>;
}

function parseBullets(raw: string): string[] {
    if (!raw || !raw.trim()) return [""];
    return raw.split("\n").map((s) => s.trim()).filter(Boolean);
}

function serializeBullets(bullets: string[]): string {
    return bullets.filter((b) => b.trim()).join("\n");
}

function HighlightsBulletEditor({
    control,
    index,
}: {
    control: Control<ResumeData>;
    index: number;
}) {
    const { field } = useController({
        control,
        name: `work.${index}.highlights`,
    });

    const [bullets, setBullets] = useState<string[]>(() => parseBullets(field.value));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        field.onChange(serializeBullets(bullets));
    }, [bullets, field]);

    const prevValue = useRef(field.value);
    useEffect(() => {
        if (field.value !== prevValue.current && field.value !== serializeBullets(bullets)) {
            setBullets(parseBullets(field.value));
        }
        prevValue.current = field.value;
    }, [field.value, bullets]);

    const updateBullet = (i: number, val: string) => {
        setBullets((prev) => {
            const next = [...prev];
            next[i] = val;
            return next;
        });
    };

    const addBullet = () => {
        setBullets((prev) => [...prev, ""]);
        setTimeout(() => {
            inputRefs.current[bullets.length]?.focus();
        }, 0);
    };

    const removeBullet = (i: number) => {
        setBullets((prev) => {
            const next = prev.filter((_, idx) => idx !== i);
            return next.length === 0 ? [""] : next;
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setBullets((prev) => {
                const next = [...prev];
                next.splice(i + 1, 0, "");
                return next;
            });
            setTimeout(() => {
                inputRefs.current[i + 1]?.focus();
            }, 0);
        } else if (e.key === "Backspace" && bullets[i] === "" && bullets.length > 1) {
            e.preventDefault();
            removeBullet(i);
            setTimeout(() => {
                inputRefs.current[Math.max(0, i - 1)]?.focus();
            }, 0);
        }
    };

    return (
        <div className="space-y-1.5">
            {bullets.map((bullet, i) => (
                <div key={i} className="flex items-center gap-1.5">
                     <span className="text-on-surface-variant/60 text-sm leading-none mt-px select-none">•</span>
                    <Input
                        ref={(el) => { inputRefs.current[i] = el; }}
                        value={bullet}
                        onChange={(e) => updateBullet(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        placeholder="Led the redesign of the core SaaS platform..."
                         className="flex-1 h-9 bg-transparent border-none focus-visible:ring-0 px-0 text-sm text-on-surface placeholder:text-on-surface-variant/60"
                    />
                    {bullets.length > 1 && (
                <button
                    type="button"
                    onClick={() => removeBullet(i)}
                    className="shrink-0 p-1.5 rounded-lg text-on-surface-variant/60 hover:text-error hover:bg-error/10 transition-colors"
                    aria-label="Remove bullet point"
                >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ))}
                <button
                    type="button"
                    onClick={addBullet}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 transition-colors py-1 px-2 rounded-lg hover:bg-accent/10"
                    aria-label="Add bullet point"
                >
                <Plus className="w-3.5 h-3.5" />
                Add Achievement
            </button>
        </div>
    );
}

function SortableWorkItem({
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
                    className="flex-1 flex items-center justify-between text-left focus:outline-none group"
                >
                    <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                            {useWatch({ control, name: `work.${index}.position` }) || `Experience ${index + 1}`}
                        </span>
                            <span className="text-label-sm text-on-surface-variant truncate">
                            {useWatch({ control, name: `work.${index}.company` }) || "New Position"}
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
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            {isOpen && (
                 <div className="px-6 pb-6 pt-2 border-t border-outline-variant/30 bg-surface-container-low">
                    <div className="grid gap-4 grid-cols-2">
                        <div className="col-span-2 sm:col-span-1 space-y-1.5">
                            <Label htmlFor={`work-${index}-company`} className="text-label-sm font-bold text-on-surface-variant uppercase tracking-tight">Company Name</Label>
                            <Input
                                id={`work-${index}-company`}
                                {...register(`work.${index}.company`)}
                                placeholder="TechSphere Inc"
                                className="bg-surface border-outline rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 h-10 px-3 placeholder:text-on-surface-variant"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1 space-y-1.5">
                            <Label htmlFor={`work-${index}-position`} className="text-label-sm font-bold text-on-surface-variant uppercase tracking-tight">Role / Position</Label>
                            <Input
                                id={`work-${index}-position`}
                                {...register(`work.${index}.position`)}
                                placeholder="Senior Product Designer"
                                className="bg-surface border-outline rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 h-10 px-3 placeholder:text-on-surface-variant"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1 space-y-1.5">
                            <Label htmlFor={`work-${index}-startDate`} className="text-label-sm font-bold text-on-surface-variant uppercase tracking-tight">
                                Start Date
                            </Label>
                            <Input
                                id={`work-${index}-startDate`}
                                {...register(`work.${index}.startDate`)}
                                placeholder="Jan 2021"
                                className="bg-surface border-outline rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 h-10 px-3 placeholder:text-on-surface-variant"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1 space-y-1.5">
                            <Label htmlFor={`work-${index}-endDate`} className="text-label-sm font-bold text-on-surface-variant uppercase tracking-tight">
                                End Date
                            </Label>
                            <Input
                                id={`work-${index}-endDate`}
                                {...register(`work.${index}.endDate`)}
                                placeholder="Present"
                                className="bg-surface border-outline rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 h-10 px-3 placeholder:text-on-surface-variant"
                            />
                        </div>
                         <div className="col-span-2 space-y-1.5">
                             <Label className="text-label-sm font-bold text-on-surface-variant uppercase tracking-tight">
                                 Key Achievements
                             </Label>
                             <div className="mt-1 bg-surface border border-outline rounded-lg px-4 py-3">
                                 <HighlightsBulletEditor control={control} index={index} />
                             </div>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function WorkExperience({ control, register }: WorkExperienceProps) {
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "work",
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
                        <Briefcase className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-on-surface">Experience</h2>
                        <p className="text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Professional History</p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 text-xs font-bold gap-1.5 text-accent hover:bg-accent/10 rounded-lg transition-colors border border-transparent hover:border-accent/20"
                    onClick={() =>
                        append({
                            company: "",
                            position: "",
                            startDate: "",
                            endDate: "",
                            highlights: "",
                        })
                    }
                >
                    <Plus className="w-4 h-4" />
                    Add Experience
                </Button>
            </div>

            <div className="p-6">
                {fields.length === 0 ? (
                <div className="text-center py-8 bg-surface-container-low rounded-xl border border-dashed border-outline">
                         <Briefcase className="w-8 h-8 text-on-surface-variant/30 mx-auto mb-2" />
                         <p className="text-sm font-medium text-on-surface-variant">
                             No work experience added yet.
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
                                    <SortableWorkItem
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
