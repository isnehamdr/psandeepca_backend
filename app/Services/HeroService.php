<?php

namespace App\Services;

use App\Models\Hero;
use Illuminate\Support\Facades\Storage;

class HeroService
{
    public function getAll()
    {
        return Hero::latest()->get();
    }

    public function getById(Hero $hero)
    {
        return $hero;
    }

    public function create(array $data)
    {
        if (isset($data['image'])) {
            $data['image'] = $data['image']->store('heroes', 'public');
        }

        return Hero::create($data);
    }

    public function update(Hero $hero, array $data)
    {
        if (isset($data['image'])) {

            if (
                $hero->image &&
                Storage::disk('public')->exists($hero->image)
            ) {
                Storage::disk('public')->delete($hero->image);
            }

            $data['image'] = $data['image']->store('heroes', 'public');
        }

        $hero->update($data);

        return $hero->fresh();
    }

    public function delete(Hero $hero)
    {
        if (
            $hero->image &&
            Storage::disk('public')->exists($hero->image)
        ) {
            Storage::disk('public')->delete($hero->image);
        }

        return $hero->delete();
    }
}