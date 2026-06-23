import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import AddService from "@/AddForm/AddService";
import EditService from "@/EditForm/EditService";

const AdminService = () => {
    const [allService, setAllService] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [viewingService, setViewingService] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [pageError, setPageError] = useState(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get(route("ourservices.index"));
                setAllService(response.data.data);
                setPageError(null);
            } catch (error) {
                console.error("fetching error ", error);
                setPageError("Could not load services. Please refresh the page.");
            }
        };

        fetchService();
    }, [reloadTrigger]);

    const handleDelete = async () => {
        if (!serviceToDelete) return;
        
        try {
            await axios.delete(route("ourservices.destroy", { id: serviceToDelete }));
            setReloadTrigger((prev) => !prev);
            setShowDeleteDialog(false);
            setServiceToDelete(null);
        } catch (error) {
            console.error(error);
            setPageError("Could not delete this service. Please try again.");
            setShowDeleteDialog(false);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setShowEditForm(true);
    };

    const handleView = (service) => {
        setViewingService(service);
        setShowViewModal(true);
    };

    const handleDeleteClick = (id) => {
        setServiceToDelete(id);
        setShowDeleteDialog(true);
    };

    // Define columns
    const columns = useMemo(() => [
        {
            Header: "Icon",
            accessor: "icon",
            Cell: ({ value }) => (
                value ? (
                    <img
                        src={`/storage/${value}`}
                        alt="icon"
                        className="h-10 w-10 object-cover rounded"
                    />
                ) : null
            ),
        },
        {
            Header: "Title",
            accessor: "title",
        },
        {
            Header: "Sort Order",
            accessor: "sort_order",
        },
        {
            Header: "Active",
            accessor: "is_active",
            Cell: ({ value }) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                    {value ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            Header: "Created At",
            accessor: "created_at",
            Cell: ({ value }) => (
                <span className="text-gray-400">
                    {new Date(value).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </span>
            ),
        },
        {
            Header: "Created Time",
            accessor: "created_at_time",
            Cell: ({ row }) => (
                <span className="text-gray-400">
                    {new Date(row.original.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                    })}
                </span>
            ),
        },
        {
            Header: "Actions",
            id: "actions",
            Cell: ({ row }) => (
                <div className="space-x-2">
                    <button
                        onClick={() => handleView(row.original)}
                        className="p-2 hover:bg-gray-100 rounded-full text-blue-500 hover:text-blue-700 transition"
                        title="View Service"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => handleEdit(row.original)}
                        className="p-2 hover:bg-gray-100 rounded-full text-indigo-500 hover:text-indigo-700 transition"
                        title="Edit Service"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => handleDeleteClick(row.original.id)}
                        className="p-2 hover:bg-gray-100 rounded-full text-red-500 hover:text-red-700 transition"
                        title="Delete Service"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ], []);

    const data = useMemo(() => allService, [allService]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state,
        setGlobalFilter,
        previousPage,
        nextPage,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageSize: 10 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    // Delete Confirmation Dialog
    const DeleteConfirmationDialog = () => {
        if (!showDeleteDialog) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Delete Service
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to delete this service? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setServiceToDelete(null);
                                }}
                                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // View Modal
    const ViewModal = () => {
        if (!showViewModal || !viewingService) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Service Details
                        </h2>
                        <button
                            onClick={() => {
                                setShowViewModal(false);
                                setViewingService(null);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {viewingService.icon && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon
                                </label>
                                <img
                                    src={`/storage/${viewingService.icon}`}
                                    alt={viewingService.title}
                                    className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <p className="text-gray-900">{viewingService.title}</p>
                        </div>

                        {viewingService.short_description && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Short Description
                                </label>
                                <div 
                                    className="text-gray-900 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: viewingService.short_description }}
                                />
                            </div>
                        )}

                        {viewingService.description && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <div 
                                    className="text-gray-900 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: viewingService.description }}
                                />
                            </div>
                        )}

                        {viewingService.detail && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Detail
                                </label>
                                <div 
                                    className="text-gray-900 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: viewingService.detail }}
                                />
                            </div>
                        )}

                        {viewingService.image && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Image
                                </label>
                                <img
                                    src={`/storage/${viewingService.image}`}
                                    alt={viewingService.title}
                                    className="max-h-64 object-cover rounded-lg border border-gray-200"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sort Order
                            </label>
                            <p className="text-gray-900">{viewingService.sort_order}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                viewingService.is_active 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-700'
                            }`}>
                                {viewingService.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <div className="text-sm text-gray-500">
                                <p>Created: {new Date(viewingService.created_at).toLocaleString()}</p>
                                {viewingService.updated_at && (
                                    <p>Updated: {new Date(viewingService.updated_at).toLocaleString()}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
                        <button
                            onClick={() => {
                                setShowViewModal(false);
                                setViewingService(null);
                            }}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => {
                                setShowViewModal(false);
                                handleEdit(viewingService);
                            }}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2"
                        >
                            <Pencil size={16} />
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <AdminWrapper>
                <div className="mb-8 flex justify-between items-center flex-wrap gap-4 mt-8">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                            Service Management
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Total: {allService.length} services
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={state.globalFilter || ''}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                        />
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                        >
                            <Plus size={18} />
                            <span>Create</span>
                        </button>
                    </div>
                </div>

                {pageError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                        {pageError}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    <table {...getTableProps()} className="min-w-full text-sm">
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()} className="text-left border-b bg-gray-50">
                                    {headerGroup.headers.map(column => (
                                        <th 
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                                        >
                                            <div className="flex items-center gap-1">
                                                {column.render('Header')}
                                                <span>
                                                    {column.isSorted
                                                        ? column.isSortedDesc
                                                            ? ' 🔽'
                                                            : ' 🔼'
                                                        : ''}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                                        {state.globalFilter ? 'No services match your search.' : 'No services found.'}
                                    </td>
                                </tr>
                            ) : (
                                page.map(row => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()} className="border-b hover:bg-gray-50 transition">
                                            {row.cells.map(cell => (
                                                <td {...cell.getCellProps()} className="p-3">
                                                    {cell.render('Cell')}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => previousPage()}
                                disabled={!canPreviousPage}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => nextPage()}
                                disabled={!canNextPage}
                                className="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{page.length === 0 ? 0 : (state.pageIndex * state.pageSize) + 1}</span>
                                    {' '}to{' '}
                                    <span className="font-medium">
                                        {Math.min((state.pageIndex + 1) * state.pageSize, allService.length)}
                                    </span>
                                    {' '}of{' '}
                                    <span className="font-medium">{allService.length}</span>
                                    {' '}results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => previousPage()}
                                        disabled={!canPreviousPage}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    {pageOptions.map(pageNum => (
                                        <button
                                            key={pageNum}
                                            onClick={() => gotoPage(pageNum)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                state.pageIndex === pageNum
                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNum + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => nextPage()}
                                        disabled={!canNextPage}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <AddService
                    showForm={showAddForm}
                    setShowForm={setShowAddForm}
                    setReloadTrigger={setReloadTrigger}
                />

                <EditService
                    showForm={showEditForm}
                    setShowForm={setShowEditForm}
                    setReloadTrigger={setReloadTrigger}
                    editingService={editingService}
                    setEditingService={setEditingService}
                />

                <ViewModal />
                <DeleteConfirmationDialog />
            </AdminWrapper>
        </>
    );
};

export default AdminService;