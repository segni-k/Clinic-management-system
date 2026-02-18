<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            // Unique index on phone for duplicate phone number prevention
            $table->unique('phone');
        });

        Schema::table('appointments', function (Blueprint $table) {
            // Composite index for efficient querying of doctor appointments by date and timeslot
            // Prevents double booking by allowing quick lookup of existing appointments
            $table->index(['doctor_id', 'appointment_date', 'timeslot']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropUnique(['phone']);
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->dropIndex(['doctor_id', 'appointment_date', 'timeslot']);
        });
    }
};
