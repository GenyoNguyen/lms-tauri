"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import { invoke } from "@tauri-apps/api/core";

interface PriceFormProps {
    initialData: Course;
    courseId: string;
};

const formSchema = z.object({
    price: z.coerce.number(),
})

export const PriceForm = ({
    initialData,
    courseId
}: PriceFormProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const [price, setPrice] = useState(initialData?.price || undefined);

    const toggleEdit = () => setIsEditting((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price
        },
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(courseId);

        invoke("update_course", {
            courseId,
            updates: values
        }).then(() => {
            toast.success("Course updated");
            toggleEdit();
            setPrice(values.price);
        }).catch(err => toast.error(err));
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Price
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditting ? (
                        <>Cancel</>
                    ) : (
                        <>
                        <Pencil className="h-4 w-4 mr-2"/>
                        Edit price
                        </>
                    )}
                </Button>
            </div>
            {!isEditting && (
                <p className={cn(
                    "text-sm mt-2",
                    !price && "text-slate-500 italic"
                )}>
                    {price ? formatPrice(price) : "No price"}
                </p>
            )}
            {isEditting && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="10000"
                                            disabled={isSubmitting}
                                            placeholder="Set a price for your course"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}