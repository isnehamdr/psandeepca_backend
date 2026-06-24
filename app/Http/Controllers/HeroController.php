<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHeroRequest;
use App\Http\Requests\UpdateHeroRequest;
use App\Models\Hero;
use App\Services\HeroService;

class HeroController extends Controller
{
    protected HeroService $heroService;

    public function __construct(HeroService $heroService)
    {
        $this->heroService = $heroService;
    }

    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => $this->heroService->getAll(),
        ]);
    }

    public function store(StoreHeroRequest $request)
    {
        $hero = $this->heroService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Hero created successfully.',
            'data' => $hero,
        ], 201);
    }

    public function show(Hero $hero)
    {
        return response()->json([
            'success' => true,
            'data' => $this->heroService->getById($hero),
        ]);
    }

    public function update(UpdateHeroRequest $request, Hero $hero)
    {
        $hero = $this->heroService->update(
            $hero,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Hero updated successfully.',
            'data' => $hero,
        ]);
    }

    public function destroy(Hero $hero)
    {
        $this->heroService->delete($hero);

        return response()->json([
            'success' => true,
            'message' => 'Hero deleted successfully.',
        ]);
    }
}