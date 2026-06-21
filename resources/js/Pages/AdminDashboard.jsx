import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Head, Link, usePage } from "@inertiajs/react";
import React from "react";
import { FiArrowRight, FiFileText, FiHome, FiSettings } from "react-icons/fi";

const AdminDashboard = () => {
    const { auth } = usePage().props;
    const user = auth?.user;

    const stats = [
        {
            label: "Home",
            value: "Manage",
            helper: "Update homepage content",
            icon: FiHome,
            color: "bg-blue-50 text-blue-700",
        },
        {
            label: "Blog",
            value: "Manage",
            helper: "Publish and update posts",
            icon: FiFileText,
            color: "bg-emerald-50 text-emerald-700",
        },
        {
            label: "Services",
            value: "Manage",
            helper: "Update services offered",
            icon: FiSettings,
            color: "bg-amber-50 text-amber-700",
        },
    ];

    const quickLinks = [
        { label: "Home", href: "/", icon: FiHome },
        { label: "Blog", href: "/blogs", icon: FiFileText },
        { label: "Services", href: "/services", icon: FiSettings },
    ];

    return (
        <AdminWrapper>
            <Head title="Admin Dashboard" />

            <div className="py-4 sm:py-6">
                <div className="mb-6 flex flex-col gap-2 px-4 sm:px-0 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-blue-700">
                            Admin Dashboard
                        </p>
                        <h1 className="mt-1 text-xl sm:text-2xl font-semibold text-gray-900">
                            Welcome back{user?.name ? `, ${user.name}` : ""}
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage your home, blog, and services content from
                            one place.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 px-4 sm:px-0 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.label}
                                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            {item.label}
                                        </p>
                                        <p className="mt-2 text-2xl font-semibold text-gray-900">
                                            {item.value}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.color}`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-gray-500">
                                    {item.helper}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 grid gap-6 px-4 sm:px-0 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">
                                    Quick Access
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Open the admin sections you use most often.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {quickLinks.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="group flex min-h-20 items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition group-hover:bg-white group-hover:text-blue-700">
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                {item.label}
                                            </span>
                                        </div>
                                        <FiArrowRight className="h-4 w-4 text-gray-400 transition group-hover:text-blue-700" />
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                    <aside className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold text-gray-900">
                            Account
                        </h2>
                        <div className="mt-4 space-y-3 text-sm">
                            <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                                <span className="text-gray-500">Name</span>
                                <span className="truncate font-medium text-gray-900">
                                    {user?.name || "Guest"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                                <span className="text-gray-500">Email</span>
                                <span className="truncate font-medium text-gray-900">
                                    {user?.email || "Not available"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-gray-500">Role</span>
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                                    {user?.role || "admin"}
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </AdminWrapper>
    );
};

export default AdminDashboard;
