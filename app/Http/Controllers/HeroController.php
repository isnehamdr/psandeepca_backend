<?php

namespace App\Http\Controllers;

use App\Models\Hero;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HeroController extends Controller
{
    /**
     * Display all heroes.
     */
    public function index()
    {
        $heroes = Hero::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $heroes,
        ]);
    }

    /**
     * Store a newly created hero.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_active' => 'required|boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('heroes', 'public');
        }

        $hero = Hero::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Hero created successfully.',
            'data' => $hero,
        ], 201);
    }

    /**
     * Update the specified hero.
     */
    public function update(Request $request, Hero $hero)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_active' => 'required|boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($hero->image && Storage::disk('public')->exists($hero->image)) {
                Storage::disk('public')->delete($hero->image);
            }

            $validated['image'] = $request->file('image')->store('heroes', 'public');
        }

        $hero->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Hero updated successfully.',
            'data' => $hero,
        ]);
    }

    /**
     * Remove the specified hero.
     */
    public function destroy(Hero $hero)
    {
        if ($hero->image && Storage::disk('public')->exists($hero->image)) {
            Storage::disk('public')->delete($hero->image);
        }

        $hero->delete();

        return response()->json([
            'success' => true,
            'message' => 'Hero deleted successfully.',
        ]);
    }

    /**
     * Display a single hero.
     */
    public function show(Hero $hero)
    {
        return response()->json([
            'success' => true,
            'data' => $hero,
        ]);
    }
}