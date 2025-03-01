<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Tenant;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\TenantStoreRequest;

class TenantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tenants = Tenant::query()
        ->withCount('users')
        ->orderBy('name')
        ->paginate(9);
        
        return Inertia::render('tenants/index', [
            'tenants' => $tenants,
            'can' => [
                'create' => true,
                'edit' => true,
                'delete' => true,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('tenants/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TenantStoreRequest $request)
    {
        $userPassword = Str::random(15); 

        $tenant = Tenant::create([
            'name' => $request->input('tenantName'),
            'email' =>  $request->input('userEmail'),
            'description' => $request->input('tenantDescription'),
            'logo_path' => $request->file('tenantLogoPath')->store('logos', 'public'),
        ]);

        $user = $tenant->users()->create([
            'name' =>  $request->input('userFullName'),
            'email' => $request->input('userEmail'),
            'password' => Hash::make($userPassword)
        ]);

        //TODO: replace this with mailing system
        info('User Login Details' , ['email' => $user->email , 'password' => $userPassword]);

        return redirect()->route('tenants.index')->with('success', 'Tenant and user created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Tenant $tenant)
    {
        // Code to show a specific tenant
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tenant $tenant)
    {
        // Code to show form for editing a tenant
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tenant $tenant)
    {
        // Code to update a specific tenant
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tenant $tenant)
    {
        // Code to delete a specific tenant
    }
}
