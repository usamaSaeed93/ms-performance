"use client";

import { useState } from "react";
import {
    useCreateMailingJobMutation,
    useGetMailingJobsQuery,
    useGetMailingSubscriptionsQuery,
    useUploadMailingAttachmentMutation,
    MailingAttachmentUpload,
} from "@/lib/store/api/mailingApi";
import { toast } from "sonner";

export default function MailingPage() {
    const { data: subscribers, isLoading: subscribersLoading } = useGetMailingSubscriptionsQuery();
    const { data: jobs, isLoading: jobsLoading, refetch: refetchJobs } = useGetMailingJobsQuery();
    const [createJob, { isLoading: isCreating }] = useCreateMailingJobMutation();
    const [uploadAttachment, { isLoading: isUploading }] = useUploadMailingAttachmentMutation();

    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");
    const [attachments, setAttachments] = useState<MailingAttachmentUpload[]>([]);

    const handleCreateJob = async () => {
        if (!subject.trim() || !content.trim()) {
            toast.error("Please enter a subject and message");
            return;
        }

        try {
            await createJob({
                subject: subject.trim(),
                content: content.trim(),
                scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
                attachments: attachments.length > 0 ? attachments : undefined,
            }).unwrap();
            toast.success("Mailing job queued successfully");
            setSubject("");
            setContent("");
            setScheduledAt("");
            setAttachments([]);
            refetchJobs();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to queue mailing job");
        }
    };

    const handleAttachmentUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const uploads = Array.from(files);
        for (const file of uploads) {
            try {
                const uploaded = await uploadAttachment(file).unwrap();
                setAttachments((prev) => [...prev, uploaded]);
            } catch (error: any) {
                toast.error(error?.data?.message || `Failed to upload ${file.name}`);
            }
        }
    };

    const handleRemoveAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6 p-4">
            <div>
                <h1 className="text-2xl font-bold">Mailing</h1>
                <p className="text-sm text-muted-foreground">Send updates to your mailing subscribers.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                <div className="rounded-lg border bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Create Mailing Job</h2>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Email subject"
                            value={subject}
                            onChange={(event) => setSubject(event.target.value)}
                            className="w-full rounded-md border px-3 py-2 text-sm"
                        />
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Schedule (optional)</label>
                            <input
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(event) => setScheduledAt(event.target.value)}
                                className="w-full rounded-md border px-3 py-2 text-sm"
                            />
                        </div>
                        <textarea
                            placeholder="Write your message..."
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            rows={6}
                            className="w-full rounded-md border px-3 py-2 text-sm"
                        />
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Attachments</label>
                            <input
                                type="file"
                                multiple
                                onChange={(event) => handleAttachmentUpload(event.target.files)}
                                className="block w-full text-sm"
                            />
                            {isUploading && (
                                <p className="mt-2 text-xs text-muted-foreground">Uploading attachments...</p>
                            )}
                            {attachments.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {attachments.map((file, index) => (
                                        <div key={`${file.object_name}-${index}`} className="flex items-center justify-between rounded-md border px-3 py-2 text-xs">
                                            <span className="truncate">{file.filename}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAttachment(index)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleCreateJob}
                            disabled={isCreating || isUploading}
                            className="rounded-md bg-[#1d70ff] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isCreating ? "Sending..." : scheduledAt ? "Schedule Mailing" : "Send Mailing"}
                        </button>
                    </div>
                </div>

                <div className="rounded-lg border bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Subscribers</h2>
                    {subscribersLoading ? (
                        <p className="text-sm text-muted-foreground">Loading subscribers...</p>
                    ) : (
                        <div className="max-h-[360px] overflow-auto">
                            <table className="w-full text-sm">
                                <thead className="text-left text-muted-foreground">
                                    <tr>
                                        <th className="py-2">Name</th>
                                        <th className="py-2">Email</th>
                                        <th className="py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscribers && subscribers.length > 0 ? (
                                        subscribers.map((subscriber) => (
                                            <tr key={subscriber.id} className="border-t">
                                                <td className="py-2 font-medium">{subscriber.name}</td>
                                                <td className="py-2">{subscriber.email}</td>
                                                <td className="py-2">
                                                    <span className={`rounded-full px-2 py-0.5 text-xs ${subscriber.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                                        {subscriber.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="py-6 text-center text-muted-foreground">
                                                No subscribers yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-lg border bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Mailing Jobs</h2>
                {jobsLoading ? (
                    <p className="text-sm text-muted-foreground">Loading jobs...</p>
                ) : (
                    <div className="overflow-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-muted-foreground">
                                <tr>
                                    <th className="py-2">Subject</th>
                                    <th className="py-2">Status</th>
                                    <th className="py-2">Sent</th>
                                    <th className="py-2">Failed</th>
                                    <th className="py-2">Scheduled</th>
                                    <th className="py-2">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs && jobs.length > 0 ? (
                                    jobs.map((job) => (
                                        <tr key={job.id} className="border-t">
                                            <td className="py-2 font-medium">{job.subject}</td>
                                            <td className="py-2">
                                                <span className={`rounded-full px-2 py-0.5 text-xs ${job.status === "completed" ? "bg-green-100 text-green-700" : job.status === "failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="py-2">{job.sent_count}/{job.total_recipients}</td>
                                            <td className="py-2">{job.failed_count}</td>
                                            <td className="py-2">{job.scheduled_at ? new Date(job.scheduled_at).toLocaleString() : "-"}</td>
                                            <td className="py-2">{new Date(job.created_at).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-6 text-center text-muted-foreground">
                                            No mailing jobs yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
