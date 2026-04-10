import FileUpload from '@/components/file-upload';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';

interface ExistingFile {
    id: number | string;
    path: string;
    url: string;
    mime_type: string;
    name?: string;
}

interface BannerData {
    id: number;
    type: string;
    content: string | null;
    action_title: string | null;
    action_url: string | null;
    images: ExistingFile[];
}

interface EnumOption {
    value: string;
    label: string;
}

interface PageProps {
    banner?: BannerData | null;
    productTypes?: EnumOption[];
    activeType?: string;
    success?: string;
}

interface BannerFormData {
    type: string;
    content: string;
    action_title: string;
    action_url: string;
    images: File[] | null;
    remove_image_ids: number[];
}

export default function BannerContent({
    banner = null,
    productTypes = [],
    activeType = 'men',
}: PageProps) {
    const { success } = usePage().props as unknown as PageProps;
    const shownRef = useRef<string | undefined>(undefined);

    const { data, setData, post, processing, errors } = useForm<BannerFormData>({
        type: activeType,
        content: banner?.content ?? '',
        action_title: banner?.action_title ?? '',
        action_url: banner?.action_url ?? '',
        images: null,
        remove_image_ids: [],
    });

    useEffect(() => {
        setData({
            type: activeType,
            content: banner?.content ?? '',
            action_title: banner?.action_title ?? '',
            action_url: banner?.action_url ?? '',
            images: null,
            remove_image_ids: [],
        });
    }, [activeType, banner?.id, banner?.content, banner?.action_title, banner?.action_url, setData]);

    useEffect(() => {
        if (success && success !== shownRef.current) {
            shownRef.current = success;
            toast.success(success);
        }
    }, [success]);

    const existingFiles = useMemo(
        () =>
            (banner?.images ?? []).map((image) => ({
                ...image,
                name: image.name ?? undefined,
            }))
                .filter((image) => !data.remove_image_ids.includes(Number(image.id))),
        [banner?.images, data.remove_image_ids],
    );

    const handleTypeChange = (type: string) => {
        router.get(
            route('admin.banner-content.index'),
            { type },
            { preserveState: true, preserveScroll: true, only: ['banner', 'activeType'] },
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.banner-content.update'), {
            forceFormData: true,
            preserveState: false,
            preserveScroll: true,
            onSuccess: () => {
                // Clear transient upload/remove state so previews match server truth.
                setData('images', null);
                setData('remove_image_ids', []);
            },
            onError: () => {
                toast.error('Failed to update banner content. Please check the form.');
            },
        });
    };

    const removeImage = (id: number | string) => {
        const parsed = Number(id);
        if (Number.isNaN(parsed)) {
            return;
        }
        if (data.remove_image_ids.includes(parsed)) {
            return;
        }
        setData('remove_image_ids', [...data.remove_image_ids, parsed]);
    };

    return (
        <AdminLayout title="Banner Content" description="Manage hero slides and call-to-action content by product type.">
            <section className="rounded-lg border border-destructive p-4 font-sans shadow-sm md:p-8">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <Tabs value={activeType} onValueChange={handleTypeChange}>
                        <TabsList className="h-auto gap-0.5 bg-[#1103040A] p-2">
                            {productTypes.map((type) => (
                                <TabsTrigger
                                    key={type.value}
                                    value={type.value}
                                    className="cursor-pointer rounded-md px-5 font-alumni text-lg font-medium capitalize text-stone-600 transition-all duration-150 data-[state=active]:bg-red-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
                                >
                                    {type.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                <form onSubmit={handleSubmit}>
                    <FieldSet>
                        <FieldGroup>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="action_title">Action Title</FieldLabel>
                                    <Input
                                        id="action_title"
                                        name="action_title"
                                        value={data.action_title}
                                        onChange={(e) => setData('action_title', e.target.value)}
                                        placeholder="Shop Now"
                                        className="rounded-md border border-gray-300 p-2"
                                    />
                                    <InputError message={errors.action_title} />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="action_url">Action URL</FieldLabel>
                                    <Input
                                        id="action_url"
                                        name="action_url"
                                        value={data.action_url}
                                        onChange={(e) => setData('action_url', e.target.value)}
                                        placeholder="https://example.com/sweatsuitsmen"
                                        className="rounded-md border border-gray-300 p-2"
                                    />
                                    <InputError message={errors.action_url} />
                                </Field>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="content">Content</FieldLabel>
                                <Textarea
                                    id="content"
                                    name="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="Enter banner hero text"
                                    className="rounded-md border border-gray-300 p-2"
                                />
                                <InputError message={errors.content} />
                            </Field>

                            <Field>
                                <FileUpload
                                    value={data.images}
                                    onChange={(files) => {
                                        if (Array.isArray(files)) {
                                            setData('images', files);
                                            return;
                                        }

                                        if (files instanceof File) {
                                            setData('images', [files]);
                                            return;
                                        }

                                        setData('images', null);
                                    }}
                                    existingFiles={existingFiles}
                                    onRemoveExisting={removeImage}
                                    accept="image/*"
                                    maxSize={10}
                                    multiple={true}
                                    maxFiles={10}
                                    error={errors.images as unknown as string}
                                />
                            </Field>

                            <div className="pt-2">
                                <Button type="submit" disabled={processing} className="cursor-pointer bg-red-700 text-white hover:bg-red-800">
                                    {processing ? 'Saving...' : 'Save Banner Content'}
                                </Button>
                            </div>
                        </FieldGroup>
                    </FieldSet>
                </form>
            </section>
        </AdminLayout>
    );
}
