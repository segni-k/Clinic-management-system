<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('prescriptions', function (Blueprint $table) {
            $table->foreignId('patient_id')->after('id')->constrained()->cascadeOnDelete();
            $table->text('diagnosis')->nullable()->after('doctor_id');
            $table->string('status')->default('active')->after('diagnosis'); // active, completed, cancelled
            $table->foreignId('created_by')->nullable()->after('notes')->constrained('users')->nullOnDelete();
            
            $table->index('patient_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::table('prescriptions', function (Blueprint $table) {
            $table->dropForeign(['patient_id']);
            $table->dropForeign(['created_by']);
            $table->dropIndex(['patient_id']);
            $table->dropIndex(['status']);
            $table->dropColumn(['patient_id', 'diagnosis', 'status', 'created_by']);
        });
    }
};
