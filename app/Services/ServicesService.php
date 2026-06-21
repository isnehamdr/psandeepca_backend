<?php

namespace App\Services;

use App\Models\Service;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Collection;

class ServicesService
{
    /**
     * Get all services.
     */
    public function getAll(): Collection
    {
        return Service::orderBy('sort_order', 'asc')->get();
    }

    /**
     * Find a service or fail.
     */
    public function find(int $id): Service
    {
        return Service::findOrFail($id);
    }

    /**
     * Create a new service.
     */
    public function create(array $data): Service
    {
        $payload = [
            'title'             => $data['title'],
            'short_description' => $data['short_description'] ?? null,
            'description'       => $data['description'] ?? null,
            'detail'            => $data['detail'] ?? null,
            'is_active'         => $data['is_active'],
            'sort_order'        => $data['sort_order'],
        ];

        if (!empty($data['icon'])) {
            $payload['icon'] = $data['icon']->store('services/icons', 'public');
        }

        if (!empty($data['image'])) {
            $payload['image'] = $data['image']->store('services/images', 'public');
        }

        return Service::create($payload);
    }

    /**
     * Update an existing service.
     */
    public function update(Service $service, array $data): Service
    {
        $payload = [
            'title'             => $data['title'],
            'short_description' => $data['short_description'] ?? null,
            'description'       => $data['description'] ?? null,
            'detail'            => $data['detail'] ?? null,
            'is_active'         => $data['is_active'],
            'sort_order'        => $data['sort_order'],
        ];

        if (!empty($data['icon'])) {
            if ($service->icon && Storage::disk('public')->exists($service->icon)) {
                Storage::disk('public')->delete($service->icon);
            }
            $payload['icon'] = $data['icon']->store('services/icons', 'public');
        }

        if (!empty($data['image'])) {
            if ($service->image && Storage::disk('public')->exists($service->image)) {
                Storage::disk('public')->delete($service->image);
            }
            $payload['image'] = $data['image']->store('services/images', 'public');
        }

        $service->update($payload);

        return $service;
    }

    /**
     * Delete a service.
     */
    public function delete(Service $service): void
    {
        if ($service->icon && Storage::disk('public')->exists($service->icon)) {
            Storage::disk('public')->delete($service->icon);
        }

        if ($service->image && Storage::disk('public')->exists($service->image)) {
            Storage::disk('public')->delete($service->image);
        }

        $service->delete();
    }
}