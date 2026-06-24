import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, Eye, X, AlertTriangle } from 'lucide-react';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';
import parse from 'html-react-parser';
import AdminWrapper from '@/AdminWrapper/AdminWrapper';
import AddHero from '@/AddForm/AddHero';
import EditHero from '@/EditForm/EditHero';

const AdminHero = () => {
	const [allHero, setAllHero] = useState([]);
	const [reloadTrigger, setReloadTrigger] = useState(false);
	const [editingHero, setEditingHero] = useState(null);
	const [viewingHero, setViewingHero] = useState(null);
	const [showAddForm, setShowAddForm] = useState(false);
	const [showEditForm, setShowEditForm] = useState(false);
	const [showViewModal, setShowViewModal] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [heroToDelete, setHeroToDelete] = useState(null);
	const imgurl = import.meta.env.VITE_IMAGE_PATH;

	// Fetch hero data
	useEffect(() => {
		const fetchHero = async () => {
			try {
				const response = await axios.get(route('ourhero.index'));
				setAllHero(response.data.data?.data ?? response.data.data ?? []);
			} catch (error) {
				console.error('fetching error ', error);
			}
		};

		fetchHero();
	}, [reloadTrigger]);

	// Delete hero
	const handleDelete = async () => {
		if (!heroToDelete) return;
		try {
			await axios.delete(route('ourhero.destroy', { hero: heroToDelete }));
			setReloadTrigger((prev) => !prev);
			setShowDeleteDialog(false);
			setHeroToDelete(null);
		} catch (error) {
			console.log(error);
		}
	};

	// Handle edit
	const handleEdit = (hero) => {
		setEditingHero(hero);
		setShowEditForm(true);
	};

	// Handle view
	const handleView = (hero) => {
		setViewingHero(hero);
		setShowViewModal(true);
	};

	// Handle update after edit
	const handleUpdate = async (formData, id) => {
		try {
			formData.append('_method', 'PUT');
			const response = await axios.post(route('ourhero.update', { hero: id }), formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			setReloadTrigger((prev) => !prev);
			return response.data;
		} catch (error) {
			console.log('Error updating Hero', error);
			throw error;
		}
	};

	// Open delete confirmation
	const confirmDelete = (id) => {
		setHeroToDelete(id);
		setShowDeleteDialog(true);
	};

	// Helper function to truncate HTML content
	const truncateHTML = (html, maxLength = 100) => {
		if (!html) return '';
		// Remove HTML tags for counting
		const plainText = html.replace(/<[^>]*>/g, '');
		if (plainText.length <= maxLength) return html;
		
		// Find the last space before maxLength
		const lastSpace = plainText.lastIndexOf(' ', maxLength);
		const truncatedPlain = plainText.substring(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
		
		// Return truncated HTML (we keep the HTML structure but truncate the text content)
		// This is a simple approach - for production, consider using a proper HTML truncation library
		return truncatedPlain;
	};



	// Define columns for React Table
	const columns = useMemo(
		() => [
			{
				Header: 'Image',
				accessor: 'image',
				disableSortBy: true,
				disableGlobalFilter: true,
				Cell: ({ value }) =>
					value ? (
						<img
							src={`${imgurl}/${value}`}
							alt="Hero"
							className="w-16 h-16 object-cover rounded-lg"
						/>
					) : (
						<span className="text-gray-400 text-xs">No image</span>
					),
			},
			{
				Header: 'Title',
				accessor: 'title',
				Cell: ({ value }) => (
					<div className="font-medium text-gray-800 prose prose-sm max-w-none line-clamp-2">
						{value ? parse(value) : ''}
					</div>
				),
			},
			{
				Header: 'Description',
				accessor: 'short_description',
				Cell: ({ value }) => (
					<div className="text-gray-600 prose prose-sm max-w-none line-clamp-3">
						{value ? parse(value) : ''}
					</div>
				),
			},
			{
				Header: 'Status',
				accessor: 'is_active',
				Cell: ({ value }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${
							value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
						}`}
					>
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
				Header: 'Actions',
				accessor: 'id',
				disableSortBy: true,
				disableGlobalFilter: true,
				Cell: ({ row }) => (
					<div className="flex justify-end items-center gap-1 whitespace-nowrap">
						<button
							onClick={() => handleView(row.original)}
							className="p-2 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
							title="View"
						>
							<Eye size={16} />
						</button>
						<button
							onClick={() => handleEdit(row.original)}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							title="Edit"
						>
							<Pencil size={16} />
						</button>
						<button
							onClick={() => confirmDelete(row.original.id)}
							className="p-2 hover:bg-red-100 text-red-600 rounded-full transition-colors"
							title="Delete"
						>
							<Trash2 size={16} />
						</button>
					</div>
				),
			},
		],
		[]
	);

	const data = useMemo(() => allHero, [allHero]);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		prepareRow,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize, globalFilter },
		setGlobalFilter,
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0, pageSize: 10 },
		},
		useGlobalFilter,
		useSortBy,
		usePagination
	);

	const handleSearch = (e) => {
		setGlobalFilter(e.target.value || undefined);
	};

	// Check if hero data exists
	const hasHeroData = allHero.length > 0;

	return (
		<AdminWrapper>
			<div className="mb-8 flex flex-wrap gap-4 justify-between items-center mt-8">
				<div>
					<h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
						Hero Management
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Total Heroes: {allHero.length}
					</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<div className="relative">
						<input
							type="text"
							placeholder="Search hero..."
							value={globalFilter || ''}
							onChange={handleSearch}
							className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
						/>
						<svg
							className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
					
					{/* Only show Create button if no hero data exists */}
					{!hasHeroData && (
						<button
							onClick={() => {
								setEditingHero(null);
								setShowAddForm(true);
							}}
							className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
						>
							<Plus size={18} />
							<span>Create</span>
						</button>
					)}
				</div>
			</div>

			{/* Hero table */}
			<div className="bg-white rounded-xl shadow overflow-hidden">
				<div className="overflow-x-auto">
					<table {...getTableProps()} className="min-w-full text-left text-sm table-fixed">
						<thead className="bg-gray-50 text-gray-600 uppercase text-xs">
							{headerGroups.map((headerGroup) => {
								const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
								return (
									<tr key={key} {...headerGroupProps}>
										{headerGroup.headers.map((column) => {
											const headerProps = column.canSort
												? column.getHeaderProps(column.getSortByToggleProps())
												: column.getHeaderProps();
											const { key: colKey, ...colProps } = headerProps;
											const isActionsColumn = column.id === 'id';
											const isImageColumn = column.id === 'image';
											const isStatusColumn = column.id === 'is_active';
											const isDescriptionColumn = column.id === 'short_description';
											const isTitleColumn = column.id === 'title';

											const widthClass = isActionsColumn
												? 'w-36'
												: isImageColumn
												? 'w-24'
												: isStatusColumn
												? 'w-28'
												: isDescriptionColumn
												? 'w-1/3'
												: isTitleColumn
												? 'w-1/4'
												: '';

											return (
												<th
													key={colKey}
													{...colProps}
													className={`px-4 py-3 font-medium select-none ${
														column.canSort
															? 'cursor-pointer hover:bg-gray-100'
															: 'cursor-default'
													} ${isActionsColumn ? 'text-right' : ''} ${widthClass}`}
												>
													<div
														className={`flex items-center gap-1 ${
															isActionsColumn ? 'justify-end' : ''
														}`}
													>
														{column.render('Header')}
														{column.canSort &&
															(column.isSorted ? (
																column.isSortedDesc ? (
																	<span className="text-xs">↓</span>
																) : (
																	<span className="text-xs">↑</span>
																)
															) : (
																<span className="text-xs text-gray-300">↕</span>
															))}
													</div>
												</th>
											);
										})}
									</tr>
								);
							})}
						</thead>
						<tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
							{page.length === 0 ? (
								<tr>
									<td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
										No hero data found. Click the "Create" button to add one.
									</td>
								</tr>
							) : (
								page.map((row) => {
									prepareRow(row);
									const { key, ...rowProps } = row.getRowProps();
									return (
										<tr key={key} {...rowProps} className="hover:bg-gray-50 transition-colors">
											{row.cells.map((cell) => {
												const { key: cellKey, ...cellProps } = cell.getCellProps();
												const isActionsCell = cell.column.id === 'id';
												return (
													<td
														key={cellKey}
														{...cellProps}
														className={`px-4 py-3 ${
															isActionsCell ? 'text-right' : ''
														}`}
													>
														{cell.render('Cell')}
													</td>
												);
											})}
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{allHero.length > 0 && (
					<div className="px-4 py-3 border-t border-gray-200 flex flex-wrap gap-4 items-center justify-between">
						<div className="flex items-center gap-3">
							<span className="text-sm text-gray-700">
								Page <span className="font-medium">{pageIndex + 1}</span> of{' '}
								<span className="font-medium">{pageOptions.length}</span>
							</span>
							<select
								value={pageSize}
								onChange={(e) => setPageSize(Number(e.target.value))}
								className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							>
								{[5, 10, 20, 30, 50].map((size) => (
									<option key={size} value={size}>
										Show {size}
									</option>
								))}
							</select>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => gotoPage(0)}
								disabled={!canPreviousPage}
								className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								First
							</button>
							<button
								onClick={() => previousPage()}
								disabled={!canPreviousPage}
								className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Previous
							</button>
							<button
								onClick={() => nextPage()}
								disabled={!canNextPage}
								className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Next
							</button>
							<button
								onClick={() => gotoPage(pageCount - 1)}
								disabled={!canNextPage}
								className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Last
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Add Hero Form - only render if no data exists */}
			{!hasHeroData && (
				<AddHero
					showForm={showAddForm}
					setShowForm={setShowAddForm}
					setReloadTrigger={setReloadTrigger}
				/>
			)}

			{/* Edit Hero Form */}
			<EditHero
				showForm={showEditForm}
				setShowForm={setShowEditForm}
				setReloadTrigger={setReloadTrigger}
				editingHero={editingHero}
				setEditingHero={setEditingHero}
				handleUpdate={handleUpdate}
			/>

			{/* View Hero Modal */}
			{showViewModal && viewingHero && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-gray-800">Hero Details</h2>
							<button
								onClick={() => setShowViewModal(false)}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							>
								<X size={24} />
							</button>
						</div>

						<div className="space-y-6">
							{viewingHero.image && (
								<div className="rounded-lg overflow-hidden">
									<img
										src={`${imgurl}/${viewingHero.image}`}
										alt={viewingHero.title}
										className="w-full h-64 object-cover"
									/>
								</div>
							)}

							<div>
								<h3 className="text-2xl font-bold text-gray-900 prose prose-lg max-w-none">
									{viewingHero.title ? parse(viewingHero.title) : ''}
								</h3>
								<div className="text-gray-600 mt-4 prose prose-base max-w-none">
									{viewingHero.short_description ? parse(viewingHero.short_description) : ''}
								</div>
							</div>

							<div className="flex items-center gap-3">
								<span
									className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
										viewingHero.is_active
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-600'
									}`}
								>
									{viewingHero.is_active ? 'Active' : 'Inactive'}
								</span>
							</div>
						</div>

						<div className="flex justify-end gap-3 pt-4 mt-4 border-t">
							<button
								onClick={() => setShowViewModal(false)}
								className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			{showDeleteDialog && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
						<div className="flex justify-between items-start mb-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-red-100 rounded-full">
									<AlertTriangle className="text-red-600" size={24} />
								</div>
								<h3 className="text-lg font-semibold text-gray-900">Delete Hero</h3>
							</div>
							<button
								onClick={() => {
									setShowDeleteDialog(false);
									setHeroToDelete(null);
								}}
								className="p-1 hover:bg-gray-100 rounded-full transition-colors"
							>
								<X size={20} />
							</button>
						</div>

						<p className="text-gray-600 mb-6">
							Are you sure you want to delete this hero? This action cannot be undone.
						</p>

						<div className="flex justify-end gap-3">
							<button
								onClick={() => {
									setShowDeleteDialog(false);
									setHeroToDelete(null);
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
			)}
		</AdminWrapper>
	);
};

export default AdminHero;