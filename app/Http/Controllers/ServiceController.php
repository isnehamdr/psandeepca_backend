<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Services\ServicesService;

class ServiceController extends Controller
{
    public function __construct(protected ServicesService $servicesService)
    {
    }

    /**
     * Display all services.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => $this->servicesService->getAll()
        ]);
    }

    public function indexShowServiceSlug(string $slug)
{
    $service = $this->servicesService->getBySlug($slug);

    if (! $service) {
        return response()->json([
            'success' => false,
            'message' => 'Service not found.'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data'    => $service
    ]);
}

    /**
     * Store a newly created service.
     */
    public function store(StoreServiceRequest $request)
    {
        $data = $request->validated();
        $data['icon'] = $request->file('icon');
        $data['image'] = $request->file('image');

        $service = $this->servicesService->create($data);

        return response()->json([
            'success' => true,
            'message' => 'Service created successfully.',
            'data'    => $service
        ], 201);
    }

    /**
     * Update the specified service.
     */
    public function update(UpdateServiceRequest $request, $id)
    {
        $service = $this->servicesService->find($id);

        $data = $request->validated();
        $data['icon'] = $request->file('icon');
        $data['image'] = $request->file('image');

        $updated = $this->servicesService->update($service, $data);

        return response()->json([
            'success' => true,
            'message' => 'Service updated successfully.',
            'data'    => $updated
        ]);
    }

    /**
     * Remove the specified service.
     */
    public function destroy($id)
    {
        $service = $this->servicesService->find($id);
        $this->servicesService->delete($service);

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully.'
        ]);
    }
}