import { Head, Link, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import FrontendLayout from '@/layouts/frontend-layout';

export default function Settings() {
    const { post, processing } = useForm<{ action: 'logout_current' | 'logout_everywhere' }>({
        action: 'logout_current',
    });

    const submitAction = (action: 'logout_current' | 'logout_everywhere') => {
        post(route('user.settings.update'), {
            data: { action },
            preserveScroll: true,
        });
    };

    return (
        <FrontendLayout>
            <Head title="Settings" />
            <section className="py-8 md:py-12">
                <div className="container mx-auto max-w-3xl space-y-4 px-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Security Settings</h1>
                        <Button asChild variant="outline" size="sm">
                            <Link href={route('user.profile.index')}>Back to profile</Link>
                        </Button>
                    </div>

                    <div className="rounded-sm bg-(--bg-gray0) p-6 shadow-sm md:p-8">
                        <div className="space-y-6">
                            <div className="rounded-md border border-zinc-200 bg-white/40 p-4">
                                <p className="text-base font-medium">Sign out everywhere</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Sign out from all active sessions across all devices, including this one.
                                </p>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="mt-4">Sign Out Everywhere</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Sign out from every device?</DialogTitle>
                                            <DialogDescription>
                                                This will end all active sessions immediately.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button
                                                onClick={() => submitAction('logout_everywhere')}
                                                disabled={processing}
                                            >
                                                Confirm
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="rounded-md border border-zinc-200 bg-white/40 p-4">
                                <p className="text-base font-medium">Sign out</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    End your current session on this device.
                                </p>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="mt-4">
                                            Sign Out
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Sign out now?</DialogTitle>
                                            <DialogDescription>
                                                You will be redirected to the home page.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button
                                                onClick={() => submitAction('logout_current')}
                                                disabled={processing}
                                            >
                                                Confirm
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
