import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Head, Link, usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { FiArrowRight, FiFileText, FiHome, FiSettings } from "react-icons/fi";

const AdminDashboard = () => {
    const { auth } = usePage().props;
    const user = auth?.user;

    // Time and greeting logic
    const [currentTime, setCurrentTime] = useState(new Date());
    
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        
        return () => clearInterval(timer);
    }, []);

    const hour = currentTime.getHours();
    const greeting =
        hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good night";
    const displayName =
        user?.name || user?.full_name || user?.first_name || "there";
    const formattedDate = currentTime.toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
    const formattedTime = currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

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
        { label: "Hero", href: "/heroes", icon: FiHome },
        { label: "Blog", href: "/blogs", icon: FiFileText },
        { label: "Services", href: "/services", icon: FiSettings },
    ];

    return (
        <AdminWrapper>
            <Head title="Admin Dashboard" />

            <div className="py-4 sm:py-6">
                {/* Greeting Banner */}
                <div className="mb-6 px-4 sm:px-0">
                    <div className="overflow-hidden rounded-2xl border border-blue-900/10 bg-white shadow-xl shadow-blue-900/10">
                        <div className="relative overflow-hidden bg-[#38b6ff] px-5 py-5 text-white sm:px-6 sm:py-6">
                           
                            
                           

                            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                <div className="max-w-2xl">
                                    <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-50 shadow-sm backdrop-blur">
                                        {formattedDate}
                                    </p>
                                    <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                                        {greeting}, {displayName}
                                    </h1>
                                    <p className="mt-2 max-w-xl text-sm leading-6 text-blue-50/90 sm:text-base">
                                        Audit, tax, and advisory. Built around your business.

Serving Nepal with a decade of independent practice, led by chartered accountants.
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/12 px-4 py-3 text-white shadow-xl shadow-blue-950/20 backdrop-blur-md sm:min-w-40">
                                        <div
                                            aria-hidden="true"
                                            className="absolute inset-x-0 top-0 h-1.5 bg-white/10"
                                        />
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-cyan-50 shadow-md shadow-blue-950/20 ring-1 ring-white/20">
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-blue-100">
                                                    Local time
                                                </p>
                                                <p className="mt-0.5 text-lg font-bold text-white">
                                                    {formattedTime}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
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

                {/* Quick Links & Account */}
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