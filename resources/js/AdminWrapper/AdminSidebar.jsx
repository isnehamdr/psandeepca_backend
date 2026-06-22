import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { FiFileText, FiGrid, FiHome, FiMenu, FiSettings, FiUsers, FiX } from "react-icons/fi";

const AdminSideBar = ({
    isMobileOpen,
    onMobileToggle,
    isCollapsed,
    onToggleCollapse,
}) => {
    const { url } = usePage();
    const isActive = (href) => {
        return url === href || url.startsWith(href + "/");
    };

    const menuItems = [
        // { label: "Dashboard", href: route("admin.dashboard"), icon: FiGrid },
        { label: "Home", href: "/", icon: FiHome },
        { label: "Blog", href: "/blogs", icon: FiFileText },
        { label: "Services", href: "/services", icon: FiSettings },
        { label: "Users", href: "/users", icon: FiUsers },
    ];

    // Common link styles
    const linkBaseClasses =
        "flex items-center rounded-lg transition-colors duration-200 group relative";
    const linkCollapsedClasses = isCollapsed ? "p-3 justify-center" : "p-3";
    const linkActiveClasses = (href) =>
        isActive(href)
            ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
            : "text-gray-600 hover:bg-blue-50 hover:text-blue-700";

    // Icon style function
    const iconClasses = (isItemActive, customClass = "w-5 h-5") => `
        ${isCollapsed ? customClass : customClass}
        ${isItemActive ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}
    `;

    // Tooltip for collapsed state
    const Tooltip = ({ children }) => (
        <div
            className="fixed left-12 ml-6 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
            style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                color: "#374151",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
        >
            {children}
        </div>
    );

    return (
        <>
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onMobileToggle}
                />
            )}

            <div
                className={`
                    fixed left-0 top-0 h-screen border-r z-50 transition-all duration-300
                    ${isCollapsed ? "w-16" : "w-64"}
                    ${
                        isMobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }
                `}
                style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                }}
            >
                {/* Content Container */}
                <div className="relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div
                        className={`flex items-center justify-between p-4 border-b h-16 ${
                            isCollapsed ? "px-3" : ""
                        }`}
                        style={{ borderColor: "#e5e7eb" }}
                    >
                        {!isCollapsed && (
                            <Link
                                href="/"
                                className="text-xl font-bold text-gray-800 whitespace-nowrap"
                            >
                                <img
                                    src="/images/logo.jpg"
                                    alt="Logo"
                                    className="h-10 w-auto"
                                />
                            </Link>
                        )}
                        <div className="flex items-center space-x-1">
                            {/* Collapse Toggle Button - Only show on desktop */}
                            <button
                                onClick={onToggleCollapse}
                                className="hidden lg:flex p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title={
                                    isCollapsed
                                        ? "Expand sidebar"
                                        : "Collapse sidebar"
                                }
                            >
                                <FiMenu className="w-4 h-4 text-gray-600" />
                            </button>

                            {/* Mobile Close Button */}
                            <button
                                onClick={onMobileToggle}
                                className="lg:hidden p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            >
                                <FiX className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div
                        className={`flex-1 overflow-y-auto ${isCollapsed ? "px-2" : "px-3"} py-2`}
                    >
                        <div className="space-y-1">
                            {/* Section Header */}
                            {!isCollapsed && (
                                <div className="px-3 pb-1">
                                    <h1 className="font-medium text-gray-500 text-xs uppercase tracking-wider">
                                        Pages
                                    </h1>
                                </div>
                            )}

                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={isMobileOpen ? onMobileToggle : undefined}
                                        className={`${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses(item.href)}`}
                                    >
                                        <Icon className={iconClasses(active)} />
                                        {!isCollapsed && (
                                            <span className="ml-3 font-medium whitespace-nowrap">
                                                {item.label}
                                            </span>
                                        )}
                                        {isCollapsed && <Tooltip>{item.label}</Tooltip>}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminSideBar;
