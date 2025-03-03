<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Tenant;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Tenant $tenant)
    {
        $users = $tenant->users()
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('tenants/users/index', [
            'tenant' => $tenant,
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Tenant $tenant)
    {
        return Inertia::render('tenants/users/create', [
            'tenant' => $tenant
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserStoreRequest $request, Tenant $tenant)
    {
        $userPassword = Str::random(15);

        $validated = $request->validated();

        $tenant->users()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($userPassword)
        ]);

        return redirect()->route('tenants.users.index', $tenant)
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Tenant $tenant, User $user)
    {
        return Inertia::render('tenants/users/show', [
            'tenant' => $tenant,
            'user' => $user
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tenant $tenant, User $user)
    {
        return Inertia::render('tenants/users/edit', [
            'tenant' => $tenant,
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request, Tenant $tenant, User $user)
    {
        $validated = $request->validated();

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if ($request->filled('password')) {
            $user->update(['password' => bcrypt($validated['password'])]);
        }

        return redirect()->route('tenants.users.index', $tenant)
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tenant $tenant, User $user)
    {
        $user->delete();

        return redirect()->route('tenants.users.index', $tenant)
            ->with('success', 'User deleted successfully.');
    }
}
