import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import AdminLayout from "@/layouts/admin-layout";
import { useForm } from "@inertiajs/react";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AnnouncementProps {
    announcement?: {
        id?: number;
        is_active?: boolean;
        announcement?: string;
    } | null; // Handle case where no announcement exists yet
}

export default function Announcement({ announcement }: AnnouncementProps) {
    // We use snake_case here to match the database/controller expectations
    const { data, setData, post, processing, errors } = useForm({
        is_active: announcement?.is_active ?? false,
        announcement: announcement?.announcement ?? "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure we have an ID to post to
        if (!announcement?.id) {
            toast.error("No announcement record found to update.");
            return;
        }

        // Using the 'post' method from useForm automatically tracks 'processing'
        post(route('admin.announcement.publish', { id: announcement.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Announcement published successfully");
            },
            onError: () => {
                toast.error("Failed to update. Please check the form.");
            },
        });
    };

    return (
        <AdminLayout 
            title="Announcement" 
            description="View, edit, and manage your announcement in one place."
        >
            <form 
                onSubmit={handleSubmit} 
                className="bg-[#1103040A] p-4 md:p-8 font-sans rounded-lg max-w-xl"
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold font-alumni">Announcement</h2>
                    <Switch
                        checked={data.is_active}
                        onCheckedChange={(checked) => setData('is_active', checked)}
                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300 cursor-pointer"
                    />
                </div>

                <div className="mt-4">
                    <Textarea
                        placeholder="Enter your announcement here..."
                        className={`border-[1.5px] rounded ${
                            errors.announcement ? 'border-red-500' : 'border-[#110304B8]'
                        }`}
                        value={data.announcement}
                        onChange={(e) => setData('announcement', e.target.value)}
                    />
                    {errors.announcement && (
                        <p className="text-red-500 text-xs mt-1">{errors.announcement}</p>
                    )}
                </div>

                <Button 
                    type="submit" 
                    disabled={processing} 
                    className="mt-4 w-full cursor-pointer"
                >
                    {processing ? (
                        <>
                            <Loader2Icon className="mr-2 size-4 animate-spin" />
                            Publishing...
                        </>
                    ) : (
                        "Publish Announcement"
                    )}
                </Button>
            </form>
        </AdminLayout>
    );
}